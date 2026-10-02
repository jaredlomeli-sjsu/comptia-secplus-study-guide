"use strict";
/*
 * Tiny JSON document store.
 *   production: Vercel Blob (private store — nothing is reachable by URL)
 *   tests:      in-memory Map, only when SP_STORE=memory is set explicitly
 * readJson -> { data, etag } | null
 * writeJson(path, obj, { create }|{ ifMatch }) -> { etag }; throws err.code 'EXISTS' | 'CONFLICT'
 */
const mem = new Map();
let seq = 0;

function useMemory() {
  return process.env.SP_STORE === "memory";
}

async function readJson(path) {
  if (useMemory()) {
    const hit = mem.get(path);
    return hit ? { data: JSON.parse(hit.text), etag: hit.etag } : null;
  }
  const { get } = require("@vercel/blob");
  const r = await get(path, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200) return null;
  const text = await new Response(r.stream).text();
  return { data: JSON.parse(text), etag: r.blob.etag };
}

async function writeJson(path, obj, opts) {
  const o = opts || {};
  const text = JSON.stringify(obj);
  if (useMemory()) {
    const cur = mem.get(path);
    if (o.create && cur)
      throw Object.assign(new Error("exists"), { code: "EXISTS" });
    if (o.ifMatch && (!cur || cur.etag !== o.ifMatch)) {
      throw Object.assign(new Error("conflict"), { code: "CONFLICT" });
    }
    const etag = '"m' + ++seq + '"';
    mem.set(path, { text, etag, at: Date.now() });
    return { etag };
  }
  const { put } = require("@vercel/blob");
  try {
    const res = await put(path, text, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: !o.create,
      ifMatch: o.ifMatch,
      cacheControlMaxAge: 60,
    });
    return { etag: res.etag };
  } catch (e) {
    const msg = String((e && e.message) || e);
    if (o.create && /exist/i.test(msg))
      throw Object.assign(e, { code: "EXISTS" });
    if (o.ifMatch && /precondition|etag|match/i.test(msg))
      throw Object.assign(e, { code: "CONFLICT" });
    throw e;
  }
}

async function deleteJson(path) {
  if (useMemory()) {
    mem.delete(path);
    return;
  }
  const { del } = require("@vercel/blob");
  await del(path);
}

/*
 * Delete objects under `prefix` that were last written more than maxAgeMs ago.
 * Looks at one page (`limit`) per call, so it is cheap enough to run
 * occasionally from a request path. Returns how many were deleted.
 */
async function pruneOlderThan(prefix, maxAgeMs, limit) {
  const cap = limit || 100;
  const now = Date.now();
  if (useMemory()) {
    let n = 0;
    for (const [k, v] of mem) {
      if (n >= cap) break;
      if (k.startsWith(prefix) && now - v.at > maxAgeMs) {
        mem.delete(k);
        n++;
      }
    }
    return n;
  }
  const { list, del } = require("@vercel/blob");
  const page = await list({ prefix, limit: cap });
  const stale = page.blobs
    .filter((b) => now - new Date(b.uploadedAt).getTime() > maxAgeMs)
    .map((b) => b.pathname);
  if (stale.length) await del(stale);
  return stale.length;
}

module.exports = {
  readJson,
  writeJson,
  deleteJson,
  pruneOlderThan,
  _test: {
    keys: (prefix) => [...mem.keys()].filter((k) => k.startsWith(prefix)),
  },
};
