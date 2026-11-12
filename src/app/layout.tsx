import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AskFab from "@/components/AskFab";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "RangSutra · Agentic AI for Founders | HP Connect Jaipur",
  description: "A colourful, hands-on guide to Agentic AI: multi-agent orchestration with LangGraph, RAG and MCP, explained through a Jaipur handicraft exporter. Bring your own Groq key.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-blockprint">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <AskFab />
      </body>
    </html>
  );
}
