"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { TxLink } from "@/components/shared/TxLink";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount } from "@/lib/format";

interface TxItem {
  txid: string;
  op: string;
  amt: string | number;
  from?: string;
  to?: string;
  height?: number;
  idx?: string;
}

export default function TransactionsPage() {
  const [txs, setTxs] = useState<TxItem[] | null>(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    async function load() {
      try {
        const offset = (page - 1) * limit;
        const res = await fetch(`/api/transactions?limit=${limit}&offset=${offset}`);
        const data = await res.json();
        setTxs(Array.isArray(data) ? data : data.results ?? data.history ?? []);
      } catch {
        setTxs([]);
      }
    }
    load();
  }, [page]);

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
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          TRANSACTIONS
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          $402 token transaction history
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        {!txs ? (
          <TableSkeleton rows={10} />
        ) : (
          <>
            <DataTable
              columns={[
                {
                  key: "op",
                  label: "Type",
                  render: (row) => (
                    <Badge variant={opVariant(row.op)}>{row.op || "tx"}</Badge>
                  ),
                },
                {
                  key: "amt",
                  label: "Amount",
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
                  key: "txid",
                  label: "TX ID",
                  render: (row) => (
                    <TxLink txid={row.txid || row.idx?.split("_")[0] || ""} />
                  ),
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
              data={txs}
              keyExtractor={(row, i) => row.txid || row.idx || String(i)}
              emptyMessage="No transactions found"
            />
            <div className="p-4">
              <Pagination
                page={page}
                totalPages={txs.length === limit ? page + 1 : page}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
