import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "402 Network Explorer",
  description:
    "Block explorer for the $402 network — BSV-21 PoW20 token, 21M supply, mined via Proof of Indexing",
  keywords: ["402", "BSV", "Bitcoin SV", "PoW20", "BSV-21", "block explorer", "PATH402"],
  openGraph: {
    title: "402 Network Explorer",
    description: "Block explorer for the $402 network",
    url: "https://402network.online",
    siteName: "402 Network Explorer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} antialiased bg-black text-white`}
      >
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
