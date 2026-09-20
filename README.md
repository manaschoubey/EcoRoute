
# 🌱 EcoRoute AI — Sustainable Commute Advisor

AI-powered chatbot that suggests sustainable travel options using RAG with
local Ollama models. Runs entirely on your machine — no API keys, no cloud AI costs.

## SDG Alignment
- **Primary:** SDG 11 — Sustainable Cities and Communities
- **Secondary:** SDG 13 — Climate Action

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Compass (local)
- **AI:** Ollama (`llama3.2` for chat, `nomic-embed-text` for embeddings)
- **RAG:** In-memory cosine similarity search

## How It Works
1. Transport data stored in `backend/data/transport_data.txt`
2. Data is chunked, embedded, and stored in MongoDB
3. User asks a question → embedded → cosine similarity search finds top 3 chunks
4. `llama3.2` generates a grounded answer using only the retrieved contex

 📖 Table of Contents

1. [Overview](#-overview)
2. [SDG Alignment](#-sdg-alignment)
3. [Why AI Is Needed](#-why-ai-is-needed)
4. [Features](#-features)
5. [Architecture](#-architecture)
6. [RAG Workflow](#-rag-workflow)
7. [Tech Stack](#-tech-stack)
8. [Project Structure](#-project-structure)
9. [Getting Started](#-getting-started)
10. [Environment Variables](#-environment-variables)
11. [API Reference](#-api-reference)
12. [Screenshots](#-screenshots)
13. [Responsible AI](#-responsible-ai)
14. [Expected Impact](#-expected-impact)
15. [Roadmap](#-roadmap)
16. [Author](#-author)
17. [License](#-license)

---

## 🎯 Overview

**EcoRoute AI** is a full-stack web application that suggests sustainable travel options between two points. A user simply asks a natural-language question, such as:

> *"Hostel Block A to Railway Station, 8 AM, greenest"*

The assistant responds with **2–3 sustainable travel options**, including:

- 🕐 Estimated travel time
- 💰 Approximate cost (INR)
- 🌍 CO₂ saved compared to a petrol car
- 💡 A practical tip for the trip

Every answer is **grounded in a local transport knowledge base**, so the AI never invents routes, timings, or fares. The entire pipeline — embeddings, vector search, and language generation — runs **locally via Ollama**, ensuring privacy, offline capability, and zero running cost.

---

## 🌍 SDG Alignment

| Goal | Description | How EcoRoute AI Contributes |
|---|---|---|
| **SDG 11** (Primary) | Sustainable Cities and Communities | Promotes low-carbon commuting, reduces traffic congestion, and improves access to public transport |
| **SDG 13** (Secondary) | Climate Action | Reduces CO₂ emissions from daily travel by guiding users toward greener modes |

---

## 🧠 Why AI Is Needed

- **Complex decisions:** People cannot easily remember hundreds of route, timing, and fare combinations.
- **Personalization:** AI tailors recommendations based on time, cost, and green priority.
- **Grounded accuracy:** RAG ensures answers stay accurate, local, and verifiable.
- **Privacy:** Local models guarantee no personal data leaves the user's device.
- **Scalability:** One deployment serves unlimited users without API quotas.

---

## ✨ Features

- 🔍 **RAG-based Q&A** — answers grounded strictly in the provided transport data
- 🤖 **Local AI** — `llama3.2` for generation, `nomic-embed-text` for embeddings
- 🧮 **In-memory cosine similarity search** — fast, no external vector database needed
- 🌐 **Modern React UI** — Tailwind-styled chat interface
- 🔐 **100% private** — no cloud AI, no API keys, no telemetry
- 📊 **CO₂ transparency** — every recommendation shows emission savings
- 🛡️ **Refuses to hallucinate** — says "I don't have information" when unsure
- 🧩 **Modular design** — easy to swap the model, database, or frontend

---

## 🏗 Architecture
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT (Browser) │
│ ┌───────────────────────────────────────────────────────────────┐ │
│ │ React + Vite + Tailwind CSS │ │
│ │ ─ ChatWindow.jsx ─ ChatInput.jsx ─ MessageBubble.jsx │ │
│ └───────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
│ HTTP POST /api/chat
▼
┌─────────────────────────────────────────────────────────────────────┐
│ SERVER (Node.js + Express) │
│ │
│ ┌─────────────┐ ┌──────────────┐ ┌───────────────────────┐ │
│ │ Routes │──▶│ Controller │──▶│ ragService.js │ │
│ │ /api/chat │ │ handleChat │ │ (RAG orchestration) │ │
│ └─────────────┘ └──────────────┘ └──────────┬────────────┘ │
│ │ │
│ ┌──────────────────────────┼──────────────┐ │
│ ▼ ▼ ▼ │
│ ┌──────────────────┐ ┌────────────────┐ ┌────────┐
│ │ aiService.js │ │ cosineSearch │ │ Prompt │
│ │ Ollama client │ │ (in-memory) │ │ Builder│
│ └────────┬─────────┘ └───────┬────────┘ └────────┘
└───────────────────────┼────────────────────────┼─────────────────────┘
│ │
▼ ▼
┌───────────────────────────┐ ┌───────────────────────┐
│ OLLAMA (Local Runtime) │ │ MongoDB (Local) │
│ ─ llama3.2 (chat) │ │ ─ documents │
│ ─ nomic-embed-text (768) │ │ · text │
│ Runs at localhost:11434 │ │ · embedding[768] │
└───────────────────────────┘ └───────────────────────┘

text

### Layers

| Layer | Responsibility |
|---|---|
| **Presentation** | React UI, chat interaction, real-time message rendering |
| **Application** | Express routing, request validation, response formatting |
| **Service** | RAG orchestration, prompt assembly, similarity ranking |
| **AI** | Ollama-driven embeddings and chat completion |
| **Persistence** | MongoDB storage of chunk text + vectors |

---

## 🔄 RAG Workflow

### 1️⃣ Data Ingestion (one-time)
transport_data.txt
│
▼
Chunking (500 chars, 50 overlap)
│
▼
Embed each chunk via nomic-embed-text (768-dim)
│
▼
Store { text, embedding, chunkIndex } in MongoDB

text

Run with: `node scripts/ingest.js`

### 2️⃣ Query-Time Retrieval
User question: "Hostel to Railway Station, greenest"
│
▼
Embed question → 768-dim query vector
│
▼
Load all stored embeddings from MongoDB
│
▼
Compute cosine similarity for each chunk
│
▼
Rank and select top-K (K = 3) most relevant chunks
│
▼
Inject top chunks as context into the LLM prompt
│
▼
llama3.2 generates a grounded answer
│
▼



### 3️⃣ Why In-Memory Search?

The default MongoDB Compass installation does **not** support `$vectorSearch` (an Atlas-only feature). To keep the project fully local and free, we load embeddings into Node.js memory and compute cosine similarity in pure JavaScript. For datasets up to a few thousand chunks, this is **instant and reliable**.

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI |
| **Vite** | Fast dev server + bundler |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client for API calls |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express** | REST API framework |
| **Mongoose** | MongoDB ODM |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |
| **nodemon** | Auto-reload during development |

### AI & Data

| Technology | Purpose |
|---|---|
| **Ollama** | Local LLM runtime |
| **llama3.2** | Chat completion model |
| **nomic-embed-text** | 768-dim text embeddings |
| **MongoDB** | Local document storage |
| **MongoDB Compass** | GUI for inspecting data |

---

## 📁 Project Structure
EcoRoute/
├── backend/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── controllers/
│ │ └── chatController.js # POST /api/chat handler
│ ├── data/
│ │ └── transport_data.txt # RAG knowledge base
│ ├── models/
│ │ └── Document.js # Mongoose schema
│ ├── routes/
│ │ └── chatRoutes.js # API route definitions
│ ├── scripts/
│ │ └── ingest.js # PDF/TXT → embeddings → MongoDB
│ ├── services/
│ │ ├── aiService.js # Ollama wrappers
│ │ └── ragService.js # RAG orchestration + cosine search
│ ├── .env # Secrets (not committed)
│ ├── package.json
│ └── server.js # Express entry point
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── ChatWindow.jsx # Main chat layout
│ │ │ ├── ChatInput.jsx # Message input + send button
│ │ │ └── MessageBubble.jsx # Individual message bubble
│ │ ├── services/
│ │ │ └── api.js # Axios wrapper
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css # Tailwind directives
│ ├── index.html
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── .gitignore
├── README.md
└── LICENSE



---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **npm** | 9+ | Package manager |
| **Ollama** | Latest | Local AI runtime |
| **MongoDB** | 6+ | Local database |
| **MongoDB Compass** | Latest | DB GUI (optional but recommended) |
| **Git** | Latest | Version control |

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/EcoRoute.git
cd EcoRoute
2. Install Ollama Models
Install Ollama from ollama.com/download, then:
    
bash
ollama pull llama3.2
ollama pull nomic-embed-text
Verify:

bash
ollama list
3. Start MongoDB
Ensure MongoDB is running locally on mongodb://127.0.0.1:27017.

Windows: MongoDB runs as a service automatically after installation

macOS: brew services start mongodb-community

Linux: sudo systemctl start mongod

4. Set Up Backend
bash
cd backend
npm install
Create .env (see Environment Variables).

Then run ingestion once:

bash
node scripts/ingest.js
Expected output:

text
✅ Connected to MongoDB for ingestion
📄 File loaded: XXXX characters
🔪 Created X chunks
💾 Stored chunk 1/X
...
✅ Ingestion complete!
Start the backend:

bash
npm run dev
Expected output:

text
✅ MongoDB connected
🚀 Server running on port 5000
5. Set Up Frontend
Open a new terminal:

bash
cd frontend
npm install
npm run dev
Expected output:

text
  VITE v8.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
6. Open the App
Go to http://localhost:5173 and try:

text
Hostel Block A to Railway Station, 8 AM, greenest
⏳ First reply may take 10–30 seconds while Ollama loads the model into memory.

🔐 Environment Variables
Create backend/.env:

env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecoroute
Variable	Description	Example
PORT	Backend port	5000
MONGO_URI	MongoDB connection string	mongodb://127.0.0.1:27017/ecoroute
⚠️ Never commit .env. It is already excluded in .gitignore.

📡 API Reference
POST /api/chat
Send a user question and receive a grounded AI reply.

Request

http
POST /api/chat
Content-Type: application/json

{
  "message": "Hostel to Railway Station, greenest"
}
Response — 200 OK

json
{
  "reply": "Based on the transport data:\n\n1. Campus Shuttle + Metro: ~35 min, ₹25, saves ~1.2 kg CO₂.\n2. Cycle + Bus 101: ~40 min, ₹15, saves ~1.5 kg CO₂.\n\nTip: Cycle rental available at Main Gate for ₹5/hour."
}
Response — 400 Bad Request

json
{ "error": "Message is required" }
Response — 500 Internal Server Error

json
{ "error": "Something went wrong" }
GET /
Health check.

Response — 200 OK

json
{ "status": "EcoRoute AI backend is running" }
🖼 Screenshots
Add screenshots after running the app locally.

Screen	Description
docs/screenshots/chat-ui.png	Main chat interface
docs/screenshots/mongodb-compass.png	Ingested documents in Compass
docs/screenshots/backend-logs.png	Backend terminal with retrieval logs
🛡 Responsible AI
EcoRoute AI was designed with the following principles:

Principle	Implementation
Fairness	Options include walking, cycling, and public transport for all income levels and abilities
Transparency	CO₂ estimates use published emission factors; retrieval scores are logged
Ethics	The AI refuses to hallucinate and says "I don't know" when the answer isn't in context
Privacy	All AI runs locally; no personal data is collected, stored, or transmitted
Safety	Recommends only officially approved, well-lit, and safe routes
Grounding	Answers are restricted to the local transport knowledge base
🌍 Expected Impact
📉 Lower carbon emissions from daily campus and city travel

💸 Money saved by students and staff choosing cheaper green options

🚴 Better health through increased walking and cycling

🚦 Reduced traffic and parking pressure on campus

📚 Increased awareness of sustainable transport options

🔁 Scalable model — can be adapted to any campus, city, or village

🗺 Roadmap
☑ Local RAG pipeline with Ollama
☑ In-memory cosine similarity search
☑ React chat UI with Tailwind
☑ MongoDB ingestion with embeddings
□ Multilingual support (Hindi, Tamil, Telugu)
□ Real-time transport API integration
□ User trip logging and CO₂ dashboard
□ Mobile PWA version
□ Map-based route visualization
□ Voice input support
👤 Author
[Your Name]
[Your College Name]

GitHub: @your-username

Email: your.email@example.com

Built as part of the 1M1B – IBM SkillsBuild & AICTE AI for Sustainability Virtual Internship.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

<p align="center"> <strong>🌱 EcoRoute AI</strong><br/> <em>Route smart. Travel green.</em> </p> ```
