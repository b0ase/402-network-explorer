"use client";

import { useEffect, useState } from "react";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import { formatNumber, formatTokenAmount } from "@/lib/format";
import type { NetworkOverview, StatItem } from "@/lib/types";

export function NetworkOverviewStats() {
  const [data, setData] = useState<NetworkOverview | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/network");
        if (res.ok) setData(await res.json());
      } catch {}
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <StatsSkeleton />;

  const stats: StatItem[] = [
    {
      label: "$402 Supply",
      value: `${formatTokenAmount(data.powSupply, 0)} / ${formatNumber(data.powMaxSupply, 1)}`,
      change: `${data.powPercentMined.toFixed(2)}% mined`,
      status: "green",
    },
    {
      label: "Content Tokens",
      value: data.contentTokens,
      status: data.contentTokens > 0 ? "blue" : "zinc" as "blue",
    },
    {
      label: "Total Staked",
      value: data.totalStaked > 0 ? formatTokenAmount(data.totalStaked, 0) : "—",
      status: "purple" as StatItem["status"],
    },
    {
      label: "Revenue",
      value: data.totalRevenue > 0 ? formatNumber(data.totalRevenue) : "—",
      status: "amber",
    },
    {
      label: "Active Nodes",
      value: data.activeNodes,
      status: "green",
    },
    {
      label: "$402 Holders",
      value: data.powHolders,
      status: "blue",
    },
  ];

  return <StatsGrid items={stats} />;
}
