import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    source: { type: String, default: "transport_data.pdf" },
    chunkIndex: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);