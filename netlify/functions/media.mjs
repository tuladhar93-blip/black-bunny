import { getStore } from "@netlify/blobs";

// Generic media store: any photo or video uploaded anywhere in Admin (product
// galleries, homepage section art, etc.) is saved here as its own file and
// referenced elsewhere only by a short id — keeps the main product/site data
// small and fast, and lets each image/video be swapped independently.
function randomId() {
  const rand = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}-${rand}`;
}

export default async (req) => {
  const store = getStore("black-bunny-media");
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (req.method === "GET") {
    if (!id) return new Response("Missing id", { status: 400 });
    const buf = await store.get(id, { type: "arrayBuffer" });
    if (!buf) return new Response("Not found", { status: 404 });
    const meta = (await store.get(`${id}:meta`, { type: "json" })) || {};
    const mimeType = meta.mimeType || "application/octet-stream";
    const size = buf.byteLength;

    const range = req.headers.get("range");
    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : size - 1;
        const chunk = buf.slice(start, end + 1);
        return new Response(chunk, {
          status: 206,
          headers: {
            "Content-Type": mimeType,
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunk.byteLength),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (req.method === "POST") {
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const mimeType = req.headers.get("x-content-type") || "application/octet-stream";
    const newId = randomId();
    const buf = await req.arrayBuffer();
    await store.set(newId, buf);
    await store.setJSON(`${newId}:meta`, { mimeType, size: buf.byteLength, uploadedAt: Date.now() });
    return new Response(JSON.stringify({ ok: true, id: newId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "DELETE") {
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!id) return new Response("Missing id", { status: 400 });
    await store.delete(id);
    await store.delete(`${id}:meta`);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
