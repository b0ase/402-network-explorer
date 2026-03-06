"use client";

import { useState } from "react";

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

function formatSupply(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function TreeNodeRow({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const sharePercent = node.parent_share_bps ? (node.parent_share_bps / 100).toFixed(0) : null;
  const sold = node.total_supply > 0
    ? (((node.total_supply - node.treasury_balance) / node.total_supply) * 100).toFixed(1)
    : "0";

  return (
    <div>
      <div
        className="group flex items-center gap-2 py-2 px-3 hover:bg-zinc-900/50 transition-colors cursor-pointer border-b border-zinc-900/50"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand toggle */}
        <span className="w-4 text-zinc-600 text-xs font-mono flex-shrink-0">
          {hasChildren ? (expanded ? "v" : ">") : " "}
        </span>

        {/* Revenue edge indicator */}
        {sharePercent && (
          <span className="text-[9px] uppercase tracking-[0.15em] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 flex-shrink-0">
            {sharePercent}%
          </span>
        )}

        {/* Token address */}
        <span className="font-mono text-sm text-green-400 font-bold flex-shrink-0">
          {node.address}
        </span>

        {/* Name */}
        <span className="text-zinc-500 text-xs truncate">
          {node.name}
        </span>

        {/* Spacer */}
        <span className="flex-1" />

        {/* Issuer */}
        <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 flex-shrink-0">
          {node.issuer_handle}
        </span>

        {/* Supply */}
        <span className="text-xs font-mono text-zinc-400 w-16 text-right flex-shrink-0">
          {formatSupply(node.total_supply)}
        </span>

        {/* Sold % */}
        <span className="text-xs font-mono text-zinc-500 w-14 text-right flex-shrink-0">
          {sold}%
        </span>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute top-0 bottom-0 border-l border-zinc-800"
            style={{ left: `${depth * 24 + 22}px` }}
          />
          {node.children.map((child) => (
            <TreeNodeRow key={child.address} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TokenTree({ tree }: { tree: TreeNode[] }) {
  if (!tree.length) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-500 text-sm">
        No tokens registered yet.
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/50 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
        <span className="w-4" />
        <span className="flex-1">Token</span>
        <span className="w-16 text-right">Supply</span>
        <span className="w-14 text-right">Sold</span>
      </div>

      {/* Tree */}
      {tree.map((root) => (
        <TreeNodeRow key={root.address} node={root} />
      ))}
    </div>
  );
}
