import dns from "node:dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);

import fs from "fs";
import { PDFParse } from "pdf-parse";
import mongoose from "mongoose";
import { embedText } from "../services/aiService.js";
import Document from "../models/Document.js";
import dotenv from "dotenv";
dotenv.config();

async function ingest() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB for ingestion");

  const buffer = fs.readFileSync("./data/transport_data.pdf");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  const text = result.text;
  console.log(`📄 PDF loaded: ${text.length} characters`);

  const chunkSize = 500;
  const overlap = 50;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  console.log(`🔪 Created ${chunks.length} chunks`);

  // Clear old data
  await Document.deleteMany({ source: "transport_data.pdf" });

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i]);
    await Document.create({
      text: chunks[i],
      embedding,
      chunkIndex: i,
    });
    console.log(`💾 Stored chunk ${i + 1}/${chunks.length}`);
  }

  console.log("✅ Ingestion complete!");
  await mongoose.disconnect();
}

ingest().catch(console.error);