"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { detectSearchType } from "@/lib/format";

export function SearchBar({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const type = detectSearchType(trimmed);
    switch (type) {
      case "tx":
        router.push(`/tx/${trimmed}`);
        break;
      case "address":
        router.push(`/address/${trimmed}`);
        break;
      case "token":
        router.push(`/tokens/${trimmed.replace("$", "")}`);
        break;
      default:
        router.push(`/tx/${trimmed}`);
    }
    setQuery("");
  }, [query, router]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search txid / address / $token"
        className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2 text-sm text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:border-zinc-600 transition-colors"
      />
      <button
        onClick={handleSearch}
        className="absolute right-0 top-0 h-full px-4 text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest"
      >
        Go
      </button>
    </div>
  );
}
