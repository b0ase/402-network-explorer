export const TOKEN = {
  id: "e6d40ba206340aa94ed74f3a34a032e09e0e9ef4deaf8b548aa9e0709ab0ddeb_0",
  ticker: "$402",
  name: "PATH402",
  protocol: "BSV-21",
  maxSupply: 21_000_000,
  decimals: 8,
  algorithm: "PoW20 (SHA-256)",
  mintLimit: 100,
  difficulty: "Dynamic",
  description: "BSV-21 PoW20 token, 21M supply, 100% mined via Proof of Indexing",
} as const;

export const API = {
  path402: "https://path402.com/api",
  pool: "http://135.181.103.181:3402/api/v1",
  gorillaPool: "https://ordinals.gorillapool.io/api",
  whatsOnChain: "https://api.whatsonchain.com/v1/bsv/main",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "$402 Mining", href: "/mining" },
  { label: "Content Tokens", href: "/content-tokens" },
  { label: "Staking", href: "/staking" },
  { label: "Revenue", href: "/revenue" },
  { label: "Token Tree", href: "/token-tree" },
  { label: "Nodes", href: "/miners" },
  { label: "Transactions", href: "/transactions" },
] as const;
