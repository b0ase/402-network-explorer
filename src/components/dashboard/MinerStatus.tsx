"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface MinerAgg {
  total_miners: number;
  total_blocks_mined: number;
  total_hash_rate: number;
  active_miners: number;
}

interface MinerBrief {
  node_id: string;
  port: number;
  mining: {
    is_mining: boolean;
    hash_rate: number;
    blocks_mined: number;
  } | null;
}

export function MinerStatus() {
  const [agg, setAgg] = useState<MinerAgg | null>(null);
  const [miners, setMiners] = useState<MinerBrief[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/miners");
        const data = await res.json();
        setAgg(data.aggregate);
        setMiners(data.miners ?? []);
      } catch {
        setAgg(null);
      }
    }
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (!agg || agg.total_miners === 0) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-zinc-700" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              ClawMiner Nodes
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            No miners detected
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link href="/miners" className="block border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-colors p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 ${agg.active_miners > 0 ? "bg-green-500 animate-pulse-glow" : "bg-amber-500"}`} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            ClawMiner Nodes
          </span>
        </div>
        <Badge variant={agg.active_miners > 0 ? "green" : "amber"}>
          {agg.total_miners} {agg.total_miners === 1 ? "node" : "nodes"}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-0.5">Hash Rate</div>
          <div className="font-[family-name:var(--font-display)] font-black text-sm tracking-tight">
            {agg.total_hash_rate.toFixed(1)} <span className="text-zinc-500 text-xs">H/s</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-0.5">Blocks Mined</div>
          <div className="font-[family-name:var(--font-display)] font-black text-sm tracking-tight">
            {agg.total_blocks_mined}
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-0.5">Active</div>
          <div className="font-[family-name:var(--font-display)] font-black text-sm tracking-tight">
            {agg.active_miners} / {agg.total_miners}
          </div>
        </div>
      </div>
      {miners.length > 0 && (
        <div className="mt-3 flex gap-2">
          {miners.map((m) => (
            <div
              key={m.node_id + m.port}
              className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500"
            >
              <div className={`w-1 h-1 ${m.mining?.is_mining ? "bg-green-500" : "bg-amber-500"}`} />
              {m.node_id.slice(0, 8)}:{m.port}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
