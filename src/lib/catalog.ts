// Demo data for "Rangrez Crafts", a fictional handicraft & textile export house in Sanganer, Jaipur.
// All numbers are illustrative, made up for the workshop.

export type Product = {
  sku: string;
  name: string;
  craft: string;
  priceInr: number; // ex-works price per piece
  weightKg: number; // packed weight per piece
  moq: number;
  stock: number;
  weeklyCapacity: number;
  fragile?: boolean;
  emoji: string;
};

export const PRODUCTS: Product[] = [
  { sku: "SNG-QLT-01", name: "Sanganeri hand-block printed cotton quilt (Queen)", craft: "Sanganeri block print", priceInr: 3200, weightKg: 1.8, moq: 50, stock: 420, weeklyCapacity: 300, emoji: "🛏️" },
  { sku: "BGR-BED-02", name: "Bagru dabu-print bedsheet set (2 pillow covers)", craft: "Bagru dabu print", priceInr: 1450, weightKg: 1.1, moq: 100, stock: 900, weeklyCapacity: 600, emoji: "🧵" },
  { sku: "BLP-VAS-03", name: "Jaipur blue pottery vase, 10 inch", craft: "Blue pottery", priceInr: 1100, weightKg: 1.4, moq: 30, stock: 160, weeklyCapacity: 80, fragile: true, emoji: "🏺" },
  { sku: "BLP-TIL-04", name: "Blue pottery wall tiles, set of 6", craft: "Blue pottery", priceInr: 950, weightKg: 1.6, moq: 50, stock: 310, weeklyCapacity: 150, fragile: true, emoji: "💠" },
  { sku: "LHR-DUP-05", name: "Leheriya silk dupatta", craft: "Leheriya tie-dye", priceInr: 1800, weightKg: 0.2, moq: 50, stock: 650, weeklyCapacity: 400, emoji: "🌈" },
  { sku: "KND-NCK-06", name: "Kundan-style brass necklace (fashion jewellery)", craft: "Kundan work", priceInr: 2600, weightKg: 0.15, moq: 25, stock: 240, weeklyCapacity: 120, emoji: "💎" },
  { sku: "MOJ-SHO-07", name: "Handcrafted Jaipuri mojari (leather juttis)", craft: "Mojari leatherwork", priceInr: 900, weightKg: 0.6, moq: 60, stock: 1200, weeklyCapacity: 500, emoji: "🥿" },
  { sku: "DHR-RUG-08", name: "Handwoven cotton dhurrie rug, 4x6 ft", craft: "Dhurrie weaving", priceInr: 4800, weightKg: 3.5, moq: 20, stock: 85, weeklyCapacity: 40, emoji: "🧶" },
];

// Volume discount tiers (KB-03)
export const DISCOUNT_TIERS = [
  { minQty: 500, pct: 12 },
  { minQty: 250, pct: 8 },
  { minQty: 100, pct: 5 },
];

// Demo FX rates, INR per 1 unit of currency. NOT live rates.
export const FX: Record<string, number> = {
  USD: 84.5, EUR: 91.2, GBP: 107.4, AED: 23.0, AUD: 55.1, CAD: 61.3, SGD: 63.8, JPY: 0.56, INR: 1,
};

export const COUNTRY_CURRENCY: Record<string, string> = {
  usa: "USD", "united states": "USD", us: "USD", america: "USD",
  uk: "GBP", "united kingdom": "GBP", england: "GBP", britain: "GBP",
  germany: "EUR", france: "EUR", netherlands: "EUR", italy: "EUR", spain: "EUR",
  uae: "AED", dubai: "AED",
  australia: "AUD", canada: "CAD", singapore: "SGD", japan: "JPY", india: "INR",
};

// Shipping zones: INR per kg + transit days (from ICD Jaipur via Mundra port / Jaipur air cargo)
export const SHIPPING: Record<string, { zone: string; sea: [number, number]; air: [number, number] }> = {
  USD: { zone: "North America", sea: [95, 32], air: [520, 6] },
  CAD: { zone: "North America", sea: [105, 35], air: [560, 7] },
  EUR: { zone: "Europe", sea: [80, 26], air: [430, 5] },
  GBP: { zone: "Europe", sea: [82, 27], air: [440, 5] },
  AED: { zone: "Middle East", sea: [35, 9], air: [210, 2] },
  AUD: { zone: "Oceania", sea: [90, 24], air: [480, 6] },
  SGD: { zone: "South-East Asia", sea: [45, 12], air: [260, 3] },
  JPY: { zone: "East Asia", sea: [70, 18], air: [390, 4] },
  INR: { zone: "Domestic", sea: [18, 5], air: [90, 2] },
};

export const APPROVAL_THRESHOLD_INR = 500000; // orders above ₹5 lakh need founder sign-off (KB-16)
export const MAX_SALES_DISCOUNT = 15; // % discount sales may give without founder (KB-16)

export function findProduct(text: string): Product | undefined {
  const t = text.toLowerCase();
  const bySku = PRODUCTS.find((p) => t.includes(p.sku.toLowerCase()));
  if (bySku) return bySku;
  const hints: [RegExp, string][] = [
    [/quilt|razai|rajai|comforter/, "SNG-QLT-01"],
    [/bed ?sheet|bedding|bagru|dabu/, "BGR-BED-02"],
    [/vase/, "BLP-VAS-03"],
    [/tile/, "BLP-TIL-04"],
    [/blue pottery|pottery|ceramic/, "BLP-VAS-03"],
    [/dupatta|stole|scarf|leheriya|lehariya/, "LHR-DUP-05"],
    [/necklace|jewel|kundan/, "KND-NCK-06"],
    [/mojari|jutti|juti|shoe|footwear/, "MOJ-SHO-07"],
    [/dhurrie|durrie|rug|carpet/, "DHR-RUG-08"],
  ];
  for (const [re, sku] of hints) if (re.test(t)) return PRODUCTS.find((p) => p.sku === sku);
  return undefined;
}

export function currencyFor(country: string | null | undefined): string {
  if (!country) return "USD";
  const c = country.toLowerCase().trim();
  return COUNTRY_CURRENCY[c] ?? (FX[country.toUpperCase()] ? country.toUpperCase() : "USD");
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
