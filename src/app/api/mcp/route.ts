import { handleMcp, type JsonRpcRequest } from "@/lib/mcp/server";

// MCP-style endpoint: POST a JSON-RPC 2.0 message (initialize, tools/list, tools/call).
// Try it:  curl -X POST localhost:3000/api/mcp -H 'content-type: application/json' \
//            -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
export async function POST(req: Request) {
  const msg = (await req.json().catch(() => null)) as JsonRpcRequest | null;
  if (!msg || msg.jsonrpc !== "2.0" || !msg.method) {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: expected a JSON-RPC 2.0 message" } }, { status: 400 });
  }
  return Response.json(handleMcp(msg));
}
