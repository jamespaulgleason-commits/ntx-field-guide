# NTX Field Guide — Project Handoff

**Read this before doing anything.** It is written for a future Claude picking this
project up cold. The hard-won lessons are at the bottom; they matter more than the
file listing.

---

## What this is

An offline-capable single-page PWA legal reference for **North Texas peace
officers**. Texas statutes, case law, doctrines, warrantless-arrest authority, and
DFW-area local ordinances — searchable in **cop-speak**, not statute-speak.

**Live:** https://north-texas-field-guide.pages.dev (Cloudflare Pages)
**Repo:** `C:\NTXFieldGuide` → https://github.com/jamespaulgleason-commits/ntx-field-guide (private)
**Owner:** James Gleason — former Texas peace officer, now an intelligence analyst.
He knows this material cold. **When he says something is wrong, he is right.**

---

## Current state (v41, `data de9e1e29`)

| | |
|---|---|
| Statutes | 787 (+16 restored from source in v41) |
| Ordinances | 140 — Frisco, Prosper, Little Elm |
| Cases | 84 — SCOTUS 73, 5th Cir 9, 4th Cir 1, 9th Cir 1 |
| Doctrines | 24 |
| Arrest articles | 17 (CCP Ch. 14 + H&S 573.001) |
| Embeddings | 1,056 vectors, 384-dim |
| Search | eval **30/30** · cop-speak **52/54 at rank #1** |
| Lint | 0 errors, 0 warnings |

---

## Architecture

**Build:** `app-shell.html` + seven `data-*.js` → `python build.py --no-pwa --out index.html`
→ `node lint.js index.html`. Deploy = flat zip (index.html, sw.js, sem-worker.js,
fonts/, vendor/, models/ **at the root**) dragged into a **new deployment on the
EXISTING** `north-texas-field-guide` Pages project. **Never create a new project** —
a PWA is origin-bound and a new URL orphans every installed copy. Bump
`CACHE_VERSION` in `sw.js` every release.

**Search engine** (unified, cross-type, in `app-shell.html`):

```
exact section       100000
name / phrase       8000–20000
all query terms     5000+
strong partial      up to 1000
SEMANTIC            250 + 500 × cosine   (SEM_THRESHOLD = 0.25)
```

Semantic runs in a **Web Worker** (`sem-worker.js`) — `Xenova/all-MiniLM-L6-v2`,
self-hosted in `models/`, WASM in `vendor/`. Cosine scoring stays on the main
thread (~2 ms).

**`kw` is the single most important field.** It carries cop vernacular. It feeds
three layers: the keyword haystack, the `rel` tiebreak (weight 4), and the
embeddings. Coverage: statutes 17% · arrest 100% · doctrines 100% · ordinances 14%.

---

## The guards (in `lint.js`) — do not remove these

| Guard | Blocks build? |
|---|---|
| Build stamp present, and stamp == `CACHE_VERSION` | yes |
| **Penalty ladders** — fails if a statute's text assigns a grade higher than its `level` says | yes |
| **Ordinance tiers** — fine-only must not be badged jailable | yes |
| **Truncated text** — warns if a Penal Code offence's verbatim text has no grade | warn |
| Embedding count == record count | warn |

**`eval-harness.py`** — 35 officer-phrased queries with expected hits. **Run it
before ANY scoring change.** Exits 1 on regression.

---

## THE LESSONS. Read these.

Every serious defect in this project was found by **testing against something
external**, never by reading code. Every one of them passed the checks that existed
at the time.

**1. The tests were not the real thing.**
- Semantic search fetched a 10 MB WASM runtime from **jsDelivr's CDN**. It worked
  perfectly on every WiFi-connected desk — and **silently failed offline**, which is
  the entire point of the app. It survived months. Found by pinning `wasmPaths` and
  watching it break in a sandbox with no network.
- I "improved" search ranking (IDF weighting). It passed **13/13** on queries **I
  invented** and was a **net regression** on James's real 35-query set — fixed 3,
  broke 4. `eval-harness.py` exists because of this.
- I optimised the filter panel to fit "6/6 tabs" on a 900px viewport. **James's
  actual browser is 639px tall.** I'd measured a screen he doesn't have.

**2. Automated checks only see what they can see.**
- **16 Penal Code statutes held truncated text** (§ 43.02 had **10%** of the real
  statute). Every guard passed — because they were checking *against the truncated
  text itself*. Only an external source file exposed it. And inside that blind spot
  sat two real penalty errors (§ 548.603 said "Class B misdemeanor" for an offence
  that reaches a **2nd-degree felony**).
