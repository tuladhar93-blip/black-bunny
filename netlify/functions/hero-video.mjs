import { getStore } from "@netlify/blobs";

// Serves the hero video as an actual binary file (not inline base64), with
// HTTP range-request support — this is what iOS Safari needs to reliably
// play video. Embedding video as a giant inline data URL (the old approach)
// is unreliable on iPhone regardless of format; a real served file fixes it.
export default async (req) => {
  const store = getStore("black-bunny");

  if (req.method === "GET") {
    const buf = await store.get("hero-video-bin", { type: "arrayBuffer" });
    if (!buf) return new Response("Not found", { status: 404 });

    const meta = (await store.get("hero-video-meta", { type: "json" })) || {};
    const mimeType = meta.mimeType || "video/mp4";
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
    const mimeType = req.headers.get("x-content-type") || "video/mp4";
    const buf = await req.arrayBuffer();
    await store.set("hero-video-bin", buf);
    await store.setJSON("hero-video-meta", { mimeType, size: buf.byteLength, updatedAt: Date.now() });
    return new Response(JSON.stringify({ ok: true }), {
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
    await store.delete("hero-video-bin");
    await store.delete("hero-video-meta");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
