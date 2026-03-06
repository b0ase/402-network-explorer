"use client";

import { useEffect, useState } from "react";
import { TOKEN } from "@/lib/constants";
import { formatNumber, formatPercentage } from "@/lib/format";

export function SupplyChart() {
  const [supply, setSupply] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        const s = data.stats?.supply ?? data.gorillaPool?.amt ?? 0;
        setSupply(typeof s === "string" ? parseFloat(s) : s);
      } catch {
        setSupply(0);
      }
    }
    load();
  }, []);

  const pct = supply !== null ? (supply / TOKEN.maxSupply) * 100 : 0;

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-6">
      <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
        Supply Progress
      </div>
      <div className="relative h-6 bg-zinc-900 overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-green-500/20 border-r border-green-500 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-zinc-400">
          {supply !== null ? formatPercentage(pct) : "—"}
        </div>
      </div>
      <div className="flex justify-between text-xs text-zinc-500 font-mono">
        <span>Mined: {supply !== null ? formatNumber(supply) : "—"}</span>
        <span>Max: {formatNumber(TOKEN.maxSupply)}</span>
      </div>
    </div>
  );
}
