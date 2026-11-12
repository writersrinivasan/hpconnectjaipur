# RangSutra: Agentic AI for Founders (HP Connect · Jaipur)

A colourful, hands-on web app that explains **multi-agent orchestration (LangGraph)**, **RAG** and **MCP**
through **Rangrez Crafts**, a *fictional* hand-block textile & blue-pottery exporter in Sanganer, Jaipur.
The AI assistant uses **BYOK Groq**: each participant pastes their own free key.

## Run it
```bash
npm install
npm run dev          # http://localhost:3000
```
Get a free Groq key at https://console.groq.com/keys and paste it in **Live AI Desk → Add Groq key**.
No server-side env vars are needed. Deploy to Vercel as-is (`vercel` or import the repo).

## Pages
| Route | What it shows |
|---|---|
| `/` | The story: the shift to agents, one buyer email "today vs with agents", the 9-agent team, other industries |
| `/concepts` | AI vocabulary, **live RAG search**, **live MCP playground** (real JSON-RPC), orchestration patterns |
| `/assistant` | **Live AI Export Desk**: chat + animated LangGraph + step-by-step trace (RAG chunks, MCP requests, rules) |
| `/architecture` | Layered architecture, request lifecycle, BYOK, trust & safety, production checklist |
| `/learn` | Where / How / What to start, role-based starters, 22 curated resources, readiness check, ROI calculator, 90-day plan |
| `/present` | Full-screen slides for the session (← → keys) |

## The agents (src/lib/agents/graph.ts)
`Dwarpal` guardrails → `Sutradhar` LLM planner → parallel `Gyani` (RAG) · `Bhandari` · `Munim-ji` · `Saarthi` (MCP tools)
→ `Niti` rules (code) → `Malik-ji` human approval gate → `Sandesh` LLM writer.

## Suggested live-demo order
1. **Lena's email**: full team, parallel fan-out, ₹5 lakh + 18% discount → founder approval (draft)
2. **Policy question**: RAG only, with citations
3. **Hindi question**: same agents, multilingual reply
4. **Hack attempt**: blocked by Dwarpal, no LLM call
5. **Private data**: card number masked before the LLM sees it
6. **Off-topic (IPL)**: stays in scope

## Honest notes for Q&A
- RAG uses **BM25 keyword search** over 16 docs (no embeddings key needed). Production systems use embeddings + a vector DB.
- The MCP server speaks MCP's JSON-RPC messages (`initialize`, `tools/list`, `tools/call`) and is called in-process by the agents;
  `/api/mcp` exposes the same handler over HTTP for the playground.
- Human-in-the-loop is shown as an approval node + UI buttons; production would use LangGraph `interrupt()` with a durable checkpointer.
- All company data, prices, FX rates and freight rates are made up.

## The deck (10 pages, PDF)
- View online at `/deck`; download from the **Deck PDF** button (nav, footer, home page, Present mode).
- File: `public/RangSutra-HP-Connect-Jaipur-Srinivasan-Ramanujam.pdf`
- Edit slides in `src/app/deck/page.tsx`, then regenerate with the app running:
  `npm run deck:pdf -- http://localhost:3000` (uses your installed Google Chrome).
