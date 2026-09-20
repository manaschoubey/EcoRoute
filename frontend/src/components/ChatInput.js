import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., Hostel to Railway Station, 8 AM, greenest"
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition"
      >
        Send
      </button>
    </form>
  );
}