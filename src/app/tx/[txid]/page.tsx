"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CopyButton } from "@/components/ui/CopyButton";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface TxData {
  txid: string;
  blockhash?: string;
  blockheight?: number;
  confirmations?: number;
  time?: number;
  size?: number;
  fee?: number;
  vin?: Array<{
    txid: string;
    vout: number;
    scriptSig?: { hex: string };
    value?: number;
  }>;
  vout?: Array<{
    value: number;
    n: number;
    scriptPubKey?: { addresses?: string[]; hex?: string };
  }>;
}

export default function TxDetailPage() {
  const { txid } = useParams<{ txid: string }>();
  const [tx, setTx] = useState<TxData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tx/${txid}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTx(data);
      } catch {
        setError(true);
      }
    }
    if (txid) load();
  }, [txid]);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl tracking-tight">
          TRANSACTION
        </h1>
        <div className="border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-500">
          Transaction not found or failed to load
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          TRANSACTION
        </h1>
        <div className="flex items-center gap-2 text-sm font-mono text-zinc-400 break-all">
          {txid}
          <CopyButton text={txid} />
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-950 p-6">
        <SectionLabel>Overview</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Block Height
            </div>
            <div className="text-sm font-mono">{tx.blockheight ?? "Unconfirmed"}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Confirmations
            </div>
            <div className="text-sm font-mono">
              {tx.confirmations !== undefined ? (
                <Badge variant={tx.confirmations > 0 ? "green" : "amber"}>
                  {tx.confirmations}
                </Badge>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Time
            </div>
            <div className="text-sm font-mono">
              {tx.time
                ? new Date(tx.time * 1000).toLocaleString()
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Size
            </div>
            <div className="text-sm font-mono">
              {tx.size ? `${tx.size} bytes` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Fee
            </div>
            <div className="text-sm font-mono">
              {tx.fee !== undefined ? `${tx.fee} BSV` : "—"}
            </div>
          </div>
        </div>
      </div>

      {tx.vin && tx.vin.length > 0 && (
        <div className="border border-zinc-800 bg-zinc-950 p-6">
          <SectionLabel>Inputs ({tx.vin.length})</SectionLabel>
          <div className="divide-y divide-zinc-800/50">
            {tx.vin.map((input, i) => (
              <div key={i} className="py-2 flex items-center gap-4 text-sm font-mono">
                <span className="text-zinc-600 w-8">{i}</span>
                <span className="text-zinc-400 truncate flex-1">
                  {input.txid ? `${input.txid}:${input.vout}` : "Coinbase"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tx.vout && tx.vout.length > 0 && (
        <div className="border border-zinc-800 bg-zinc-950 p-6">
          <SectionLabel>Outputs ({tx.vout.length})</SectionLabel>
          <div className="divide-y divide-zinc-800/50">
            {tx.vout.map((output) => (
              <div key={output.n} className="py-2 flex items-center gap-4 text-sm font-mono">
                <span className="text-zinc-600 w-8">{output.n}</span>
                <span className="text-zinc-400 truncate flex-1">
                  {output.scriptPubKey?.addresses?.[0] ?? "OP_RETURN / Script"}
                </span>
                <span className="text-white">{output.value} BSV</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
