#!/usr/bin/env node
/*
 * lint.js — structural invariant checker for index.html
 *
 * USAGE:   node lint.js [path/to/index.html]
 *          (defaults to ./index.html)
 *
 * WHAT IT CHECKS (per data array — CASES, STATUTES, ARREST, DOCTRINES, ORDINANCES):
 *   1. JS syntax of the whole inline script parses (node --check equivalent).
 *   2. Every record has its required fields present.
 *   3. No duplicate primary keys (cite / sec / art / name / ord).
 *   4. Every category/tag id used by a record exists in its companion *_CATS array.
 *   5. STATUTES.code and CASES.court use known values; lvlClass uses a known value.
 *   6. Enumerates every verify:true entry as a tracked backlog list (for the
 *      verification punch-list) and warns on any *_CATS id used by zero records.
 *
 * EXIT CODE: 0 if no ERRORs, 1 if any ERROR. WARNINGs never fail the build.
 *
 * This is a read-only analysis. It never modifies the HTML.
 */
"use strict";
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const file = process.argv[2] || "index.html";
let html;
try { html = fs.readFileSync(file, "utf8"); }
catch (e) { console.error(`Cannot read ${file}: ${e.message}`); process.exit(2); }

const errors = [];
const warnings = [];
const err  = m => errors.push(m);
const warn = m => warnings.push(m);

/* ---- 1. Syntax gate: does the whole inline JS parse? ---- */
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const inlineJs = scripts.filter(s => /function|const |=>/.test(s)).join("\n;\n");
try { new vm.Script(inlineJs); }
catch (e) { err(`SYNTAX: inline script does not parse — ${e.message}`); }

/* ---- Scalar extractor for `const NAME = "string";` or `const NAME = 123;`,
   used for EMBED_MODEL/EMBED_DIM/EMBED_VECS_B64 — extractDecl above only
   handles array/object literals, which these three are not. ---- */
function extractScalar(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*("(?:[^"\\\\]|\\\\.)*"|\\d+(?:\\.\\d+)?)\\s*;`);
  const m = re.exec(src);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return m[1]; }
}

