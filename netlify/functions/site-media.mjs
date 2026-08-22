import { getStore } from "@netlify/blobs";

// Stores which uploaded photo/video (see media.mjs) is assigned to each
// editable homepage slot — e.g. the "Find Your Style" tiles, the editorial
// banner, the lookbook images. This file just holds the small mapping;
// the actual media bytes live in the media store.
export default async (req) => {
  const store = getStore("black-bunny");

  if (req.method === "GET") {
    const data = await store.get("site-media", { type: "json" });
    return new Response(JSON.stringify(data || {}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
    let body;
    try { body = await req.json(); } catch { return new Response(JSON.stringify({ ok: false, error: "Bad request" }), { status: 400, headers: { "Content-Type": "application/json" } }); }
    await store.setJSON("site-media", body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
