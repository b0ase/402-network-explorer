import { NetworkOverviewStats } from "@/components/dashboard/NetworkOverviewStats";
import { ProtocolBanner } from "@/components/dashboard/ProtocolBanner";
import { SupplyChart } from "@/components/dashboard/SupplyChart";
import { MinerStatus } from "@/components/dashboard/MinerStatus";
import { ContentTokensSummary } from "@/components/dashboard/ContentTokensSummary";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-black text-3xl md:text-5xl tracking-tight mb-2">
          PATH402 NETWORK
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          $401 Identity — $402 Content &amp; Payment — $403 Access Control
        </p>
      </div>

      <NetworkOverviewStats />

      <ProtocolBanner />

      <MinerStatus />

      <div className="border border-zinc-800 bg-zinc-950">
        <SupplyChart />
      </div>

      <ContentTokensSummary />

      <div>
        <SectionLabel>Recent Activity</SectionLabel>
        <div className="border border-zinc-800 bg-zinc-950">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
