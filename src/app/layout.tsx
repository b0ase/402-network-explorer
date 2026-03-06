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
  title: "PATH402 Network Explorer",
  description:
    "Network dashboard for the PATH402 protocol stack — $401 Identity, $402 Content & Payment (PoW20), $403 Access Control. Mining, staking, revenue & content tokens.",
  keywords: ["PATH402", "$401", "$402", "$403", "BSV", "Bitcoin SV", "PoW20", "BSV-21", "network dashboard", "Proof of Indexing", "content tokens", "staking"],
  openGraph: {
    title: "PATH402 Network Explorer",
    description: "Block explorer for the PATH402 network",
    url: "https://402network.online",
    siteName: "PATH402 Network Explorer",
    type: "website",
    images: [
      {
        url: "https://402network.online/api/og",
        width: 1200,
        height: 630,
        alt: "PATH402 Network Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PATH402 Network Explorer",
    description: "Block explorer for the PATH402 network — BSV-21 PoW20 token, 21M supply",
    images: ["https://402network.online/api/og"],
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
