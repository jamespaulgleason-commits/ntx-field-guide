SEMANTIC SEARCH — self-hosting the model + library for the app itself
========================================================================

This is a SEPARATE step from running generate-embeddings.js. That script
only produces data-embeddings.js (the precomputed vectors). This step gets
the actual model + search library running inside the app itself, in the
officer's browser, with zero external network calls — same reasoning as the
self-hosted fonts.

You need two things in place, both self-hosted next to index.html:

  vendor/transformers.min.js          (the library)
  models/Xenova/bge-small-en-v1.5/... (the model files)

STEP 1 — Run generate-embeddings.js first (if you haven't already)
--------------------------------------------------------------------
  npm install @xenova/transformers
  node generate-embeddings.js

This downloads the model to a local cache on your machine to actually run
the embedding generation. That download is reusable for Step 3 below — you
do not need to fetch the model files twice.

STEP 2 — Get the library file
--------------------------------
It's already sitting in node_modules from Step 1. Look for a browser-ready
bundle here (exact filename can vary slightly by version):

  node_modules/@xenova/transformers/dist/transformers.min.js

Copy that one file to:

  vendor/transformers.min.js

STEP 3 — Get the model files
--------------------------------
When generate-embeddings.js ran, @xenova/transformers cached the actual
model files (config, tokenizer, ONNX weights) somewhere locally — the exact
path can vary by library version, but it's usually one of:

  .cache/Xenova/bge-small-en-v1.5/
  node_modules/@xenova/transformers/.cache/Xenova/bge-small-en-v1.5/

Find it with:

  find . -type d -iname "*bge-small*" 2>/dev/null

Once you find that folder, copy its ENTIRE contents into:

  models/Xenova/bge-small-en-v1.5/

Verify it looks something like this (again, exact filenames can vary by
version — the point is: a config file, tokenizer files, and an onnx/
subfolder with the model weights):

  models/Xenova/bge-small-en-v1.5/
    config.json
    tokenizer.json
    tokenizer_config.json
    onnx/
      model_quantized.onnx

STEP 4 — Fold into your deploy folder
----------------------------------------
Both vendor/ and models/ need to sit next to index.html, same level as
fonts/ and icons/:

  index.html
  manifest.json
  sw.js
  fonts/
  icons/
  vendor/
    transformers.min.js
  models/
    Xenova/
      bge-small-en-v1.5/
        ...

STEP 5 — sw.js precache (one more edit, bump the version too)
------------------------------------------------------------------
The model files total roughly 25-35MB — meaningfully bigger than the fonts.
Add vendor/transformers.min.js and every file under models/ to sw.js's
CORE_ASSETS list so they're cached for true offline use, and bump
CACHE_VERSION again. Paste sw.js back to me once you've done Steps 1-4 and
I'll do this edit for you, same as last time.

WHAT HAPPENS IF YOU SKIP ALL OF THIS
----------------------------------------
Nothing breaks. SEM_ENABLED in app-shell.html is only true once
data-embeddings.js has real vectors (Step 1), and even then, if vendor/ or
models/ aren't in place, the app tries to load them, silently fails, and
falls straight back to the keyword search that's been working the whole
time. This is deliberate — search must never break because of this feature.

BEFORE CALLING THIS "DONE"
------------------------------
Once real embeddings + self-hosted model files exist, test with the eval
query list (see EVAL-QUERIES.txt) against the live "Search Everything" box.
The SEM_THRESHOLD constant in app-shell.html (currently 0.42) has NOT been
tuned against real output — expect to raise it if you see irrelevant
"By meaning" results, or lower it if obviously-relevant entries aren't
surfacing. This calibration step is required, not optional, before relying
on this for real callouts.
