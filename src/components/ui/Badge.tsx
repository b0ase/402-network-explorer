const variants = {
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  blue: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  zinc: "bg-zinc-800 text-zinc-400 border-zinc-700",
} as const;

export function Badge({
  children,
  variant = "zinc",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
