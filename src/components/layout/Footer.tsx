import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
          <Link href="https://path402.com" target="_blank" className="hover:text-zinc-400 transition-colors">
            PATH402.com
          </Link>
          <span className="text-zinc-800">|</span>
          <Link href="https://whatsonchain.com" target="_blank" className="hover:text-zinc-400 transition-colors">
            WhatsOnChain
          </Link>
          <span className="text-zinc-800">|</span>
          <Link href="https://gorillapool.io" target="_blank" className="hover:text-zinc-400 transition-colors">
            GorillaPool
          </Link>
        </div>
        <div className="text-[10px] text-zinc-700">
          402network.online
        </div>
      </div>
    </footer>
  );
}
