import { NetworkStats } from "@/components/dashboard/NetworkStats";
import { SupplyChart } from "@/components/dashboard/SupplyChart";
import { MiningInfo } from "@/components/dashboard/MiningInfo";
import { MinerStatus } from "@/components/dashboard/MinerStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-3xl md:text-5xl tracking-tight mb-2">
          PATH402 NETWORK EXPLORER
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          BSV-21 PoW20 token — 21M supply — Proof of Indexing
        </p>
      </div>

      <NetworkStats />

      <MinerStatus />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800">
        <SupplyChart />
        <MiningInfo />
      </div>

      <div>
        <SectionLabel>Recent Activity</SectionLabel>
        <div className="border border-zinc-800 bg-zinc-950">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
