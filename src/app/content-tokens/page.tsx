"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatTokenAmount } from "@/lib/format";
import { formatPricingModel } from "@/lib/format";

interface TokenData {
  id: string;
  ticker?: string;
  tick?: string;
  sym?: string;
  name?: string;
  supply?: number;
  amt?: number;
  maxSupply?: number;
  holders?: number;
  accounts?: number;
  pricingModel?: string;
  protocol?: string;
  issuer?: string;
}

const pricingVariant: Record<string, "green" | "blue" | "purple" | "amber" | "zinc"> = {
  fixed: "green",
  bonding_curve: "blue",
  alice_bond: "purple",
  free: "amber",
};

export default function ContentTokensPage() {
  const [tokens, setTokens] = useState<TokenData[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content-tokens");
        const data = await res.json();
        setTokens(Array.isArray(data) ? data : []);
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
          CONTENT TOKENS
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Proof of Stake tokens — creator-defined supply — staking for dividends
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        <SectionLabel>
          <span className="px-4 pt-4 block">
            {tokens === null
              ? "Loading..."
              : `${tokens.length} content token${tokens.length !== 1 ? "s" : ""}`}
          </span>
        </SectionLabel>

        {tokens === null ? (
          <TableSkeleton rows={5} />
        ) : tokens.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No content tokens minted yet. Content tokens are creator-defined PoS tokens with staking and dividends.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {tokens.map((t, i) => {
              const ticker = t.ticker || t.tick || t.sym || "???";
              const supply = t.supply ?? t.amt ?? 0;
              const holders = t.holders ?? t.accounts ?? 0;

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/content-tokens/${t.id}`}
                    className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-mono text-sm font-bold text-white">
                          {ticker}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {t.name || "Unnamed"}
                        </div>
                      </div>
                      {t.pricingModel && (
                        <Badge variant={pricingVariant[t.pricingModel] || "zinc"}>
                          {formatPricingModel(t.pricingModel)}
                        </Badge>
                      )}
                      {t.protocol && (
                        <Badge variant="zinc">{t.protocol}</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-zinc-300">
                        {formatTokenAmount(supply, 0)}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {holders} holder{holders !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
