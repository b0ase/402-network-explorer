export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
      {children}
    </h2>
  );
}
