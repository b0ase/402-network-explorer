"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount } from "@/lib/format";

interface TokenData {
  id?: string;
  address?: string;
  tick?: string;
  sym?: string;
  name?: string;
  supply?: string | number;
  price?: number;
  holders?: number;
  dec?: number;
  max?: string | number;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<TokenData[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tokens");
        const data = await res.json();
        setTokens(Array.isArray(data) ? data : data.tokens ?? data.results ?? []);
      } catch {
        setTokens([]);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          TOKEN REGISTRY
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          All tokens on the 402 network
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        {!tokens ? (
          <TableSkeleton rows={8} />
        ) : tokens.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No tokens found</div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {tokens.map((token, i) => {
              const ticker = token.tick || token.sym || token.name || "Unknown";
              const href = `/tokens/${token.address || token.id || ticker}`;
              const supply = typeof token.supply === "string"
                ? parseFloat(token.supply)
                : token.supply ?? 0;

              return (
                <Link
                  key={token.id || token.address || i}
                  href={href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-display)] font-bold text-sm">
                      ${ticker}
                    </span>
                    {token.name && token.name !== ticker && (
                      <span className="text-zinc-500 text-xs">{token.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-400 hidden md:block">
                      Supply: {formatTokenAmount(supply)}
                    </span>
                    {token.holders !== undefined && (
                      <Badge variant="zinc">{token.holders} holders</Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
