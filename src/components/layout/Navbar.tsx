"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { SearchBar } from "@/components/ui/SearchBar";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-display)] font-black text-lg tracking-tight">
              402
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 hidden sm:block">
              Network Explorer
            </span>
          </Link>
          <SearchBar className="hidden md:block w-80" />
        </div>
        <div className="flex border-t border-zinc-800">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] border-r border-zinc-800 transition-colors ${
                  isActive
                    ? "text-white bg-zinc-900"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="md:hidden px-4 py-2 border-t border-zinc-800">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
