// The "company library" for RAG. In production these would be PDFs, SOPs and price lists,
// split into chunks and stored in a vector database. Here: 16 short documents + a BM25 keyword
// retriever, so the demo runs in the browser and on the server with no extra API keys.

export type KDoc = { id: string; title: string; tag: string; text: string };

export const DOCS: KDoc[] = [
  { id: "KB-01", tag: "Company", title: "About Rangrez Crafts", text: "Rangrez Crafts was started in 1998 in Sanganer, Jaipur. We work with 140 artisan families across Sanganer, Bagru and Jaipur's blue pottery clusters. We export to 22 countries, mostly boutiques, home-decor chains and museum stores. Founder: Meera Rathore." },
  { id: "KB-02", tag: "Catalog", title: "Product catalog overview", text: "Core range: Sanganeri hand-block printed quilts (SNG-QLT-01), Bagru dabu-print bedsheet sets (BGR-BED-02), Jaipur blue pottery vases (BLP-VAS-03) and tiles (BLP-TIL-04), Leheriya silk dupattas (LHR-DUP-05), Kundan-style brass necklaces (KND-NCK-06), Jaipuri mojaris (MOJ-SHO-07) and handwoven cotton dhurrie rugs (DHR-RUG-08). Prices are ex-works Jaipur in INR." },
  { id: "KB-03", tag: "Sales policy", title: "Minimum order and volume discounts", text: "Each product has a minimum order quantity (MOQ) between 20 and 100 pieces. Volume discounts are automatic: 5% for 100 or more pieces, 8% for 250 or more, 12% for 500 or more pieces of a single SKU. Mixed containers qualify on total pieces only after founder approval." },
  { id: "KB-04", tag: "Operations", title: "Lead times and production calendar", text: "Standard lead time is 3 to 5 weeks after advance payment. Block printing slows during monsoon (July to September) because natural dyes need sun drying; add 1 to 2 weeks. The workshop closes for 6 days around Diwali and 3 days for Teej and Gangaur festivals. Rush orders under 3 weeks carry a 7% surcharge." },
  { id: "KB-05", tag: "Finance", title: "Payment terms", text: "New buyers pay 30% advance by bank transfer and 70% against a copy of the bill of lading. For orders above USD 25,000 we accept an irrevocable Letter of Credit (LC) at sight. Repeat buyers with 3 or more orders may get 30 days credit after founder approval." },
  { id: "KB-06", tag: "Compliance", title: "Export documentation", text: "Every shipment carries a commercial invoice, packing list, certificate of origin and bill of lading or airway bill. We hold an IEC (Import Export Code) and export under a GST LUT (Letter of Undertaking), so exports are zero-rated and no GST is charged to foreign buyers. Customs clearance is done by our CHA at ICD Jaipur (Kanakpura)." },
  { id: "KB-07", tag: "Compliance", title: "Indicative HS codes", text: "Indicative HS codes: quilts 9404, bed linen 6302, ceramic tableware and vases 6913, imitation jewellery 7117, footwear with leather uppers 6403, cotton rugs and dhurries 5702, silk dupattas 6214. Always confirm the final HS code with the customs house agent (CHA) before shipping." },
  { id: "KB-08", tag: "Logistics", title: "Incoterms and shipping modes", text: "We quote EXW Jaipur, FOB Mundra port or CIF destination port. Sea freight leaves from ICD Jaipur by rail to Mundra. Air cargo leaves from Jaipur or Delhi airport. Sea is cheapest for orders above 300 kg; air is better for samples, jewellery and urgent orders." },
  { id: "KB-09", tag: "Quality", title: "Dyes, fabric and certifications", text: "All textile dyes are AZO-free. Bagru dabu prints use natural indigo, pomegranate and iron-rust dyes with a mud-resist technique. GOTS-certified organic cotton is available for quilts and bedsheets at 9% extra. Colour may vary slightly between batches because every piece is printed by hand." },
  { id: "KB-10", tag: "Logistics", title: "Packaging and breakage", text: "Blue pottery is double-boxed with honeycomb paper and tested with a 1.2 metre drop. We accept up to 2% breakage in transit as normal for handmade ceramics and replace anything above 2% in the next shipment. Textiles are packed in recycled polybags and 5-ply cartons." },
  { id: "KB-11", tag: "Sales policy", title: "Custom designs and private label", text: "Buyers can order custom block designs. Carving a new wooden block takes 7 to 10 days and costs INR 4,500 per block. Custom designs need a minimum of 200 pieces per design. Private labels and woven brand tags are free above 300 pieces." },
  { id: "KB-12", tag: "Sales policy", title: "Samples", text: "Samples are charged at 2x the ex-works price plus courier cost. The sample charge is refunded as credit against the first order above INR 2 lakh. Samples are dispatched within 5 working days by air courier." },
  { id: "KB-13", tag: "After-sales", title: "Claims and returns", text: "Quality claims must be raised within 15 days of receiving goods, with photos and the carton number. Approved claims are settled as credit notes or replacement in the next shipment. We do not accept returns of custom-designed products." },
  { id: "KB-14", tag: "Heritage", title: "GI tags and sustainability", text: "Sanganeri hand block printing, Bagru hand block print and Blue Pottery of Jaipur are registered Geographical Indications (GI) of India. Our artisans are paid above minimum wage, women make up 46% of our workforce, and printing wastewater is treated before discharge." },
  { id: "KB-15", tag: "Quality", title: "Care instructions", text: "Hand-block printed textiles: first wash separately in cold water, mild detergent, dry in shade. Leheriya silk: dry clean only. Blue pottery is decorative, not food safe for acidic foods, and should be wiped with a damp cloth. Brass jewellery: keep away from perfume and water." },
  { id: "KB-16", tag: "Governance", title: "Discount authority and approvals", text: "Sales staff and AI agents may offer up to 15% total discount. Anything above 15% needs founder approval. Any single order above INR 5 lakh (500,000) must be approved by the founder before a final quote is sent. Credit terms and mixed-container discounts also need founder approval." },
];

