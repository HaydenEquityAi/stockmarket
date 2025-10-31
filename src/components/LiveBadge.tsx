export function LiveBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <div className="absolute w-2 h-2 bg-[#16a34a] rounded-full" />
        <div className="w-2 h-2 bg-[#16a34a] rounded-full relative z-10" />
      </div>
      <span className="text-[#16a34a] uppercase tracking-wide">Live</span>
    </div>
  );
}
