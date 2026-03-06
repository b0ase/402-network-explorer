import Link from "next/link";
import { truncateTxid } from "@/lib/format";
import { CopyButton } from "@/components/ui/CopyButton";

export function TxLink({
  txid,
  chars = 8,
}: {
  txid: string;
  chars?: number;
}) {
  if (!txid) return <span className="text-zinc-600">—</span>;

  return (
    <span className="inline-flex items-center gap-0.5">
      <Link
        href={`/tx/${txid}`}
        className="text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
      >
        {truncateTxid(txid, chars)}
      </Link>
      <CopyButton text={txid} />
    </span>
  );
}
