// Agent "cast" — shared by the UI and the LangGraph server code.

export type AgentId = "dwarpal" | "sutradhar" | "gyani" | "bhandari" | "munim" | "saarthi" | "niti" | "malik" | "sandesh";

export type AgentMeta = {
  id: AgentId;
  name: string;
  emoji: string;
  role: string;
  analogy: string;
  does: string;
  tech: string;
  uses: "Guardrails" | "LLM" | "RAG" | "MCP" | "Rules" | "Human";
  color: string; // tailwind gradient classes
  hex: string;
};

export const AGENTS: AgentMeta[] = [
  { id: "dwarpal", name: "Dwarpal", emoji: "🛡️", role: "Gatekeeper", uses: "Guardrails",
    analogy: "The guard at the gate of Amber Fort. Nobody gets in without being checked.",
    does: "Checks every message first. Hides card and Aadhaar numbers and blocks tricks like 'ignore your instructions'.",
    tech: "Input guardrails, PII masking, prompt-injection filter", color: "from-rose-500 to-pink-600", hex: "#e11d48" },
  { id: "sutradhar", name: "Sutradhar", emoji: "🎭", role: "Orchestrator", uses: "LLM",
    analogy: "The kathputli (puppet show) master who holds all the strings and decides who moves next.",
    does: "Reads the request, works out what the buyer wants and sends the work to the right specialists, side by side.",
    tech: "LangGraph supervisor, LLM planning (JSON), conditional parallel fan-out", color: "from-fuchsia-500 to-purple-600", hex: "#c026d3" },
  { id: "gyani", name: "Gyani", emoji: "📚", role: "Knowledge Keeper", uses: "RAG",
    analogy: "The haveli librarian who finds the right page in the company's records and quotes it.",
    does: "Searches company policies (payment terms, lead times, GST, HS codes) and answers only from them, with citations.",
    tech: "RAG: BM25 retrieval over 16 docs, then a grounded LLM summary", color: "from-indigo-500 to-blue-600", hex: "#4f46e5" },
  { id: "bhandari", name: "Bhandari", emoji: "📦", role: "Godown Keeper", uses: "MCP",
    analogy: "The storekeeper with the godown keys, who knows exactly what is on the shelves.",
    does: "Asks the ERP how much stock there is and how many weeks the artisans need to make the rest.",
    tech: "MCP tools/call → check_inventory", color: "from-amber-500 to-orange-600", hex: "#ea580c" },
  { id: "munim", name: "Munim-ji", emoji: "💰", role: "Pricing Accountant", uses: "MCP",
    analogy: "The traditional Marwari munim with his red bahi-khata ledger. Every rupee is counted.",
    does: "Gets the price with volume discount and converts it into the buyer's currency.",
    tech: "MCP tools/call → get_price_quote, convert_currency", color: "from-yellow-400 to-amber-500", hex: "#d97706" },
  { id: "saarthi", name: "Saarthi", emoji: "🐪", role: "Logistics Guide", uses: "MCP",
    analogy: "The caravan guide who knows every route from Jaipur to the world.",
    does: "Estimates freight cost and transit days by sea (via Mundra port) or by air.",
    tech: "MCP tools/call → estimate_shipping", color: "from-teal-400 to-cyan-600", hex: "#0891b2" },
  { id: "niti", name: "Niti", emoji: "⚖️", role: "Compliance Officer", uses: "Rules",
    analogy: "The diwan who checks that every decree follows the rules of the kingdom.",
    does: "Checks MOQ, discount limits, export documents and the ₹5 lakh approval rule before anything goes out.",
    tech: "Deterministic policy rules (code, not AI) on the combined state", color: "from-emerald-500 to-green-600", hex: "#059669" },
  { id: "malik", name: "Malik-ji", emoji: "✋", role: "Founder Approval", uses: "Human",
    analogy: "The founder's signature on a big cheque. A human signs off on high-stakes decisions.",
    does: "Stops big or unusual deals and marks the reply as a DRAFT until the founder approves it.",
    tech: "Human-in-the-loop gate (LangGraph interrupt / approval node)", color: "from-sky-500 to-indigo-600", hex: "#0284c7" },
  { id: "sandesh", name: "Sandesh", emoji: "✉️", role: "Messenger", uses: "LLM",
    analogy: "The royal messenger who writes the final letter politely, in the reader's own language.",
    does: "Combines every agent's findings into one clear reply, with sources, in the buyer's language.",
    tech: "LLM synthesis with grounded context and citations", color: "from-pink-500 to-rose-500", hex: "#db2777" },
];

export const AGENT_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a])) as Record<AgentId, AgentMeta>;

export type TraceKind = "guard" | "plan" | "rag" | "mcp" | "llm" | "rule" | "human" | "info" | "error";
export type TraceEntry = {
  agent: AgentId;
  kind: TraceKind;
  title: string;
  detail?: string;
  data?: unknown;
  ms?: number;
};

export type ChatEvent =
  | { type: "start"; graph: string[] }
  | { type: "node"; node: AgentId; trace: TraceEntry[] }
  | { type: "final"; answer: string; status: "ok" | "blocked" | "draft"; citations: string[]; ms: number }
  | { type: "error"; message: string };

export const DEFAULT_MODEL = "llama-3.3-70b-versatile";
export const FALLBACK_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
