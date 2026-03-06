"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { AddressLink } from "@/components/shared/AddressLink";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import type { StatItem } from "@/lib/types";

interface MinerData {
  port: number;
  node_id: string;
  version: string;
  uptime_ms: number;
  mining: {
    blocks_mined: number;
    hash_rate: number;
    difficulty: number;
    is_mining: boolean;
    last_block: string;
    mempool_size: number;
    miner_address: string;
  } | null;
  peers: { connected: number; known: number };
  headers: {
    chain_tip: number;
    highest_height: number;
    is_syncing: boolean;
    total_headers: number;
  } | null;
  tokens: { known: number } | null;
  portfolio: {
    total_value: number;
    total_spent: number;
    total_revenue: number;
    total_pnl: number;
  } | null;
}

interface MinersResponse {
  miners: MinerData[];
  aggregate: {
    total_miners: number;
    total_blocks_mined: number;
    total_hash_rate: number;
    active_miners: number;
  };
}

function formatUptime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${mins}m`;
}

export default function MinersPage() {
  const [data, setData] = useState<MinersResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/miners");
        const json = await res.json();
        setData(json);
      } catch {
        setData({ miners: [], aggregate: { total_miners: 0, total_blocks_mined: 0, total_hash_rate: 0, active_miners: 0 } });
      }
    }
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  const agg = data?.aggregate;

  const stats: StatItem[] = agg
    ? [
        { label: "Miners Found", value: agg.total_miners, status: agg.total_miners > 0 ? "green" : undefined },
        { label: "Active Mining", value: agg.active_miners, status: agg.active_miners > 0 ? "green" : "amber" },
        { label: "Total Hash Rate", value: `${agg.total_hash_rate.toFixed(1)} H/s` },
        { label: "Total Blocks Mined", value: agg.total_blocks_mined },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          CLAWMINER NODES
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Local ClawMiner instances — scanning ports 8402-8410
        </p>
      </div>

      {!data ? <StatsSkeleton /> : <StatsGrid items={stats} />}

      {data && data.miners.length === 0 && (
        <div className="border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="text-zinc-500 mb-2">No ClawMiner instances detected</div>
          <div className="text-[10px] text-zinc-600 font-mono">
            Scanning 127.0.0.1 ports 8402-8410 — ensure clawminerd is running
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data?.miners.map((miner, i) => (
          <motion.div
            key={miner.node_id + miner.port}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-zinc-800 bg-zinc-950"
          >
            {/* Node Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 ${miner.mining?.is_mining ? "bg-green-500 animate-pulse-glow" : "bg-amber-500"}`} />
                <span className="font-[family-name:var(--font-display)] font-bold text-sm">
                  NODE {miner.node_id.slice(0, 8)}
                </span>
                <Badge variant={miner.mining?.is_mining ? "green" : "amber"}>
                  {miner.mining?.is_mining ? "Mining" : "Idle"}
                </Badge>
                <span className="text-[10px] text-zinc-600 font-mono">
                  v{miner.version}
                </span>
              </div>
              <div className="text-[10px] text-zinc-600 font-mono">
                :{miner.port} — up {formatUptime(miner.uptime_ms)}
              </div>
            </div>

            {/* Mining Stats */}
            {miner.mining && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800/30">
                <div className="bg-zinc-950 px-6 py-4">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                    Hash Rate
                  </div>
                  <div className="font-[family-name:var(--font-display)] font-black text-lg tracking-tight">
                    {miner.mining.hash_rate.toFixed(1)}
                    <span className="text-zinc-500 text-xs ml-1">H/s</span>
                  </div>
                </div>
                <div className="bg-zinc-950 px-6 py-4">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                    Blocks Mined
                  </div>
                  <div className="font-[family-name:var(--font-display)] font-black text-lg tracking-tight">
                    {miner.mining.blocks_mined}
                  </div>
                </div>
                <div className="bg-zinc-950 px-6 py-4">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                    Difficulty
                  </div>
                  <div className="font-[family-name:var(--font-display)] font-black text-lg tracking-tight">
                    {miner.mining.difficulty}
                  </div>
                </div>
                <div className="bg-zinc-950 px-6 py-4">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                    Mempool
                  </div>
                  <div className="font-[family-name:var(--font-display)] font-black text-lg tracking-tight">
                    {miner.mining.mempool_size}
                    <span className="text-zinc-500 text-xs ml-1">items</span>
                  </div>
                </div>
              </div>
            )}

            {/* Details Row */}
            <div className="px-6 py-4 flex flex-wrap gap-6 text-sm">
              {miner.mining?.miner_address && (
                <div>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mr-2">
                    Miner Address
                  </span>
                  <AddressLink address={miner.mining.miner_address} />
                </div>
              )}
              {miner.mining?.last_block && (
                <div>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mr-2">
                    Last Block
                  </span>
                  <span className="font-mono text-zinc-400">
                    {miner.mining.last_block}
                  </span>
                  <CopyButton text={miner.mining.last_block} />
                </div>
              )}
              <div>
                <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mr-2">
                  Peers
                </span>
                <span className="font-mono text-zinc-400">
                  {miner.peers.connected} connected
                </span>
              </div>
              {miner.headers && (
                <div>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mr-2">
                    Headers
                  </span>
                  <span className="font-mono text-zinc-400">
                    {miner.headers.highest_height.toLocaleString()} / {miner.headers.chain_tip.toLocaleString()}
                  </span>
                  {miner.headers.is_syncing && (
                    <Badge variant="amber">Syncing</Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
