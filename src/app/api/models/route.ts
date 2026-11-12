// Validates a BYOK Groq key and lists the chat models it can use.
export async function GET(req: Request) {
  const key = req.headers.get("x-groq-key")?.trim();
  if (!key) return Response.json({ ok: false, error: "No key" }, { status: 400 });
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: `Bearer ${key}` } }).catch(() => null);
  if (!r) return Response.json({ ok: false, error: "Could not reach Groq" }, { status: 502 });
  if (!r.ok) return Response.json({ ok: false, error: r.status === 401 ? "Invalid API key" : `Groq error ${r.status}` }, { status: r.status });
  const j = (await r.json()) as { data: { id: string; active?: boolean }[] };
  const models = j.data
    .filter((m) => m.active !== false && !/whisper|tts|guard|embed|playai|orpheus|compound|safeguard/i.test(m.id))
    .map((m) => m.id)
    .sort();
  return Response.json({ ok: true, models });
}
