"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AddressLink } from "@/components/shared/AddressLink";
import { DataTable } from "@/components/ui/DataTable";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { formatTokenAmount, formatPercentage } from "@/lib/format";
import { formatPricingModel } from "@/lib/format";
import type { StatItem } from "@/lib/types";

interface TokenDetail {
  id: string;
  ticker?: string;
  tick?: string;
  sym?: string;
  name?: string;
  supply?: number;
  amt?: number;
  maxSupply?: number;
  max?: number;
  holders?: number;
  accounts?: number;
  decimals?: number;
  dec?: number;
  pricingModel?: string;
  protocol?: string;
  price?: number;
  issuer?: string;
}

interface CapTableEntry {
  address: string;
  amt: string | number;
  percentage?: number;
}

export default function ContentTokenDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [capTable, setCapTable] = useState<CapTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/content-tokens/${id}`);
        if (!res.ok) {
          setError("Token not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setToken(data.token);
        setCapTable(Array.isArray(data.capTable) ? data.capTable : []);
      } catch {
        setError("Failed to load token");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="p-8 text-center text-zinc-500">
        {error || "Token not found"}
      </div>
    );
  }

  const ticker = token.ticker || token.tick || token.sym || "???";
  const supply = token.supply ?? token.amt ?? 0;
  const maxSupply = token.maxSupply ?? token.max ?? supply;
  const holders = token.holders ?? token.accounts ?? 0;
  const decimals = token.decimals ?? token.dec ?? 8;

  const stats: StatItem[] = [
    { label: "Ticker", value: ticker, status: "green" },
    { label: "Supply", value: formatTokenAmount(supply, 0) },
    { label: "Max Supply", value: formatTokenAmount(maxSupply, 0) },
    { label: "Holders", value: holders, status: "blue" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight">
            {ticker}
          </h1>
          {token.pricingModel && (
            <Badge variant={
              token.pricingModel === "alice_bond" ? "purple" :
              token.pricingModel === "bonding_curve" ? "blue" :
              token.pricingModel === "fixed" ? "green" : "amber"
            }>
              {formatPricingModel(token.pricingModel)}
            </Badge>
          )}
          {token.protocol && <Badge variant="zinc">{token.protocol}</Badge>}
        </div>
        <p className="text-zinc-500 text-sm font-mono">
          {token.name || "Content Token"} — {decimals} decimals
        </p>
      </motion.div>

      <StatsGrid items={stats} />

      <div className="border border-zinc-800 bg-zinc-950">
        <SectionLabel>
          <span className="px-4 pt-4 block">Cap Table</span>
        </SectionLabel>
        {capTable.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No cap table data available
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: "rank",
                label: "#",
                render: (_row: CapTableEntry, i: number) => (
                  <span className="text-zinc-500 font-mono text-sm">{i + 1}</span>
                ),
                className: "w-12",
              },
              {
                key: "address",
                label: "Address",
                render: (row: CapTableEntry) => <AddressLink address={row.address} />,
              },
              {
                key: "amount",
                label: "Amount",
                render: (row: CapTableEntry) => {
                  const amt = typeof row.amt === "string" ? parseFloat(row.amt) : row.amt;
                  return <span className="font-mono text-sm">{formatTokenAmount(amt)}</span>;
                },
              },
              {
                key: "pct",
                label: "% of Supply",
                render: (row: CapTableEntry) => {
                  const amt = typeof row.amt === "string" ? parseFloat(row.amt) : row.amt;
                  const pct = maxSupply > 0 ? (amt / maxSupply) * 100 : 0;
                  return (
                    <span className="text-zinc-400 text-sm font-mono">
                      {formatPercentage(pct)}
                    </span>
                  );
                },
              },
            ]}
            data={capTable}
            keyExtractor={(row: CapTableEntry, i: number) => row.address || String(i)}
            emptyMessage="No holders"
          />
        )}
      </div>
    </div>
  );
}
