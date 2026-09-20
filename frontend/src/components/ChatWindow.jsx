import { useState } from "react";
import { sendMessage } from "../services/api";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(text) {
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-white">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-green-700">🌱 EcoRoute AI</h1>
        <p className="text-gray-500 text-sm">
          Sustainable Commute Advisor | SDG 11 & 13
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">Ask me about sustainable travel routes</p>
            <p className="text-sm mt-2">
              Try: "Hostel to Railway Station, 8 AM, greenest"
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-gray-400 text-sm">Finding green routes...</div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}