#!/usr/bin/env node
/*
 * generate-embeddings.js — precompute semantic-search vectors for the Field Guide.
 *
 * WHAT THIS IS FOR
 *   Replaces the placeholder data-embeddings.js with real vectors so the
 *   on-device semantic search in app-shell.html activates. Until you run
 *   this, the app works exactly as it does today (keyword search only) —
 *   nothing breaks either way.
 *
 * ONE-TIME SETUP (run on your own machine — needs normal internet access):
 *   npm install @xenova/transformers
 *
 * USAGE:
 *   node generate-embeddings.js
 *   -> writes ./data-embeddings.js (overwrites the placeholder)
 *
 * WHAT IT DOES
 *   1. Loads all data-*.js files the same way lint.js does (balanced-brace
 *      extraction of each `const NAME = [...]` declaration).
 *   2. Builds a short "concept text" per entry: name + level/category labels
 *      + summary + street points + keywords. Deliberately NOT the verbatim
 *      statute/ordinance text — too long, dilutes the signal, and would
 *      make the output file enormous.
 *   3. Embeds each concept text with Xenova/all-MiniLM-L6-v2 (384-dim,
 *      mean-pooled, L2-normalized) — a small on-device sentence-embedding
 *      model, not a chatbot. It never generates text, only produces a
 *      vector used later to rank existing entries by meaning.
 *   4. Writes data-embeddings.js: a parallel index (type + primary key) and
 *      a base64-encoded Float32 buffer of every vector, same row order.
 *
 * NOTE ON MODEL SOURCES — two SEPARATE downloads, don't confuse them:
 *   (a) THIS script downloads the model to your machine's local cache
 *       (via @xenova/transformers' own cache dir) just to run inference
 *       once, right now. Normal internet access is fine and expected here.
 *   (b) The APP's own runtime (in the browser, on an officer's phone) needs
 *       its OWN self-hosted copy of the model + the transformers.js library
 *       itself, so the app has zero external network calls — same reasoning
 *       as the self-hosted fonts. That's a separate download; see
 *       MODEL-README.txt for exact steps.
 *
 * REGENERATE this file whenever statute/case/arrest/doctrine/ordinance/
 * training content changes materially (new entries, meaningfully edited
 * summaries) — stale embeddings just mean stale-but-harmless rankings,
 * lint.js will warn you if the vector count no longer matches your data.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

/* ---- same balanced-brace extractor lint.js uses, so this stays in sync
   with however STATUTES/CASES/etc. are actually declared ---- */
function extractDecl(src, name) {
  const re = new RegExp(`const\\s+${name}\\s*=`);
  const m = re.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < src.length && src[i] !== "[" && src[i] !== "{") i++;
  if (i >= src.length) return null;
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

function loadArray(file, name) {
  const src = fs.readFileSync(path.join(__dirname, file), "utf8");
  const lit = extractDecl(src, name);
  if (!lit) throw new Error(`Could not find ${name} in ${file}`);
  return vm.runInNewContext(`(${lit})`);
}

console.log("Loading data files...");
const STATUTES       = loadArray("data-statutes.js",   "STATUTES");
const CODE_CATS      = loadArray("data-statutes.js",   "CODE_CATS");
const CASES          = loadArray("data-cases.js",      "CASES");
const CALL_TYPES     = loadArray("data-cases.js",      "CALL_TYPES");
const ARREST         = loadArray("data-arrest.js",     "ARREST");
const DOCTRINES      = loadArray("data-doctrines.js",  "DOCTRINES");
const DOCTRINE_CATS  = loadArray("data-doctrines.js",  "DOCTRINE_CATS");
const ORDINANCES     = loadArray("data-ordinances.js", "ORDINANCES");
const ORDINANCE_CATS = loadArray("data-ordinances.js", "ORDINANCE_CATS");
const TRAINING       = loadArray("data-training.js",   "TRAINING");

