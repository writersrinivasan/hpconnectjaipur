// A small MCP-style tool server for Rangrez Crafts.
// It speaks the same JSON-RPC 2.0 messages as the Model Context Protocol:
//   initialize · tools/list · tools/call
// Agents never touch the "ERP" directly — they ask this server, which decides what is allowed.

import {
  PRODUCTS, DISCOUNT_TIERS, FX, SHIPPING, currencyFor, findProduct,
} from "../catalog";

type JsonSchema = { type: "object"; properties: Record<string, { type: string; description: string; enum?: string[] }>; required: string[] };
export type ToolDef = { name: string; title: string; description: string; system: string; inputSchema: JsonSchema };

export const TOOLS: ToolDef[] = [
  {
    name: "search_catalog", title: "Search catalog", system: "Product catalog (PIM)",
    description: "Find products by name, craft or keyword. Returns SKU, price and MOQ.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "e.g. 'blue pottery' or 'quilt'" } }, required: ["query"] },
  },
  {
    name: "check_inventory", title: "Check inventory", system: "Godown / ERP",
    description: "Stock on hand and how many weeks to produce the rest for a quantity.",
    inputSchema: { type: "object", properties: { sku: { type: "string", description: "Product SKU" }, quantity: { type: "number", description: "Pieces needed" } }, required: ["sku", "quantity"] },
  },
  {
    name: "get_price_quote", title: "Price quote", system: "Pricing engine",
    description: "Ex-works price with automatic volume discount for a SKU and quantity.",
    inputSchema: { type: "object", properties: { sku: { type: "string", description: "Product SKU" }, quantity: { type: "number", description: "Pieces" } }, required: ["sku", "quantity"] },
  },
  {
    name: "convert_currency", title: "Convert currency", system: "Bank FX feed (demo rates)",
    description: "Convert an INR amount into the buyer's currency.",
    inputSchema: { type: "object", properties: { amount_inr: { type: "number", description: "Amount in INR" }, currency: { type: "string", description: "ISO code", enum: Object.keys(FX) } }, required: ["amount_inr", "currency"] },
  },
  {
    name: "estimate_shipping", title: "Estimate shipping", system: "Freight forwarder API",
    description: "Freight cost and transit days from Jaipur to a destination country by sea or air.",
    inputSchema: { type: "object", properties: { sku: { type: "string", description: "Product SKU" }, quantity: { type: "number", description: "Pieces" }, country: { type: "string", description: "Destination country" }, mode: { type: "string", description: "sea or air", enum: ["sea", "air"] } }, required: ["sku", "quantity", "country"] },
  },
];

type Args = Record<string, unknown>;
const num = (v: unknown, d = 0) => (typeof v === "number" ? v : Number(v) || d);
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

function getProduct(sku: unknown) {
  const p = PRODUCTS.find((x) => x.sku.toLowerCase() === str(sku).toLowerCase()) ?? findProduct(str(sku));
  if (!p) throw new Error(`Unknown SKU '${str(sku)}'`);
  return p;
}

const handlers: Record<string, (a: Args) => unknown> = {
  search_catalog: (a) => {
    const q = str(a.query).toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    const direct = findProduct(q);
    const list = PRODUCTS.filter((p) => p === direct || words.some((w) => (p.name + " " + p.craft).toLowerCase().includes(w)));
    return { results: list.map(({ sku, name, priceInr, moq }) => ({ sku, name, price_inr: priceInr, moq })) };
  },
  check_inventory: (a) => {
    const p = getProduct(a.sku);
    const qty = num(a.quantity, p.moq);
    const shortfall = Math.max(0, qty - p.stock);
    const weeks = shortfall ? Math.ceil(shortfall / p.weeklyCapacity) : 0;
    return { sku: p.sku, requested: qty, in_stock: p.stock, shortfall, weeks_to_produce_shortfall: weeks, meets_moq: qty >= p.moq, moq: p.moq };
  },
  get_price_quote: (a) => {
    const p = getProduct(a.sku);
    const qty = num(a.quantity, p.moq);
    const tier = DISCOUNT_TIERS.find((t) => qty >= t.minQty);
    const pct = tier?.pct ?? 0;
    const unit = p.priceInr * (1 - pct / 100);
    return { sku: p.sku, quantity: qty, list_price_inr: p.priceInr, volume_discount_pct: pct, unit_price_inr: Math.round(unit), total_inr: Math.round(unit * qty), basis: "EXW Jaipur" };
  },
  convert_currency: (a) => {
    const cur = str(a.currency).toUpperCase() || "USD";
    const rate = FX[cur];
    if (!rate) throw new Error(`Unsupported currency ${cur}`);
    return { amount_inr: num(a.amount_inr), currency: cur, rate_inr_per_unit: rate, converted: Math.round((num(a.amount_inr) / rate) * 100) / 100, note: "Demo rates, not live" };
  },
  estimate_shipping: (a) => {
    const p = getProduct(a.sku);
    const qty = num(a.quantity, p.moq);
    const cur = currencyFor(str(a.country));
    const lane = SHIPPING[cur] ?? SHIPPING.USD;
    const weight = Math.round(qty * p.weightKg * 10) / 10;
    const mode = str(a.mode) === "air" ? "air" : str(a.mode) === "sea" ? "sea" : weight > 300 ? "sea" : "air";
    const [perKg, days] = lane[mode];
    return { country: str(a.country) || "USA", zone: lane.zone, mode, weight_kg: weight, cost_inr: Math.round(weight * perKg), transit_days: days, fragile: !!p.fragile };
  },
};

export type JsonRpcRequest = { jsonrpc: "2.0"; id: number | string; method: string; params?: Record<string, unknown> };
export type JsonRpcResponse = { jsonrpc: "2.0"; id: number | string; result?: unknown; error?: { code: number; message: string } };

/** Handle one JSON-RPC message exactly like an MCP server would. */
export function handleMcp(req: JsonRpcRequest): JsonRpcResponse {
  const { id, method, params } = req;
  try {
    if (method === "initialize") {
      return { jsonrpc: "2.0", id, result: { protocolVersion: "2025-06-18", serverInfo: { name: "rangrez-erp-mcp", version: "1.0.0" }, capabilities: { tools: {} } } };
    }
    if (method === "tools/list") {
      return { jsonrpc: "2.0", id, result: { tools: TOOLS.map(({ name, title, description, inputSchema }) => ({ name, title, description, inputSchema })) } };
    }
    if (method === "tools/call") {
      const name = str(params?.name);
      const h = handlers[name];
      if (!h) return { jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown tool: ${name}` } };
      const data = h((params?.arguments as Args) ?? {});
      return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data, isError: false } };
    }
    return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } };
  } catch (e) {
    return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: (e as Error).message }], isError: true } };
  }
}

let seq = 1;
/** Tiny MCP client: builds the JSON-RPC request, sends it to the server, returns request + response for the trace. */
export function callTool(name: string, args: Args) {
  const request: JsonRpcRequest = { jsonrpc: "2.0", id: seq++, method: "tools/call", params: { name, arguments: args } };
  const response = handleMcp(request);
  const r = response.result as { structuredContent?: unknown; isError?: boolean; content?: { text: string }[] } | undefined;
  return { request, response, data: r?.structuredContent as Record<string, unknown> | undefined, error: r?.isError ? r.content?.[0]?.text : response.error?.message };
}
