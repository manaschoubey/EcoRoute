import ollama from "ollama";

export async function embedText(text) {
  try {
    const response = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: text,
    });
    return response.embedding; // 768 dimensions
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw new Error("Failed to create embedding.");
  }
}

export async function getChatCompletion(prompt) {
  try {
    const response = await ollama.chat({
      model: "llama3.2",
      messages: [{ role: "user", content: prompt }],
      options: { temperature: 0.3 },
    });
    return response.message.content;
  } catch (error) {
    console.error("Error with chat completion:", error);
    throw new Error("Failed to get chat completion.");
  }
}