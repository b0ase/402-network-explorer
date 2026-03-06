"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatTokenAmount } from "@/lib/format";

interface ContentTokenSummary {
  id: string;
  ticker?: string;
  tick?: string;
  sym?: string;
  name?: string;
  supply?: number;
  holders?: number;
  amt?: number;
  pricingModel?: string;
}

const pricingVariant: Record<string, "green" | "blue" | "purple" | "amber" | "zinc"> = {
  fixed: "green",
  bonding_curve: "blue",
  alice_bond: "purple",
  free: "amber",
};

export function ContentTokensSummary() {
  const [tokens, setTokens] = useState<ContentTokenSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content-tokens");
        if (res.ok) {
          const data = await res.json();
          setTokens(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionLabel>Content Tokens</SectionLabel>
        <Link
          href="/content-tokens"
          className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="border border-zinc-800 bg-zinc-950">
        {tokens.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No content tokens minted yet
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {tokens.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/content-tokens/${t.id}`}
                  className="flex items-center justify-between p-3 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      {t.ticker || t.tick || t.sym || "???"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {t.name || "Unnamed"}
                    </span>
                    {t.pricingModel && (
                      <Badge variant={pricingVariant[t.pricingModel] || "zinc"}>
                        {t.pricingModel}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-zinc-300">
                      {formatTokenAmount(t.supply ?? t.amt ?? 0, 0)}
                    </div>
                    {t.holders !== undefined && (
                      <div className="text-[10px] text-zinc-500">
                        {t.holders} holders
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
