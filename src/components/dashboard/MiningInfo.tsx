import { TOKEN } from "@/lib/constants";

export function MiningInfo() {
  const info = [
    { label: "Protocol", value: TOKEN.protocol },
    { label: "Algorithm", value: TOKEN.algorithm },
    { label: "Max Supply", value: "21,000,000" },
    { label: "Mint Limit", value: `${TOKEN.mintLimit} per tx` },
    { label: "Difficulty", value: TOKEN.difficulty },
    { label: "Mining Method", value: "Proof of Indexing" },
  ];

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-6">
      <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
        Mining Information
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {info.map((item) => (
          <div key={item.label}>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 mb-1">
              {item.label}
            </div>
            <div className="text-sm font-mono text-zinc-300">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
