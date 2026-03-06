export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block w-6 h-6 border-2 border-zinc-700 border-t-green-500 animate-spin mb-4" />
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Loading
        </div>
      </div>
    </div>
  );
}
