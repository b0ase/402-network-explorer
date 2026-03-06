"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { AddressLink } from "@/components/shared/AddressLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount, formatPercentage } from "@/lib/format";
import { TOKEN } from "@/lib/constants";

interface HolderData {
  address: string;
  amt: string | number;
}

export default function HoldersPage() {
  const [holders, setHolders] = useState<HolderData[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/holders");
        const data = await res.json();
        setHolders(Array.isArray(data) ? data : []);
      } catch {
        setHolders([]);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          HOLDERS
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          $402 rich list — ranked by balance
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        <SectionLabel>
          <span className="px-4 pt-4 block">
            {holders ? `${holders.length} holders` : "Loading..."}
          </span>
        </SectionLabel>
        {!holders ? (
          <TableSkeleton rows={10} />
        ) : (
          <DataTable
            columns={[
              {
                key: "rank",
                label: "#",
                render: (_row, i) => (
                  <span className="text-zinc-500 font-mono text-sm">{i + 1}</span>
                ),
                className: "w-12",
              },
              {
                key: "address",
                label: "Address",
                render: (row) => <AddressLink address={row.address} />,
              },
              {
                key: "balance",
                label: "Balance",
                render: (row) => {
                  const amt = typeof row.amt === "string" ? parseFloat(row.amt) : row.amt;
                  return (
                    <span className="font-mono text-sm">
                      {formatTokenAmount(amt)}
                    </span>
                  );
                },
              },
              {
                key: "pct",
                label: "% of Supply",
                render: (row) => {
                  const amt = typeof row.amt === "string" ? parseFloat(row.amt) : row.amt;
                  const pct = (amt / TOKEN.maxSupply) * 100;
                  return (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-900 overflow-hidden hidden md:block">
                        <div
                          className="h-full bg-green-500/40"
                          style={{ width: `${Math.min(pct * 5, 100)}%` }}
                        />
                      </div>
                      <span className="text-zinc-400 text-sm font-mono">
                        {formatPercentage(pct)}
                      </span>
                    </div>
                  );
                },
              },
            ]}
            data={holders}
            keyExtractor={(row, i) => row.address || String(i)}
            emptyMessage="No holder data available"
          />
        )}
      </div>
    </div>
  );
}
