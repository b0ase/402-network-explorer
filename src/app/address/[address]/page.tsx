"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CopyButton } from "@/components/ui/CopyButton";
import { TxLink } from "@/components/shared/TxLink";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { DataTable } from "@/components/ui/DataTable";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import type { StatItem } from "@/lib/types";

interface BalanceData {
  confirmed: number;
  unconfirmed: number;
}

interface HistoryItem {
  tx_hash: string;
  height: number;
  fee?: number;
}

export default function AddressPage() {
  const { address } = useParams<{ address: string }>();
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/address/${address}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setBalance(data.balance);
        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch {
        setError(true);
      }
    }
    if (address) load();
  }, [address]);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl tracking-tight">
          ADDRESS
        </h1>
        <div className="border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-500">
          Address not found or failed to load
        </div>
      </div>
    );
  }

  const totalBalance = balance
    ? (balance.confirmed + balance.unconfirmed) / 1e8
    : 0;

  const stats: StatItem[] = balance
    ? [
        {
          label: "Balance (BSV)",
          value: totalBalance.toFixed(8),
          status: "green",
        },
        {
          label: "Confirmed",
          value: (balance.confirmed / 1e8).toFixed(8),
        },
        {
          label: "Unconfirmed",
          value: (balance.unconfirmed / 1e8).toFixed(8),
          status: balance.unconfirmed > 0 ? "amber" : undefined,
        },
        {
          label: "Transactions",
          value: history?.length ?? "—",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          ADDRESS
        </h1>
        <div className="flex items-center gap-2 text-sm font-mono text-zinc-400 break-all">
          {address}
          <CopyButton text={address} />
        </div>
      </div>

      {!balance ? <StatsSkeleton /> : <StatsGrid items={stats} />}

      <div className="border border-zinc-800 bg-zinc-950">
        <div className="p-4">
          <SectionLabel>Transaction History</SectionLabel>
        </div>
        {!history ? (
          <TableSkeleton rows={10} />
        ) : (
          <DataTable
            columns={[
              {
                key: "txid",
                label: "TX ID",
                render: (row) => <TxLink txid={row.tx_hash} />,
              },
              {
                key: "height",
                label: "Block Height",
                render: (row) => (
                  <span className="text-sm font-mono text-zinc-400">
                    {row.height > 0 ? row.height : "Unconfirmed"}
                  </span>
                ),
              },
            ]}
            data={history}
            keyExtractor={(row, i) => row.tx_hash || String(i)}
            emptyMessage="No transactions found for this address"
          />
        )}
      </div>
    </div>
  );
}