- **Prose accuracy has NO guard.** The § 543.004 entry omitted texting-while-driving
  from a three-item list and invented a condition ("adjacent state") that appears
  nowhere in the statute. Every check passed. **James caught it by knowing the law.**

**3. My own regexes are a recurring failure mode.**
- The code writes grades **both ways**: "felony of the third degree" AND "a third
  degree felony". My regex knew only the first — which hid § 548.603 and falsely
  flagged § 33.022 as truncated.
- `termHits` prefix-matches with a boundary only at the **start**. `"man"` matched
  MANufacture, MANner, MANslaughter across a third of the corpus. Fixed via
  STOPWORDS, not a length rule (a length rule broke `"fire"` → `"firearm"` and
  regressed the eval).
- Justia deep-links: page-based for old volumes (`/us/484/19/`), **docket-based for
  recent ones** (`/us/585/16-402/`). The old cutoff of 600 generated **15 broken
  links**. Now capped at volume 575; above that → Google Scholar.

---

## Working rules with James

- **Accuracy over speed.** Always.
- **Verbatim statutory text is the authority.** Never invent it. If text is missing,
  say so and ask for the source. He will supply official exports (he gave me
  `penalcode.md` — 1.1 MB, the full Penal Code).
- **Never author a case citation from memory.** Web-search and verify every cite and
  holding. Wrong cites get quoted in suppression hearings.
- **Scope approval before building.** Show him the plan with numbers; let him choose.
- **Deliver complete files, never patches.**
- **Deploy instructions must be granular** — exact commands, exact paths, one action
  per step, numbered. Not a summary paragraph.
- Cop-speak > statute-speak. The statute says *"enters a building without effective
  consent"*; the officer says *"broke in."* `kw` bridges that. **No model does.**

---

## Known limits / open items

- **The embedding model is the ceiling.** `all-MiniLM-L6-v2` scores *"kicked in the
  door of a house and took a tv"* at **0.21** against Burglary. Cop-speak works
  because `kw` gives the *keyword* engine the words — not because the model
  understands. A better model (`bge-small`, 33 MB) **exceeds Cloudflare Pages' 25 MiB
  per-file limit**; it would need **R2 + CORS**, which is structurally the same shape
  as the jsDelivr bug. **Recommended: keep doing `kw` passes** (651 statutes still
  have none) before touching the model.
- **§ 46.035** genuinely contains only subsection (a) — HB 1927 (2021) and HB 4595
  (2023) repealed the rest. Verified against Justia 2025. Not a bug; honestly flagged.
- **Transportation and H&S codes have NOT been compared against an authoritative
  source.** The Penal Code comparison found 16 truncated entries. **Ask James for
  those exports and run the same diff.** § 548.603 — the worst penalty error found —
  was a Transportation entry.
- Case law: ~29 foundational SCOTUS cases still missing (Steagald, Summers/Bailey,
  Bertine, Ross/Acevedo, Florida v. Harris, Navarette, Glover, Collins, Jones,
  Devenpeck, Virginia v. Moore, Richards, Herring, Mincey, Robinette, Drayton,
  Maryland v. King). **Verify each citation before authoring.**
- James scoped case law to **SCOTUS + circuit courts only**. He explicitly declined
  Texas state courts. Respect that — but the Texas *warnings* in entries like Hiibel,
  Sitz, and Leon/Hudson/Mapp exist because the federal rule and Texas law diverge, and
  those stay.

---

## Release routine

```bat
cd C:\NTXFieldGuide
:: 1. copy the changed files in, overwriting
git status --short              :: expect only M lines
git add -A
git commit -m "vNN: ..."
python build.py --no-pwa --out index.html
node lint.js index.html         :: want 0/0 AND the expected data hash
git tag vNN
git push && git push --tags
:: deploy the zip -> NEW deployment on the EXISTING Pages project
:: verify: live Settings gear shows the same data hash
```

Only if he edits data himself: `node generate-embeddings.js`.

**Gotchas:** no `<` or `>` in cmd paths (redirection). `.gitignore` /
`.gitattributes` must have **no `.txt`** — Notepad adds one silently, and that is how
2,125 `node_modules` files got committed the first time.

---

## Version → data hash

v33 `832835dd` · v34 `6ef75519` · v35 `60e96830` · v36 `f994f6a1` · v37 `55fd9740`
· v38 `14b15e7f` · v39 `35cef2d5` · v40 `e6fcdb39` · **v41 `de9e1e29` (current)**

The hash is a fingerprint of the shell + all data files. **If James's local build
prints a different hash than the one I shipped, a file didn't copy.** This has caught
stale-file drift at least three times, including a near-miss where he was about to
commit a shell that predated the entire search engine.
