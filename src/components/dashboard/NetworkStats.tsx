"use client";

import { useEffect, useState } from "react";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import { formatNumber, formatPercentage } from "@/lib/format";
import { TOKEN } from "@/lib/constants";
import type { StatItem } from "@/lib/types";

export function NetworkStats() {
  const [stats, setStats] = useState<StatItem[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();

        const s = data.stats;
        const gp = data.gorillaPool;

        const supply = s?.totalCirculating ?? s?.supply ?? gp?.amt ?? 0;
        const supplyNum = typeof supply === "string" ? parseFloat(supply) : supply;
        const pctMined = (supplyNum / TOKEN.maxSupply) * 100;

        setStats([
          {
            label: "Circulating Supply",
            value: formatNumber(supplyNum),
            status: "green",
          },
          {
            label: "Price (sats)",
            value: s?.currentPrice ? `${s.currentPrice}` : s?.price ? `${s.price}` : "—",
            status: "blue",
          },
          {
            label: "Holders",
            value: s?.totalHolders?.toString() ?? gp?.accounts?.toString() ?? s?.holders?.toString() ?? "—",
            status: "green",
          },
          {
            label: "% Mined",
            value: formatPercentage(pctMined),
            change: `${formatNumber(TOKEN.maxSupply - supplyNum)} remaining`,
          },
        ]);
      } catch {
        setStats([
          { label: "Circulating Supply", value: "—" },
          { label: "Price (sats)", value: "—" },
          { label: "Holders", value: "—" },
          { label: "% Mined", value: "—" },
        ]);
      }
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <StatsSkeleton />;
  return <StatsGrid items={stats} />;
}
