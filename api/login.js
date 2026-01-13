export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body ?? {};

  // Demo credentials - change if you want
  const DEMO_USER = "riitesh061";
  const DEMO_PASS = "saahil061";

  if (username === DEMO_USER && password === DEMO_PASS) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Invalid login" });
}
