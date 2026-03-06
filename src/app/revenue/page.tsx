"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { TxLink } from "@/components/shared/TxLink";
import { DataTable } from "@/components/ui/DataTable";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { formatNumber, formatSats, formatTimeAgo } from "@/lib/format";
import type { StatItem, RevenueDeposit, RevenueDistribution } from "@/lib/types";

interface RevenueData {
  totalRevenue: number;
  totalDistributed: number;
  totalPending: number;
  operatorFees: number;
  deposits: RevenueDeposit[];
  distributions: RevenueDistribution[];
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/revenue");
        if (res.ok) setData(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const isEmpty = !data || (data.totalRevenue === 0 && data.deposits.length === 0);

  const stats: StatItem[] = [
    {
      label: "Total Revenue",
      value: data?.totalRevenue ? formatSats(data.totalRevenue) : "—",
      status: "green",
    },
    {
      label: "Distributed",
      value: data?.totalDistributed ? formatSats(data.totalDistributed) : "—",
      status: "blue",
    },
    {
      label: "Pending",
      value: data?.totalPending ? formatSats(data.totalPending) : "—",
      status: "amber",
    },
    {
      label: "Operator Fees",
      value: data?.operatorFees ? formatSats(data.operatorFees) : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          REVENUE
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Content revenue deposits, operator fees &amp; dividend distributions
        </p>
      </motion.div>

      {loading ? <StatsSkeleton /> : <StatsGrid items={stats} />}

      <div className="border border-zinc-800 bg-zinc-950">
        <SectionLabel>
          <span className="px-4 pt-4 block">Revenue Deposits</span>
        </SectionLabel>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : isEmpty ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No revenue data yet. Revenue is generated when content tokens receive payments via the $402 protocol.
          </div>
        ) : data.deposits.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No deposits recorded yet
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: "ticker",
                label: "Token",
                render: (row: RevenueDeposit) => (
                  <Badge variant="green">{row.ticker}</Badge>
                ),
              },
              {
                key: "amount",
                label: "Amount",
                render: (row: RevenueDeposit) => (
                  <span className="font-mono text-sm">{formatNumber(row.amount)}</span>
                ),
              },
              {
                key: "txid",
                label: "TX",
                render: (row: RevenueDeposit) => <TxLink txid={row.txid} />,
              },
              {
                key: "time",
                label: "When",
                render: (row: RevenueDeposit) => (
                  <span className="text-zinc-400 text-sm">{formatTimeAgo(row.timestamp)}</span>
                ),
              },
            ]}
            data={data.deposits}
            keyExtractor={(row: RevenueDeposit, i: number) => row.txid || String(i)}
            emptyMessage="No deposits"
          />
        )}
      </div>

      {data && data.distributions.length > 0 && (
        <div className="border border-zinc-800 bg-zinc-950">
          <SectionLabel>
            <span className="px-4 pt-4 block">Distributions</span>
          </SectionLabel>
          <DataTable
            columns={[
              {
                key: "ticker",
                label: "Token",
                render: (row: RevenueDistribution) => (
                  <Badge variant="blue">{row.ticker}</Badge>
                ),
              },
              {
                key: "amount",
                label: "Amount",
                render: (row: RevenueDistribution) => (
                  <span className="font-mono text-sm">{formatNumber(row.amount)}</span>
                ),
              },
              {
                key: "recipients",
                label: "Recipients",
                render: (row: RevenueDistribution) => (
                  <span className="text-zinc-400 text-sm">{row.recipients}</span>
                ),
              },
              {
                key: "txid",
                label: "TX",
                render: (row: RevenueDistribution) => <TxLink txid={row.txid} />,
              },
            ]}
            data={data.distributions}
            keyExtractor={(row: RevenueDistribution, i: number) => row.txid || String(i)}
            emptyMessage="No distributions"
          />
        </div>
      )}
    </div>
  );
}
