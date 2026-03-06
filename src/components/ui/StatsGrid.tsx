"use client";

import { motion } from "framer-motion";
import type { StatItem } from "@/lib/types";

function StatusDot({ status }: { status?: "green" | "amber" | "blue" }) {
  if (!status) return null;
  const colors = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    blue: "bg-blue-400",
  };
  return (
    <span
      className={`inline-block w-1.5 h-1.5 ${colors[status]} animate-pulse-glow`}
    />
  );
}

export function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-zinc-950 p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              {item.label}
            </span>
            <StatusDot status={item.status} />
          </div>
          <div className="font-[family-name:var(--font-display)] font-black text-xl md:text-2xl tracking-tighter">
            {item.value}
          </div>
          {item.change && (
            <span className="text-xs text-zinc-500 mt-1">{item.change}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
