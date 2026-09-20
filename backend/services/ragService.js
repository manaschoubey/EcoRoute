import mongoose from "mongoose";
import { embedText, getChatCompletion } from "./aiService.js";

const SYSTEM_PROMPT = `You are EcoRoute AI, a sustainable commute advisor for students and staff.

Your job:
1. Suggest 2-3 sustainable travel options based on the user's query.
2. For each option, provide: travel time, approximate cost in INR, CO2 saved compared to a petrol car, and one practical tip.
3. Prefer walking, cycling, campus shuttle, public bus/train, and carpool.
4. If unsure, say so clearly. Do not guess.
5. Do not ask for personal data.
6. Use ONLY information from the provided context. If the answer isn't in the context, say "I don't have information about that route."
7. Keep answers short, local, and practical.`;

// Cosine similarity between two vectors
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// In-memory vector search (works with any MongoDB)
async function vectorSearch(queryEmbedding, topK = 3) {
  const docs = await mongoose.connection.db
    .collection("documents")
    .find({})
    .toArray();

  const scored = docs.map((doc) => ({
    text: doc.text,
    score: cosineSimilarity(queryEmbedding, doc.embedding || []),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export async function askEcoRoute(question) {
  // 1. Embed the user's query
  const queryEmbedding = await embedText(question);

  // 2. In-memory similarity search
  const results = await vectorSearch(queryEmbedding, 3);

  // 3. Build context
  const context = results.map((r) => r.text).join("\n\n");

  console.log(`🔍 Top match score: ${results[0]?.score.toFixed(4)}`);

  // 4. Build prompt
  const prompt = `${SYSTEM_PROMPT}

Context from transport data:
${context}

User question: ${question}

Answer:`;

  // 5. Generate response
  return await getChatCompletion(prompt);
}