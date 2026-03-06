export function formatNumber(n: number, decimals = 2): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

export function formatTokenAmount(amount: number, decimals = 8): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatSats(sats: number): string {
  return `${sats.toLocaleString()} sats`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function truncateTxid(txid: string, chars = 8): string {
  if (txid.length <= chars * 2 + 3) return txid;
  return `${txid.slice(0, chars)}...${txid.slice(-chars)}`;
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatBSV(sats: number): string {
  const bsv = sats / 100_000_000;
  return `${bsv.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} BSV`;
}

export function formatBPS(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

export function formatPricingModel(model: string): string {
  const labels: Record<string, string> = {
    fixed: "Fixed Price",
    bonding_curve: "Bonding Curve",
    alice_bond: "Alice Bond",
    free: "Free Mint",
  };
  return labels[model] || model;
}

export function detectSearchType(query: string): "tx" | "address" | "token" | null {
  const trimmed = query.trim();
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return "tx";
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)) return "address";
  if (trimmed.startsWith("$")) return "token";
  return null;
}
