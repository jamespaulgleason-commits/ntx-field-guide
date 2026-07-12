"""
Runs EVAL-QUERIES.txt (35 officer-phrased queries) against two builds and
compares. Expectations are encoded as substring matchers against the result
key (sec / ord / case name), because the eval file names targets in prose.

Queries 13, 22, 31, 33, 35 are flagged EXPLORATORY in the eval file itself
("does an entry like this even exist yet") — a "no great match" there is
legitimate information, not a failure. They are reported but not scored.
"""
from playwright.sync_api import sync_playwright
import sys, json

# (n, query, [acceptable target substrings], scored?)
Q = [
 (1,  "guy won't tell me his name on a stop", ["38.02"], True),
 (2,  "found a baggie of white powder in his pocket, looked like cocaine", ["481.115"], True),
 (3,  "car search after towing it because it was stolen", ["Carroll", "Automobile", "Inventory", "Colorado v. Bertine", "South Dakota v. Opperman"], True),
 (4,  "guy ran when he saw me, high crime neighborhood, nothing else", ["Wardlow"], True),
 (5,  "dog sniffed the car during a traffic stop, took longer than expected", ["Rodriguez"], True),
 (6,  "shot at a fleeing suspect, unarmed, jumping a fence", ["Garner"], True),
 (7,  "how much force is reasonable when someone resists", ["Graham"], True),
 (8,  "wife called and said husband hit her, no marks visible", ["22.01", "14.03", "Family Violence"], True),
 (9,  "vape pen with weird crystals, might be fake weed", ["481.1161", "481.116", "2-A", "Penalty Group 2"], True),
 (10, "pulled over for a busted tail light, turned out the law didn't require it", ["Heien"], True),
 (11, "consented to search but his girlfriend who also lives there said no", ["Randolph"], True),
 (12, "warrant came back active during a routine stop, found drugs after", ["Strieff"], True),
 (13, "someone posting nude pics of an ex without consent", ["21.16", "21.165", "43.26"], False),
 (14, "guy camping under the overpass with a tent", ["48.05"], True),
 (15, "found a fake temporary paper tag on a car that didn't match", ["502.475", "504.945", "504.946"], True),
 (16, "kid was texting and swerving near the elementary school", ["545.425", "545.4251"], True),
 (17, "beer can rolling around under the passenger seat, opened", ["49.031"], True),
 (18, "guy pointed a gun at someone during an argument, didn't fire", ["22.05"], True),
 (19, "search of a phone after arrest without a warrant", ["Riley"], True),
 (20, "cell tower records to place a suspect somewhere without a warrant", ["Carpenter"], True),
 (21, "person having a mental health crisis, threatening to hurt themselves", ["573.001"], True),
 (22, "entered a house without a warrant because we heard a kid screaming inside", ["Brigham", "Emergency Aid", "Exigent", "Case v. Montana"], False),
 (23, "chased a guy into his garage for a misdemeanor", ["Lange"], True),
 (24, "knocked on a door, smelled weed, worried they'd flush it", ["Kentucky v. King", "King"], True),
 (25, "searched the car after arresting the driver, he was already cuffed in the back seat", ["Gant"], True),
 (26, "does silence count as invoking your rights during an interrogation", ["Miranda", "Berghuis"], True),
 (27, "someone selling counterfeit prescription pills that aren't controlled substances", ["483.042", "483.045", "483.041"], True),
 (28, "third DUI-adjacent stop, driver still driving on a suspended license", ["521.457"], True),
 (29, "guy huffing computer duster to get high", ["485.031"], True),
 (30, "motorcycle rider with no helmet, said he's over 21", ["661.003"], True),
 (31, "someone swatted a house, called in a fake hostage situation", ["42.0601", "42.06"], False),
 (32, "officer wants free online training that doesn't need his department's login", ["Classen", "OSS", "Virtual Academy", "TRN"], True),
 (33, "civilian filmed us during an arrest, can they do that", [], False),
 (34, "does the smell of marijuana alone justify a full vehicle search now", ["Carroll", "Automobile", "481.121"], True),
 (35, "found a stolen firearm in a car during a traffic stop, driver on probation", ["46.04", "31.07", "Carroll", "Automobile", "46.02"], False),
]

JS = """async (q) => {
  const scored = runUnifiedSearch(q);
  const sem = await semanticRank(q);
  const merged = mergeSemanticUnified(scored, sem);
  return merged.slice(0,5).map(r => ({
    key: r.src.keyOf(r.item),
    name: r.src.name(r.item),
    score: Math.round(r.score),
    kind: r.kind
  }));
}"""

def run(url, label):
    res = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width":1280,"height":900})
        pg.goto(url, wait_until="load"); pg.wait_for_timeout(1800)
        pg.evaluate("async()=>{ try{ await semanticRank('warmup'); }catch(e){} }")
        pg.wait_for_timeout(500)
        for n, q, targets, scored in Q:
            try:
                r = pg.evaluate(JS, q)
            except Exception as e:
                r = []
            res[n] = r
            print(f"    {label} q{n:02d} done", file=sys.stderr)
        b.close()
    return res

def rank_of(rows, targets):
    """1-based rank of the first row matching any target; 0 if not in top 5."""
    if not targets: return -1
    for i, row in enumerate(rows):
        blob = (row["key"] + " " + row["name"])
        if any(t.lower() in blob.lower() for t in targets):
            return i + 1
    return 0

def band(r):
    return "TOP" if r == 1 else ("top3" if r in (2,3) else ("top5" if r in (4,5) else ("MISS" if r == 0 else "n/a")))

if __name__ == "__main__":
    """
    USAGE
      1. python build.py --no-pwa --out index.html
      2. serve the folder:   python -m http.server 8123
      3. python eval-harness.py
      (needs: pip install playwright && playwright install chromium)

    WHY THIS EXISTS
      v25 was hand-tuned against 13 queries I made up. It passed 13/13 -- and
      was a NET REGRESSION against the real 35-query set (fixed 3, broke 4).
      A scoring change that is not measured against this file is a guess.
    """
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8123/index.html"
    res = run(url, "build")
    passed = total = 0
    print()
    for n, q, targets, scored in Q:
        r = rank_of(res.get(n, []), targets)
        tag = " (exploratory)" if not scored else ""
        if scored:
            total += 1
            if r in (1, 2, 3): passed += 1
        mark = "  " if (not scored or r in (1,2,3)) else "!!"
        print(f"  {mark} {n:2d}  {band(r):<5} {q[:52]}{tag}")
    print(f"\n  {passed}/{total} scored queries pass (target in top 3)")
    print("  baseline: v22 = 23/30 | v26 = 30/30")
    sys.exit(0 if passed >= 30 else 1)
