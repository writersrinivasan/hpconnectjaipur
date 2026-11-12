// Minimal Groq client (OpenAI-compatible REST API). The key comes from the user (BYOK) per request.

export type Msg = { role: "system" | "user" | "assistant"; content: string };

export class GroqError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function groqChat(opts: { apiKey: string; model: string; messages: Msg[]; json?: boolean; temperature?: number; maxTokens?: number }) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 900,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    let msg = `Groq API error ${res.status}`;
    try { const j = await res.json(); msg = j?.error?.message ?? msg; } catch {}
    if (res.status === 401) msg = "Your Groq API key was rejected (401). Check the key in Settings.";
    if (res.status === 429) msg = "Groq rate limit reached (429). Wait a few seconds or pick a smaller model.";
    throw new GroqError(msg, res.status);
  }
  const j = await res.json();
  return {
    text: (j.choices?.[0]?.message?.content ?? "") as string,
    usage: j.usage as { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined,
  };
}
