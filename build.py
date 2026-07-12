#!/usr/bin/env python3
"""
build.py - reassemble the single self-contained offline HTML for the field guide
           from the app shell + the split-out data files.

USAGE:
    python3 build.py                       # writes ./index.html
    python3 build.py --out dist/guide.html # custom output path
    python3 build.py --check               # build in memory and report, don't write

LAYOUT (all in the same directory as this script, unless overridden):
    app-shell.html      the HTML/CSS/JS with a /*__DATA_BLOCK:<name>__*/ marker
                        where each data block belongs. NOT deployable on its own.
    data-cases.js       CIRCUITS + CALL_TYPES + CASES
    data-statutes.js    CODE_CATS + STATUTES
    data-arrest.js      ARREST_CATS + ARREST
    data-doctrines.js   DOCTRINE_CATS + DOCTRINES
    data-ordinances.js  LIVE_JURISDICTIONS + ORDINANCE_CATS + ORDINANCES
    data-training.js    TRAINING
    data-embeddings.js  EMBED_MODEL + EMBED_DIM + EMBED_INDEX + EMBED_VECS_B64
                        (placeholder/empty until generate-embeddings.js is run)

The build is a pure text substitution: each marker is replaced by the exact
contents of its data file. Given unmodified inputs it reproduces the original
single-file HTML byte-for-byte. Edit the data in the data-*.js files (or the
shell for markup/logic), then rebuild.
"""
import sys, os, argparse, shutil, hashlib, subprocess, datetime

BLOCKS = ["cases", "statutes", "arrest", "doctrines", "ordinances", "training", "embeddings"]
BUILD_MARKER = "__BUILD_ID__"


def _git(here, *args):
    """Best-effort git query. Returns None when git is absent or this isn't a repo."""
    try:
        out = subprocess.run(["git", "-C", here, *args], capture_output=True, text=True, timeout=5)
        return out.stdout.strip() if out.returncode == 0 else None
    except Exception:
        return None


def cache_version(here):
    """Single source of truth for the version string: sw.js's CACHE_VERSION.
    Reading it here means the build stamp and the service-worker cache key can
    never silently disagree — which is exactly how a stale build gets served."""
    sw = os.path.join(here, "sw.js")
    if not os.path.exists(sw):
        return "nosw"
    import re
    m = re.search(r'CACHE_VERSION\s*=\s*"([^"]+)"', open(sw, encoding="utf-8").read())
    return m.group(1) if m else "nosw"


def build_id(here, shell_path, datadir):
    """<cache-version> · <UTC date> · git <sha>[-dirty] · data <hash>

    The data hash fingerprints the SHELL PLUS EVERY DATA FILE that went into
    this build. Two deployments with the same hash were built from identical
    inputs; different hashes mean different inputs, full stop. That is the
    question you actually want answered when staring at a live URL."""
    h = hashlib.sha256()
    for path in [shell_path] + [os.path.join(datadir, f"data-{b}.js") for b in BLOCKS]:
        with open(path, "rb") as f:
            h.update(f.read())
    sha = _git(here, "rev-parse", "--short", "HEAD")
    if sha:
        dirty = _git(here, "status", "--porcelain")
        git_part = f"git {sha}{'-dirty' if dirty else ''}"
    else:
        git_part = "git none"
    stamp_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    return f"{cache_version(here)} \u00b7 {stamp_date} \u00b7 {git_part} \u00b7 data {h.hexdigest()[:8]}"
PWA_FILES = ["manifest.json", "sw.js"]  # copied verbatim alongside the built HTML
ICONS_DIR = "icons"

def build(shell_path, datadir, here=None):
    with open(shell_path, encoding="utf-8") as f:
        html = f.read()
    for b in BLOCKS:
        marker = f"/*__DATA_BLOCK:{b}__*/"
        n = html.count(marker)
        if n != 1:
            sys.exit(f"ERROR: marker {marker} appears {n} time(s) in the shell (expected exactly 1).")
        data_path = os.path.join(datadir, f"data-{b}.js")
        if not os.path.exists(data_path):
            sys.exit(f"ERROR: missing data file {data_path}")
        with open(data_path, encoding="utf-8") as f:
            html = html.replace(marker, f.read())
    if "__DATA_BLOCK:" in html:
        sys.exit("ERROR: unsubstituted data markers remain after build.")

    # Stamp the build. Missing marker is fatal: an unstamped index.html is one
    # you cannot later identify, which is the entire problem this exists to fix.
    n = html.count(BUILD_MARKER)
    if n != 1:
        sys.exit(f"ERROR: {BUILD_MARKER} appears {n} time(s) in the shell (expected exactly 1).")
    stamp = build_id(here or os.path.dirname(os.path.abspath(shell_path)), shell_path, datadir)
    html = html.replace(BUILD_MARKER, stamp)
    print(f"Build ID: {stamp}")
    return html

def copy_pwa_assets(here, out_dir, skip_pwa):
    """Copy manifest.json, sw.js, and the icons/ directory next to the built
    HTML so the deployable output is 'one command, one folder' even though
    PWA installability requires these as separate files (a manifest can't be
    embedded inside the HTML itself)."""
    if skip_pwa:
        return []
    copied = []
    for fname in PWA_FILES:
        src = os.path.join(here, fname)
        if not os.path.exists(src):
            print(f"WARNING: {fname} not found next to build.py — skipping (PWA install will not work without it).")
            continue
        dst = os.path.join(out_dir, fname)
        if os.path.abspath(src) == os.path.abspath(dst):
            copied.append(dst)  # already in place (building in-source)
            continue
        shutil.copyfile(src, dst)
        copied.append(dst)
    icons_src = os.path.join(here, ICONS_DIR)
    if os.path.isdir(icons_src):
        icons_dst = os.path.join(out_dir, ICONS_DIR)
        if os.path.abspath(icons_src) != os.path.abspath(icons_dst):
            shutil.copytree(icons_src, icons_dst, dirs_exist_ok=True)
        copied.append(icons_dst)
    else:
        print(f"WARNING: {ICONS_DIR}/ not found next to build.py — skipping (app icon will not load).")
    return copied

def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser()
    ap.add_argument("--shell", default=os.path.join(here, "app-shell.html"))
    ap.add_argument("--datadir", default=here)
    ap.add_argument("--out", default=os.path.join(here, "index.html"))
    ap.add_argument("--check", action="store_true", help="build in memory and report size; do not write")
    ap.add_argument("--no-pwa", action="store_true", help="skip copying manifest.json/sw.js/icons/ (HTML-only build)")
    args = ap.parse_args()

    if not os.path.exists(args.shell):
        sys.exit(f"ERROR: shell not found: {args.shell}")
    html = build(args.shell, args.datadir, here)

    if args.check:
        print(f"OK: build produces {len(html)} chars ({len(html.encode('utf-8'))} bytes). Not written (--check).")
        return
    out_dir = os.path.dirname(os.path.abspath(args.out)) or "."
    os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Built {args.out} ({len(html)} chars).")

    copied = copy_pwa_assets(here, out_dir, args.no_pwa)
    for path in copied:
        print(f"Copied {path}")

if __name__ == "__main__":
    main()