const STOP = new Set("a an the and or of to for in on at by with is are be can do does we our you your i me my it this that what which how much many from as per any will would please about have has".split(" "));

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9ऀ-ॿ\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, ""));
}

const SYN: Record<string, string[]> = {
  price: ["discount", "cost"], cost: ["price"], ship: ["shipping", "freight", "logistic"],
  shipping: ["freight", "sea", "air"], deliver: ["lead", "time", "shipping"], delivery: ["lead", "time"],
  gst: ["tax", "lut"], tax: ["gst", "lut"], pay: ["payment", "advance"], payment: ["advance", "lc"],
  break: ["breakage"], broken: ["breakage", "claim"], damage: ["breakage", "claim"], return: ["claim"],
  organic: ["got"], certif: ["got", "azo"], custom: ["design", "block"], logo: ["private", "label"],
  diwali: ["festival", "calendar"], monsoon: ["lead"], urgent: ["rush", "air"], document: ["documentation", "invoice"],
};

type Indexed = { doc: KDoc; tf: Map<string, number>; len: number };
const INDEX: Indexed[] = DOCS.map((doc) => {
  const toks = tokenize(doc.title + " " + doc.title + " " + doc.text + " " + doc.tag);
  const tf = new Map<string, number>();
  toks.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
  return { doc, tf, len: toks.length };
});
const AVG = INDEX.reduce((s, d) => s + d.len, 0) / INDEX.length;
const DF = new Map<string, number>();
INDEX.forEach((d) => d.tf.forEach((_, t) => DF.set(t, (DF.get(t) ?? 0) + 1)));

export type Hit = { doc: KDoc; score: number; matched: string[] };

/** BM25 keyword retrieval — returns top-k documents with a score and the words that matched. */
export function retrieve(query: string, k = 3): { terms: string[]; hits: Hit[] } {
  const base = tokenize(query);
  const terms = Array.from(new Set(base.flatMap((t) => [t, ...(SYN[t] ?? [])])));
  const N = INDEX.length, k1 = 1.4, b = 0.75;
  const hits = INDEX.map(({ doc, tf, len }) => {
    let score = 0;
    const matched: string[] = [];
    for (const t of terms) {
      const f = tf.get(t);
      if (!f) continue;
      const df = DF.get(t) ?? 0;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      const w = base.includes(t) ? 1 : 0.5; // synonyms count half
      score += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * len) / AVG)));
      matched.push(t);
    }
    return { doc, score: Math.round(score * 100) / 100, matched };
  })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  return { terms, hits };
}
