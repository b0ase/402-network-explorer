"use client";

import { useEffect, useState } from "react";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { formatNumber } from "@/lib/format";
import type { StatItem } from "@/lib/types";

interface ChainData {
  chain: string;
  inscriptions?: number;
  count?: number;
  fees?: number;
  totalFees?: number;
}

interface InscriptionData {
  total?: number;
  totalInscriptions?: number;
  totalFees?: number;
  chains?: ChainData[];
  byChain?: ChainData[];
  [key: string]: unknown;
}

export default function InscriptionsPage() {
  const [data, setData] = useState<InscriptionData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/inscriptions");
        const json = await res.json();
        setData(json);
      } catch {
        setData({});
      }
    }
    load();
  }, []);

  const chains = data?.chains ?? data?.byChain ?? [];
  const totalInscriptions = data?.total ?? data?.totalInscriptions ?? 0;
  const totalFees = data?.totalFees ?? 0;

  const stats: StatItem[] = [
    { label: "Total Inscriptions", value: formatNumber(totalInscriptions, 0), status: "green" },
    { label: "Total Fees", value: totalFees > 0 ? formatNumber(totalFees) : "—" },
    { label: "Chains", value: chains.length || "—", status: "blue" },
    { label: "Protocol", value: "x402" },
  ];

  const chainVariant = (chain: string) => {
    switch (chain?.toLowerCase()) {
      case "bsv":
        return "green" as const;
      case "base":
      case "ethereum":
        return "blue" as const;
      case "solana":
        return "amber" as const;
      default:
        return "zinc" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          x402 INSCRIPTIONS
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Cross-chain inscription activity
        </p>
      </div>

      {!data ? <StatsSkeleton /> : <StatsGrid items={stats} />}

      <div className="border border-zinc-800 bg-zinc-950">
        <div className="p-4">
          <SectionLabel>By Chain</SectionLabel>
        </div>
        {!data ? (
          <TableSkeleton rows={4} />
        ) : chains.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No chain data available
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {chains.map((chain, i) => (
              <div
                key={chain.chain || i}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={chainVariant(chain.chain)}>
                    {chain.chain}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm font-mono">
                  <div>
                    <span className="text-zinc-500 text-[9px] uppercase tracking-wider mr-2">
                      Inscriptions
                    </span>
                    <span>{chain.inscriptions ?? chain.count ?? 0}</span>
                  </div>
                  {(chain.fees ?? chain.totalFees) !== undefined && (
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase tracking-wider mr-2">
                        Fees
                      </span>
                      <span>{chain.fees ?? chain.totalFees}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
