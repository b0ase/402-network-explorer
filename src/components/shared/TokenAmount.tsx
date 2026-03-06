import { formatTokenAmount } from "@/lib/format";

export function TokenAmount({
  amount,
  decimals = 8,
  ticker = "$402",
}: {
  amount: number;
  decimals?: number;
  ticker?: string;
}) {
  return (
    <span className="font-mono text-sm">
      <span className="text-white">{formatTokenAmount(amount, decimals)}</span>
      <span className="text-zinc-500 ml-1">{ticker}</span>
    </span>
  );
}
