// NOTE: this is in-memory storage for demo only.
// Vercel is stateless across cold starts — use DB/KV for production.
let storedText = "";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, text } = req.body ?? {};

    // Demo credentials - must match login.js
    const DEMO_USER = "riitesh061";
    const DEMO_PASS = "saahil061";

    if (username !== DEMO_USER || password !== DEMO_PASS) {
      return res.status(401).json({ error: "Invalid session" });
    }

    storedText = text || "";
    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    return res.status(200).json({ text: storedText });
  }

  return res.status(405).end();
}