const catLabel = (cats, id) => (cats.find(c => c.id === id) || {}).label || id;

/* ---- build {type, key, text} rows — one per searchable entry ---- */
const rows = [];

for (const s of STATUTES) {
  const cats = (s.cats || []).map(c => catLabel(CODE_CATS, c)).join(" ");
  const text = [s.name, s.level, cats, s.summary, (s.street||[]).join(" "), s.kw||""].join(" ");
  rows.push({ type:"statute", key:s.sec, text });
}
for (const c of CASES) {
  const tags = (c.tags||[]).map(t => catLabel(CALL_TYPES, t)).join(" ");
  const text = [c.name, c.cite, tags, c.holding, (c.street||[]).join(" "), CASE_KEYWORDS[c.name]||""].join(" ");
  rows.push({ type:"case", key:c.name, text });
}
for (const a of ARREST) {
  const text = [a.name, a.basis, a.summary, (a.street||[]).join(" ")].join(" ");
  rows.push({ type:"arrest", key:a.art, text });
}
for (const d of DOCTRINES) {
  const cats = (d.cat||[]).map(c => catLabel(DOCTRINE_CATS, c)).join(" ");
  const anchorName = d.anchor && d.anchor.name || "";
  const anchorCite = d.anchor && d.anchor.cite || "";
  const text = [d.name, anchorName, anchorCite, d.also||"", cats, d.summary, (d.street||[]).join(" "), d.kw||""].join(" ");
  rows.push({ type:"doctrine", key:d.name, text });
}
for (const o of ORDINANCES) {
  const cats = (o.cats||[]).map(c => catLabel(ORDINANCE_CATS, c)).join(" ");
  const text = [o.name, o.level, cats, o.summary, (o.street||[]).join(" "), o.kw||""].join(" ");
  rows.push({ type:"ordinance", key:o.ord, text });
}
for (const t of TRAINING) {
  const text = [t.name, t.summary, t.kw||""].join(" ");
  rows.push({ type:"training", key:t.name, text });
}

console.log(`Built ${rows.length} concept-text rows.`);
console.log("Loading Xenova/all-MiniLM-L6-v2 (first run downloads it to your local cache)...");

const { pipeline } = require("@xenova/transformers");
const DIM = 384;

(async () => {
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { quantized: true });

  const vecs = new Float32Array(rows.length * DIM);
  for (let i = 0; i < rows.length; i++) {
    const out = await extractor(rows[i].text, { pooling: "mean", normalize: true });
    if (out.data.length !== DIM) {
      throw new Error(`Unexpected embedding size ${out.data.length} for row ${i} (expected ${DIM})`);
    }
    vecs.set(out.data, i * DIM);
    if ((i + 1) % 25 === 0 || i === rows.length - 1) {
      process.stdout.write(`\r  embedded ${i + 1}/${rows.length}`);
    }
  }
  console.log("\nEncoding output file...");

  const b64 = Buffer.from(vecs.buffer).toString("base64");
  const index = rows.map(r => ({ type: r.type, key: r.key }));

  const out = `/* AUTO-GENERATED by generate-embeddings.js — do not hand-edit.
   Regenerate whenever data-*.js content changes materially (see the
   header comment in generate-embeddings.js for details). */
const EMBED_MODEL = "Xenova/all-MiniLM-L6-v2";
const EMBED_DIM = ${DIM};
const EMBED_INDEX = ${JSON.stringify(index)};
const EMBED_VECS_B64 = "${b64}";
`;
  fs.writeFileSync(path.join(__dirname, "data-embeddings.js"), out);
  console.log(`Wrote data-embeddings.js (${rows.length} vectors, ${(b64.length / 1024).toFixed(0)} KB base64).`);
  console.log("\nNext: run `node lint.js` against a rebuilt index.html to confirm the vectors line up with your data,");
  console.log("then see MODEL-README.txt for self-hosting the model + transformers.js library for the app itself.");
})().catch(e => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
