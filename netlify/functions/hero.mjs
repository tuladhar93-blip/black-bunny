import { getStore } from "@netlify/blobs";

// Shared homepage cover (photo/video), stored in Netlify Blobs.
export default async (req) => {
  const store = getStore("black-bunny");

  if (req.method === "GET") {
    const data = await store.get("hero", { type: "json" });
    return new Response(JSON.stringify(data || null), {
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
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await store.setJSON("hero", body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
