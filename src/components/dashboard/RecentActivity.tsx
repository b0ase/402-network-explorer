"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { TxLink } from "@/components/shared/TxLink";
import { AddressLink } from "@/components/shared/AddressLink";
import { Badge } from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount, formatTimeAgo } from "@/lib/format";

interface ActivityItem {
  txid: string;
  op: string;
  amt: string | number;
  from?: string;
  to?: string;
  height?: number;
  idx?: string;
  timestamp?: number;
}

export function RecentActivity() {
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/transactions?limit=10");
        const data = await res.json();
        setActivity(Array.isArray(data) ? data : data.results ?? data.history ?? []);
      } catch {
        setActivity([]);
      }
    }
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!activity) return <TableSkeleton rows={5} />;

  const opVariant = (op: string) => {
    switch (op?.toLowerCase()) {
      case "mint":
      case "deploy+mint":
        return "green" as const;
      case "transfer":
        return "blue" as const;
      case "burn":
        return "amber" as const;
      default:
        return "zinc" as const;
    }
  };

  return (
    <DataTable
      columns={[
        {
          key: "op",
          label: "Type",
          render: (row) => <Badge variant={opVariant(row.op)}>{row.op || "tx"}</Badge>,
        },
        {
          key: "amt",
          label: "Amount",
          render: (row) => (
            <span className="font-mono text-sm">
              {formatTokenAmount(typeof row.amt === "string" ? parseFloat(row.amt) : row.amt)}
            </span>
          ),
        },
        {
          key: "txid",
          label: "TX ID",
          render: (row) => <TxLink txid={row.txid || row.idx?.split("_")[0] || ""} />,
        },
        {
          key: "height",
          label: "Block",
          render: (row) => (
            <span className="text-sm text-zinc-400 font-mono">
              {row.height || "—"}
            </span>
          ),
          className: "hidden md:table-cell",
        },
      ]}
      data={activity.slice(0, 10)}
      keyExtractor={(row, i) => row.txid || row.idx || String(i)}
      emptyMessage="No recent activity"
    />
  );
}
