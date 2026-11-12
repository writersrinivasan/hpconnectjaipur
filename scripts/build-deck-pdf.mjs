// Builds the downloadable 10-page deck PDF from the /deck page.
// Each slide is captured at 2x resolution with the local Google Chrome, then assembled into a
// 16:9 PDF with pdf-lib (pixel-perfect: same colours, fonts and emoji as the web app).
//
// Usage: start the app (npm run dev / npm start), then:  npm run deck:pdf -- http://localhost:3000
import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("http")) || process.env.DECK_BASE_URL || "http://localhost:3000";
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "RangSutra-HP-Connect-Jaipur-Srinivasan-Ramanujam.pdf");
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: chrome, headless: true, timeout: 60000, protocolTimeout: 180000,
  ...(process.env.CHROME_PROFILE ? { userDataDir: process.env.CHROME_PROFILE } : {}),
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 800, deviceScaleFactor: 2 });
await page.goto(`${base}/deck`, { waitUntil: "networkidle0", timeout: 90000 });
await page.evaluate(async () => {
  document.querySelector(".deck-toolbar")?.remove();
  document.querySelectorAll(".slide").forEach((s) => { s.style.borderRadius = "0"; s.style.boxShadow = "none"; });
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
});

const pdf = await PDFDocument.create();
pdf.setTitle("RangSutra · Agentic AI for Founders & CXOs · HP Connect Jaipur");
pdf.setAuthor("Srinivasan Ramanujam · One Yoto");
pdf.setSubject("Multi-agent orchestration (LangGraph), RAG and MCP, explained through a Jaipur handicraft exporter");
pdf.setKeywords(["Agentic AI", "LangGraph", "RAG", "MCP", "Groq", "HP Connect", "One Yoto"]);
pdf.setCreator("RangSutra app");

const slides = await page.$$(".slide");
for (let i = 0; i < slides.length; i++) {
  const jpg = await slides[i].screenshot({ type: "jpeg", quality: 92 });
  if (process.env.SHOTS_DIR) await writeFile(`${process.env.SHOTS_DIR}/slide-${i + 1}.jpg`, jpg);
  const img = await pdf.embedJpg(jpg);
  const p = pdf.addPage([1280, 720]);
  p.drawImage(img, { x: 0, y: 0, width: 1280, height: 720 });
}
await browser.close();
await writeFile(out, await pdf.save());
console.log(`PDF written (${slides.length} pages):`, out);
