"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CopyButton } from "@/components/ui/CopyButton";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount } from "@/lib/format";

interface TokenDetail {
  id?: string;
  tick?: string;
  sym?: string;
  name?: string;
  supply?: string | number;
  max?: string | number;
  dec?: number;
  price?: number;
  holders?: number;
  accounts?: number;
  description?: string;
}

export default function TokenDetailPage() {
  const { address } = useParams<{ address: string }>();
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tokens`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.tokens ?? data.results ?? [];
        const found = list.find(
          (t: TokenDetail) =>
            t.id === address ||
            t.tick === address ||
            t.sym === address ||
            t.name === address
        );
        if (found) {
          setToken(found);
        } else {
          setError(true);
        }
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
          TOKEN
        </h1>
        <div className="border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-500">
          Token not found
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const ticker = token.tick || token.sym || token.name || address;
  const supply = typeof token.supply === "string" ? parseFloat(token.supply) : token.supply ?? 0;
  const max = typeof token.max === "string" ? parseFloat(token.max) : token.max ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-2xl md:text-3xl tracking-tight mb-1">
          ${ticker}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-zinc-400 break-all">{address}</span>
          <CopyButton text={address} />
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-950 p-6">
        <SectionLabel>Token Info</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Ticker
            </div>
            <div className="text-sm font-mono">${ticker}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Circulating Supply
            </div>
            <div className="text-sm font-mono">{formatTokenAmount(supply)}</div>
          </div>
          {max > 0 && (
            <div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                Max Supply
              </div>
              <div className="text-sm font-mono">{formatTokenAmount(max)}</div>
            </div>
          )}
          <div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              Decimals
            </div>
            <div className="text-sm font-mono">{token.dec ?? 8}</div>
          </div>
          {token.holders !== undefined && (
            <div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                Holders
              </div>
              <div className="text-sm font-mono">
                <Badge variant="green">{token.holders ?? token.accounts}</Badge>
              </div>
            </div>
          )}
          {token.price !== undefined && (
            <div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
                Price
              </div>
              <div className="text-sm font-mono">{token.price} sats</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
