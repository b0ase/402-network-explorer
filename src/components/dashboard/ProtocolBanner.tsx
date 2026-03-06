"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

const protocols = [
  {
    code: "401",
    name: "Identity",
    description: "On-chain passport — OAuth identity strands",
    status: "live" as const,
    href: "https://path401.com",
  },
  {
    code: "402",
    name: "Content / Payment",
    description: "PoW20 token — Proof of Indexing mining",
    status: "live" as const,
    href: "https://path402.com",
  },
  {
    code: "403",
    name: "Access Control",
    description: "Securities tokens — requires $401 KYC",
    status: "planned" as const,
    href: "https://path403.com",
  },
];

const statusVariant = {
  live: "green" as const,
  planned: "zinc" as const,
};

export function ProtocolBanner() {
  return (
    <div className="border border-zinc-800 bg-zinc-950">
      <div className="px-4 py-3 border-b border-zinc-800">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Protocol Stack
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
        {protocols.map((p, i) => (
          <motion.a
            key={p.code}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 hover:bg-zinc-900/50 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                ${p.code}
              </span>
              <Badge variant={statusVariant[p.status]}>
                {p.status}
              </Badge>
            </div>
            <div className="text-sm text-zinc-300 mb-1">{p.name}</div>
            <div className="text-[11px] text-zinc-500">{p.description}</div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
