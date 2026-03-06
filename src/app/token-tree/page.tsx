"use client";

import { useEffect, useState } from "react";
import { TokenTree } from "@/components/dashboard/TokenTree";

interface TreeNode {
  address: string;
  name: string;
  parent_address: string | null;
  parent_share_bps: number;
  issuer_handle: string;
  total_supply: number;
  treasury_balance: number;
  children: TreeNode[];
}

export default function TokenTreePage() {
  const [tree, setTree] = useState<TreeNode[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/token-tree");
        const data = await res.json();
        setTree(data.tree ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setTree([]);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          TOKEN TREE
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Hierarchical token ownership with revenue cascade paths
          {total > 0 && (
            <span className="ml-2 text-green-500">{total} tokens</span>
          )}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Root token
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500">50%</span>
          Revenue share to parent
        </div>
        <div className="flex items-center gap-2">
          <span className="border-l border-zinc-600 h-3" />
          Parent-child link
        </div>
      </div>

      {tree === null ? (
        <div className="border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="inline-block w-4 h-4 border-2 border-zinc-600 border-t-green-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm mt-3">Loading token tree...</p>
        </div>
      ) : (
        <TokenTree tree={tree} />
      )}

      {/* Revenue Cascade Explainer */}
      <div className="border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
          Revenue Cascade
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          When a child token earns revenue, its <span className="text-amber-500 font-bold">parent_share_bps</span> flows
          up to the parent token. This cascades recursively — if <span className="text-green-400 font-mono">$ZERODICE/game-1</span> earns
          1000 sats, 50% (500 sats) flows to <span className="text-green-400 font-mono">$ZERODICE</span>, then 50% of that
          (250 sats) flows to <span className="text-green-400 font-mono">$NPGX</span>, and 50% of that (125 sats)
          flows to <span className="text-green-400 font-mono">$AIGF</span>.
        </p>
      </div>
    </div>
  );
}
