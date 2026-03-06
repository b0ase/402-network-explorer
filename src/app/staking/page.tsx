"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AddressLink } from "@/components/shared/AddressLink";
import { DataTable } from "@/components/ui/DataTable";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount, formatNumber } from "@/lib/format";
import type { StatItem } from "@/lib/types";

interface StakingData {
  stakers: StakerEntry[];
  totalStaked: number;
  totalDividendsPending: number;
  averageYield: number;
}

interface StakerEntry {
  address: string;
  amt: string | number;
  percentage?: number;
  ticker?: string;
}

export default function StakingPage() {
  const [data, setData] = useState<StakingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/staking");
        if (res.ok) setData(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const isEmpty = !data || (data.stakers.length === 0 && data.totalStaked === 0);

  const stats: StatItem[] = [
    {
      label: "Total Staked",
      value: data?.totalStaked ? formatTokenAmount(data.totalStaked, 0) : "—",
      status: "green",
    },
    {
      label: "Stakers",
      value: data?.stakers?.length ?? 0,
      status: "blue",
    },
    {
      label: "Pending Dividends",
      value: data?.totalDividendsPending ? formatNumber(data.totalDividendsPending) : "—",
      status: "amber",
    },
    {
      label: "Avg. Yield",
      value: data?.averageYield ? `${data.averageYield.toFixed(2)}%` : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          STAKING
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Network-wide staking — content token yields &amp; dividends
        </p>
      </motion.div>

      {loading ? <StatsSkeleton /> : <StatsGrid items={stats} />}

      <div className="border border-zinc-800 bg-zinc-950">
        <SectionLabel>
          <span className="px-4 pt-4 block">Cap Table</span>
        </SectionLabel>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : isEmpty ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No staking activity yet. Staking will be available when content tokens are minted.
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: "rank",
                label: "#",
                render: (_row: StakerEntry, i: number) => (
                  <span className="text-zinc-500 font-mono text-sm">{i + 1}</span>
                ),
                className: "w-12",
              },
              {
                key: "address",
                label: "Address",
                render: (row: StakerEntry) => <AddressLink address={row.address} />,
              },
              {
                key: "amount",
                label: "Staked",
                render: (row: StakerEntry) => {
                  const amt = typeof row.amt === "string" ? parseFloat(row.amt) : row.amt;
                  return <span className="font-mono text-sm">{formatTokenAmount(amt)}</span>;
                },
              },
              {
                key: "pct",
                label: "Share",
                render: (row: StakerEntry) => (
                  <span className="text-zinc-400 text-sm font-mono">
                    {row.percentage ? `${row.percentage.toFixed(2)}%` : "—"}
                  </span>
                ),
              },
            ]}
            data={data?.stakers ?? []}
            keyExtractor={(row: StakerEntry, i: number) => row.address || String(i)}
            emptyMessage="No stakers"
          />
        )}
      </div>
    </div>
  );
}
