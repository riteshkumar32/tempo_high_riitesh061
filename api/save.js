let STORED_TEXT = "";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, text } = req.body || {};

    if (username !== "riitesh061" || password !== "saahil061") {
      return res.status(401).json({ error: "Invalid login" });
    }

    STORED_TEXT = text || "";
    return res.json({ success: true });
  }

  if (req.method === "GET") {
    return res.json({ text: STORED_TEXT });
  }

  return res.status(405).end();
}
