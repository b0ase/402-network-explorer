import Link from "next/link";
import { truncateAddress } from "@/lib/format";
import { CopyButton } from "@/components/ui/CopyButton";

export function AddressLink({
  address,
  chars = 6,
}: {
  address: string;
  chars?: number;
}) {
  if (!address) return <span className="text-zinc-600">—</span>;

  return (
    <span className="inline-flex items-center gap-0.5">
      <Link
        href={`/address/${address}`}
        className="text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
      >
        {truncateAddress(address, chars)}
      </Link>
      <CopyButton text={address} />
    </span>
  );
}
