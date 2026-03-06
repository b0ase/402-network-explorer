"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { Badge } from "@/components/ui/Badge";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import type { StatItem } from "@/lib/types";

interface MinerData {
  node_id: string;
  name: string;
  is_online: boolean;
  trading_mode: string;
  last_heartbeat: number;
  mining: {
    is_mining: boolean;
    hash_rate: number;
    blocks_mined: number;
  };
}

interface MinersResponse {
  miners: MinerData[];
  aggregate: {
    total_miners: number;
    active_miners: number;
    total_events: number;
    total_blocks_mined: number;
    total_hash_rate: number;
  };
}

function formatTimeAgo(ts: number): string {
  if (!ts) return "never";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
        setData({ miners: [], aggregate: { total_miners: 0, total_blocks_mined: 0, total_hash_rate: 0, active_miners: 0, total_events: 0 } });
      }
    }
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  const agg = data?.aggregate;

  const stats: StatItem[] = agg
    ? [
        { label: "Total Nodes", value: agg.total_miners, status: agg.total_miners > 0 ? "green" : undefined },
        { label: "Online", value: agg.active_miners, status: agg.active_miners > 0 ? "green" : "amber" },
        { label: "Total Events", value: agg.total_events },
        { label: "Blocks Mined", value: agg.total_blocks_mined },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          CLAWMINER NODES
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Registered ClawMiner agents on the PATH402 network
        </p>
      </div>

      {!data ? <StatsSkeleton /> : <StatsGrid items={stats} />}

      {data && data.miners.length === 0 && (
        <div className="border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="text-zinc-500 mb-2">No ClawMiner nodes registered</div>
          <div className="text-[10px] text-zinc-600 font-mono">
            Nodes register via the ClawMiner pool API
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data?.miners.map((miner, i) => (
          <motion.div
            key={miner.node_id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-zinc-800 bg-zinc-950"
          >
            {/* Node Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 ${miner.is_online ? "bg-green-500 animate-pulse-glow" : "bg-zinc-600"}`} />
                <span className="font-[family-name:var(--font-display)] font-bold text-sm">
                  {miner.name || `NODE ${miner.node_id.slice(0, 8)}`}
                </span>
                <Badge variant={miner.is_online ? "green" : "amber"}>
                  {miner.is_online ? "Online" : "Offline"}
                </Badge>
                {miner.trading_mode && miner.trading_mode !== "paused" && (
                  <Badge variant="green">{miner.trading_mode}</Badge>
                )}
              </div>
              <div className="text-[10px] text-zinc-600 font-mono">
                last seen {formatTimeAgo(miner.last_heartbeat)}
              </div>
            </div>

            {/* Details Row */}
            <div className="px-6 py-4 flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mr-2">
                  Node ID
                </span>
                <span className="font-mono text-zinc-400">
                  {miner.node_id}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mr-2">
                  Status
                </span>
                <span className="font-mono text-zinc-400">
                  {miner.mining?.is_mining ? "Mining" : "Idle"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
