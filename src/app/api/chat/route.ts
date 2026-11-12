import { buildGraph } from "@/lib/agents/graph";
import { DEFAULT_MODEL, type ChatEvent, type AgentId } from "@/lib/agents/meta";
import type { Msg } from "@/lib/groq";

// BYOK: the Groq key arrives in a header on every request. It is used for this request only —
// never logged, never stored on the server.
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) return Response.json({ error: "Add your Groq API key in Settings first." }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { message?: string; history?: Msg[]; model?: string };
  const message = (body.message ?? "").toString().trim();
  if (!message) return Response.json({ error: "Empty message" }, { status: 400 });
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-6)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
  const model = (body.model || DEFAULT_MODEL).toString();

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: ChatEvent) => controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
      const t0 = Date.now();
      try {
        const graph = buildGraph(apiKey, model);
        send({ type: "start", graph: ["dwarpal", "sutradhar", "gyani", "bhandari", "munim", "saarthi", "niti", "malik", "sandesh"] });
        let answer = "", status: "ok" | "blocked" | "draft" = "ok", citations: string[] = [];
        const updates = await graph.stream({ question: message, history }, { streamMode: "updates" });
        for await (const chunk of updates) {
          for (const [node, upd] of Object.entries(chunk as Record<string, Record<string, unknown> | undefined>)) {
            send({ type: "node", node: node as AgentId, trace: (upd?.trace as never[]) ?? [] });
            if (upd?.citations) citations = citations.concat(upd.citations as string[]);
            if (node === "sandesh") { answer = (upd?.answer as string) ?? ""; status = (upd?.status as typeof status) ?? status; }
          }
        }
        send({ type: "final", answer, status, citations: Array.from(new Set(citations)), ms: Date.now() - t0 });
      } catch (e) {
        send({ type: "error", message: (e as Error).message || "Something went wrong" });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
