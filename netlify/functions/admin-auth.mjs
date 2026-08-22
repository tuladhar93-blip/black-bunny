// Checks the admin username/password against environment variables set in
// the Netlify dashboard (never in your code, never visible to customers).
// On success, returns the write-key the client needs to save products/hero —
// this key is separate from the password itself.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
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

  const { username, password } = body || {};
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  const adminKey = process.env.ADMIN_KEY;

  if (!envUser || !envPass || !adminKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "Admin login isn't configured yet — set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_KEY in Netlify site settings." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (username === envUser && password === envPass) {
    return new Response(JSON.stringify({ ok: true, key: adminKey }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // TEMPORARY DEBUG: shows exactly what was received vs. expected length,
  // so we can spot a typo/whitespace mismatch. Remove this block once login
  // works — it's not something to leave on a real live site.
  return new Response(
    JSON.stringify({
      ok: false,
      error: "Incorrect username or password",
      debug: {
        received_username: username,
        received_password_length: (password || "").length,
        expected_username: envUser,
        expected_password_length: envPass.length,
      },
    }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
};