/* ---- Balanced, string/comment-aware extractor for `const NAME = <literal>` ---- */
function extractDecl(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=`);
  const m = re.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < src.length && src[i] !== "[" && src[i] !== "{") i++;
  if (i >= src.length) return null;
  const open = src[i], close = open === "[" ? "]" : "}";
  let depth = 0, inStr = null, esc = false;
  const start = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i++; continue; }
    if (c === "[" || c === "{" || c === "(") depth++;
    else if (c === "]" || c === "}" || c === ")") { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  return null;
}

/* ---- 2. Evaluate the pure-data declarations into native objects ---- */
const NAMES = ["CIRCUITS","CALL_TYPES","CASES","CODE_CATS","STATUTES",
               "ARREST_CATS","ARREST","DOCTRINE_CATS","DOCTRINES",
               "ORDINANCE_CATS","ORDINANCES","TRAINING"];
const decls = [];
for (const n of NAMES) {
  const lit = extractDecl(html, n);
  if (!lit) { err(`EXTRACT: could not locate declaration for ${n}`); continue; }
  decls.push(`const ${n} = ${lit};`);
}
let DATA;
if (!errors.some(e => e.startsWith("EXTRACT") || e.startsWith("SYNTAX"))) {
  try {
    DATA = vm.runInNewContext(decls.join("\n") + `\n;({${NAMES.join(",")}})`);
  } catch (e) { err(`EVAL: data declarations did not evaluate — ${e.message}`); }
}

if (DATA) {
  const idset = arr => new Set((DATA[arr] || []).map(c => c.id));
  const vocab = {
    CALL_TYPES: idset("CALL_TYPES"),
    CODE_CATS: idset("CODE_CATS"),
    ARREST_CATS: idset("ARREST_CATS"),
    DOCTRINE_CATS: idset("DOCTRINE_CATS"),
    ORDINANCE_CATS: idset("ORDINANCE_CATS"),
  };
  const circuitIds = idset("CIRCUITS");                 // includes "all"
  const validCourt = new Set(["scotus", ...circuitIds]);
  const validCode = new Set(["penal", "transpo", "hsc", "ccp"]);
  const knownLvl = new Set(["f","m","c","p","l"]);

  const SPEC = {
    CASES:      { key:"name", req:["name","cite","court","std","tags","holding","street"],
                  tagField:"tags", vocab:"CALL_TYPES" },
    STATUTES:   { key:"sec", req:["sec","name","code","cats","level","lvlClass","text","summary","street"],
                  tagField:"cats", vocab:"CODE_CATS" },
    ARREST:     { key:"art", req:["art","name","basis","tags","summary","street","text"],
                  tagField:"tags", vocab:"ARREST_CATS" },
    DOCTRINES:  { key:"name", req:["name","anchor","cat","kw","summary","street"],
                  tagField:"cat", vocab:"DOCTRINE_CATS" },
    ORDINANCES: { key:"ord", req:["ord","name","city","cats","level","lvlClass","text","summary","street"],
                  tagField:"cats", vocab:"ORDINANCE_CATS" },
    TRAINING:   { key:"name", req:["name","url","summary","kw"] },
  };

  const backlog = {};        // arrayName -> [keys with verify:true]
  const catUse = {};         // vocabName -> Set of ids actually used

  for (const [arr, spec] of Object.entries(SPEC)) {
    const records = DATA[arr] || [];
    const seen = new Set();
    catUse[spec.vocab] = catUse[spec.vocab] || new Set();
    records.forEach((r, idx) => {
      const label = r[spec.key] != null ? `${arr}[${spec.key}=${JSON.stringify(r[spec.key])}]` : `${arr}[#${idx}]`;
      // required fields present (value may be null for text/std)
      for (const f of spec.req) {
        if (!Object.prototype.hasOwnProperty.call(r, f)) err(`MISSING FIELD: ${label} lacks '${f}'`);
      }
      // duplicate primary key
      const k = r[spec.key];
      if (k != null) { if (seen.has(k)) err(`DUPLICATE KEY: ${arr} has two records with ${spec.key}=${JSON.stringify(k)}`); seen.add(k); }
      // category / tag membership
      const tags = r[spec.tagField];
      if (Array.isArray(tags)) {
        for (const t of tags) {
          catUse[spec.vocab].add(t);
          if (!vocab[spec.vocab].has(t)) err(`UNKNOWN ${spec.tagField.toUpperCase()}: ${label} uses '${t}' not in ${spec.vocab}`);
        }
      } else if (spec.req.includes(spec.tagField)) {
        err(`BAD FIELD: ${label} '${spec.tagField}' is not an array`);
      }
      // code / court / lvlClass sanity
      if (arr === "STATUTES" && r.code != null && !validCode.has(r.code)) err(`UNKNOWN CODE: ${label} code='${r.code}'`);
      if (arr === "CASES" && r.court != null && !validCourt.has(r.court)) err(`UNKNOWN COURT: ${label} court='${r.court}'`);
      if ("lvlClass" in r && !knownLvl.has(r.lvlClass)) warn(`LVLCLASS: ${label} lvlClass='${r.lvlClass}' (known: f,m,c,p)`);
      // verify backlog
      if (r.verify === true) { (backlog[arr] = backlog[arr] || []).push(String(k)); }
    });
  }

  // warn on unused category ids
  for (const [v, set] of Object.entries(vocab)) {
    for (const id of set) if (!catUse[v] || !catUse[v].has(id)) warn(`UNUSED CATEGORY: '${id}' in ${v} is used by zero records`);
  }

  /* ---- Build stamp ----
     Three failure modes this catches, all of which have actually bitten:
       1. an UNSTAMPED build  -> you can't tell what produced a live deploy;
       2. a build whose stamp DISAGREES with sw.js CACHE_VERSION -> the cache
          key wasn't bumped, so returning users keep the old app forever;
       3. a build made from a DIRTY working tree -> the commit doesn't describe
          what actually shipped. */
  const stampM = /const BUILD_ID = "([^"]*)"/.exec(html);
  if (!stampM) {
    err("BUILD: no BUILD_ID constant found — rebuild with the current build.py");
  } else if (stampM[1] === "__BUILD_ID__" || !stampM[1]) {
    err("BUILD: BUILD_ID is still the unsubstituted placeholder — this HTML was not produced by build.py");
  } else {
    const stamp = stampM[1];
    console.log(`=== Build ===\n  ${stamp}`);
    const swPath = path.join(path.dirname(path.resolve(file)), "sw.js");
    if (fs.existsSync(swPath)) {
      const swm = /CACHE_VERSION\s*=\s*"([^"]+)"/.exec(fs.readFileSync(swPath, "utf8"));
      if (swm) {
        const stampVer = stamp.split("\u00b7")[0].trim();
        if (stampVer !== swm[1]) {
          err(`BUILD: stamp says '${stampVer}' but sw.js CACHE_VERSION is '${swm[1]}' — rebuild after bumping, or returning users will keep the cached old app`);
        } else {
          console.log(`  cache key matches sw.js: ${swm[1]}`);
        }
      }
    } else {
      warn("BUILD: no sw.js next to index.html — cannot verify the cache key matches the build stamp");
    }
    if (/-dirty/.test(stamp)) warn("BUILD: built from a dirty working tree — commit before deploying so the stamp identifies the source");
  }

  /* ---- Penalty-ladder integrity ----
     The `level` badge is what an officer reads before anything else. If the
     statute can reach a grade higher than `level` names, the guide understates
     the offense — that is how a felony gets worked as a ticket. This compares
     `level` against the grades ASSIGNED in the entry's own verbatim text and
     fails the build on a mismatch. Same principle as the cache-version guard:
     make the regression impossible rather than remembering not to cause it. */
  {
    const ORDER=["MC","MB","MA","SJF","F3","F2","F1","CAP"];
    const NM={MC:"Class C",MB:"Class B",MA:"Class A",SJF:"state jail felony",F3:"3rd-degree",F2:"2nd-degree",F1:"1st-degree",CAP:"capital felony"};
    const TXT=[["CAP",/capital felony/i],["F1",/felony of the first degree/i],["F2",/felony of the second degree/i],
      ["F3",/felony of the third degree/i],["SJF",/state jail felony/i],["MA",/Class A misdemeanor/i],
      ["MB",/Class B misdemeanor/i],["MC",/Class C misdemeanor/i]];
    /* The level field uses shorthand: "2nd with prior", "F3 against elderly",
       "Class C / B / A". Match all of it, or the guard fires on correct entries
       and gets ignored — a false alarm is worse than no alarm. */
    const LVL=[["CAP",/capital/i],["F1",/\b1st\b|\bfirst[- ]degree|\bF1\b/i],["F2",/\b2nd\b|\bsecond[- ]degree|\bF2\b/i],
      ["F3",/\b3rd\b|\bthird[- ]degree|\bF3\b/i],["SJF",/state jail|\bSJF\b/i],
      ["MA",/Class A|\/ ?A\b/i],["MB",/Class B|\/ ?B\b/i],["MC",/Class C|\/ ?C\b/i]];
    const XREF=/offense (solicited|attempted|conspired|committed)|one category (lower|higher)|same (degree|category) as/i;
    const topOf=(str,tbl)=>{let best=-1;
      for(const [k,re] of tbl){ if(re.test(str||"")) best=Math.max(best,ORDER.indexOf(k)); }
      return best;};
    const statTop=t=>{ if(!t) return -1; const s=t.replace(/\s+/g," "); let best=-1;
      for(const [k,re] of TXT){ const g=new RegExp(re.source,"gi"); let m;
        while((m=g.exec(s))){ const b=s.slice(Math.max(0,m.index-140),m.index);
          if(XREF.test(b.slice(-90))) continue;
          if(/\bdefense\b|affirmative defense/i.test(b.slice(-70))) continue;
          best=Math.max(best,ORDER.indexOf(k)); } }
      return best;};
    let bad=0;
    for(const arr of ["STATUTES","ORDINANCES"]){
      for(const e of (DATA[arr]||[])){
        if(!e.text||!e.level) continue;
        if(e.lvlClass==="p") continue;                 // procedure/reference, not an offense
        /* Relative-grade offenses (conspiracy, organized criminal activity, terrorism,
           drug-free-zone enhancements) borrow their grade from the underlying offense.
           "One category lower than the object felony" is CORRECT and must not be
           forced into a fixed range. */
        if(/one (category|grade) (lower|higher|above|below)|punishment enhancement/i.test(e.level)) continue;
        const st=statTop(e.text), lv=topOf(e.level,LVL);
        if(st<0||lv<0) continue;
        if(st>lv){ bad++;
          err(`PENALTY: ${e.sec||e.ord} level says "${e.level.slice(0,46)}" but the text assigns up to a ${NM[ORDER[st]]} — level understates the offense`); }
      }
    }
    if(!bad) console.log("\n=== Penalty ladders ===\n  every level covers the highest grade its text assigns ✓");

    /* ---- Ordinance badge tier ----
       A municipal ordinance violation is punishable by FINE ONLY. Badging it "m"
       paints it the same blue as a Class A/B misdemeanor, which is jailable and
       arrestable. That overstates the offense to an officer scanning the list.
       Fine-only -> "c". Only an ordinance that actually adopts a state-law Class
       A/B grade may be "m", and if it spans C->A it is a ladder ("l"). */
    let obad=0;
    for(const o of (DATA.ORDINANCES||[])){
      if(o.lvlClass==="p") continue;
      const jailable=/Class [AB]\b/i.test(o.level||"");
      if(o.lvlClass==="m" && !jailable){ obad++;
        err(`ORDINANCE TIER: ${o.ord} is badged "m" (jailable misdemeanor) but its level states no Class A/B grade — a fine-only municipal violation should be "c"`); }
      if(o.lvlClass==="c" && jailable){ obad++;
        err(`ORDINANCE TIER: ${o.ord} is badged "c" but its level reaches a Class A/B grade — should be "l" (ladder) or "m"`); }
    }
    if(!obad) console.log("  ordinance badges match their actual penalty tier ✓");
  }

  /* ---- Report ---- */
  console.log("\n=== Record counts ===");
  for (const arr of Object.keys(SPEC)) console.log(`  ${arr}: ${(DATA[arr]||[]).length}`);
  const totalVerify = Object.values(backlog).reduce((a, b) => a + b.length, 0);
  console.log(`\n=== verify:true backlog (${totalVerify}) ===`);
  for (const [arr, keys] of Object.entries(backlog)) {
    console.log(`  ${arr} (${keys.length}):`);
    keys.forEach(k => console.log(`     - ${k}`));
  }
  if (totalVerify === 0) console.log("  (none)");
}

