import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function sendMessage(message) {
  const res = await axios.post(`${API_URL}/chat`, { message });
  return res.data.reply;
}