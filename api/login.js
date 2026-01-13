export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body || {};

  if (username === "riitesh061" && password === "saahil061") {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Invalid login" });
}
