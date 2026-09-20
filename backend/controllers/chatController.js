import { askEcoRoute } from "../services/ragService.js";

export async function handleChat(req, res) {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`📨 User: ${message}`);
    const reply = await askEcoRoute(message);
    console.log(`🤖 AI: ${reply.slice(0, 80)}...`);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
