/* ============================================================================
   sem-worker.js — semantic search, off the main thread.

   WHY THIS EXISTS
   The first semantic query used to freeze the UI for ~1.4 seconds on desktop:
   `pipeline()` fetches a 10 MB WASM runtime plus a 23 MB ONNX model, compiles
   the WASM, and runs the first inference — all synchronously enough to block
   paint and input. On a mid-range phone in a patrol car, that is materially
   worse, and it lands exactly when the officer is typing.

   Keyword results already render instantly and the semantic pass only ever
   ADDS to them, so this work has no business on the main thread at all.
   Moving it here means the model can take as long as it likes: the UI stays
   responsive, and the results upgrade in place when the worker replies.

   The main thread keeps the cosine scoring (1,022 x 384 dot products, ~2 ms) —
   that is cheap, and shipping 2 MB of vectors into the worker would cost more
   than it saves.

   Contract:
     in   { id, query }
     out  { id, ok:true, vec:[...384 floats] }  |  { id, ok:false, err }

   The main thread falls back to running the pipeline itself if this worker
   fails to start (older Safari, blocked module workers, etc.), so semantic
   search degrades to "works, but janky" rather than "gone".
   ========================================================================== */

let extractor = null;
let loading = null;

async function getExtractor(model) {
  if (extractor) return extractor;
  if (!loading) {
    loading = (async () => {
      // Resolved against this worker's own URL, so it works no matter where
      // the app is mounted.
      const { pipeline, env } = await import(new URL("./vendor/transformers.min.js", self.location.href).href);
      env.allowRemoteModels = false;                                    // never phone home
      env.localModelPath = new URL("./models/", self.location.href).href;
      /* ONNX Runtime resolves its .wasm relative to the executing context. In a
         worker that is the worker's own URL, not the document's — so without
         this it fetches ort-wasm-simd.wasm from the wrong place and dies with
         "no available backend found". Pin it explicitly. */
      env.backends.onnx.wasm.wasmPaths = new URL("./vendor/", self.location.href).href;
      env.backends.onnx.wasm.numThreads = 1;                           // single-threaded build; no SAB needed
      extractor = await pipeline("feature-extraction", model, { quantized: true });
      return extractor;
    })();
  }
  return loading;
}

self.onmessage = async (e) => {
  const { id, query, model } = e.data || {};
  try {
    const ex = await getExtractor(model);
    const out = await ex(query, { pooling: "mean", normalize: true });
    // Copy out of the tensor's backing store before transferring.
    const vec = new Float32Array(out.data);
    self.postMessage({ id, ok: true, vec }, [vec.buffer]);
  } catch (err) {
    self.postMessage({ id, ok: false, err: String(err && err.message || err) });
  }
};