/* ---- Semantic-search embeddings: referential integrity + staleness ---- */
if (DATA) {
  const embedModel = extractScalar(html, "EMBED_MODEL");
  const embedDim = extractScalar(html, "EMBED_DIM") || 0;
  const embedB64 = extractScalar(html, "EMBED_VECS_B64") || "";
  const embedIndexLit = extractDecl(html, "EMBED_INDEX");
  let embedIndex = [];
  if (embedIndexLit) {
    try { embedIndex = vm.runInNewContext(`(${embedIndexLit})`); }
    catch (e) { err(`EMBED: EMBED_INDEX did not evaluate — ${e.message}`); }
  } else {
    err("EMBED: could not locate EMBED_INDEX declaration");
  }

  if (embedIndex.length === 0 && embedDim === 0 && embedB64 === "") {
    console.log("\n=== Semantic search embeddings ===\n  (none yet — placeholder data-embeddings.js; keyword search only)");
  } else {
    let byteLen = -1;
    try { byteLen = Buffer.from(embedB64, "base64").length; }
    catch (e) { err(`EMBED: EMBED_VECS_B64 did not decode as base64 — ${e.message}`); }
    const expectedBytes = embedIndex.length * embedDim * 4;
    if (byteLen !== expectedBytes) {
      err(`EMBED: EMBED_VECS_B64 decodes to ${byteLen} bytes, expected ${expectedBytes} (${embedIndex.length} rows × ${embedDim} dims × 4 bytes/float)`);
    }

    const arrByType = { statute:"STATUTES", case:"CASES", arrest:"ARREST", doctrine:"DOCTRINES", ordinance:"ORDINANCES", training:"TRAINING" };
    const keyByType  = { statute:"sec", case:"name", arrest:"art", doctrine:"name", ordinance:"ord", training:"name" };
    let totalRecords = 0;
    for (const t of Object.keys(arrByType)) totalRecords += (DATA[arrByType[t]] || []).length;

    let missing = 0;
    for (const row of embedIndex) {
      const arrName = arrByType[row.type];
      if (!arrName) { err(`EMBED: unknown type '${row.type}' in EMBED_INDEX`); continue; }
      const exists = (DATA[arrName] || []).some(r => r[keyByType[row.type]] === row.key);
      if (!exists) missing++;
    }
    if (missing) err(`EMBED: ${missing} EMBED_INDEX row(s) reference records that no longer exist — regenerate data-embeddings.js`);
    if (embedIndex.length !== totalRecords) {
      warn(`EMBED: EMBED_INDEX has ${embedIndex.length} rows but data files have ${totalRecords} total records — regenerate data-embeddings.js to cover everything`);
    }
    console.log(`\n=== Semantic search embeddings ===\n  ${embedIndex.length} vectors, model=${embedModel}, dim=${embedDim}`);
  }
}

/* ---- Final report ---- */
console.log(`\n=== ${errors.length} error(s), ${warnings.length} warning(s) ===`);
warnings.forEach(w => console.log("  WARN  " + w));
errors.forEach(e => console.log("  ERROR " + e));
process.exit(errors.length ? 1 : 0);
