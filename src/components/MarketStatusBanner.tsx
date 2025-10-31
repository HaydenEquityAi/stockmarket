import { LiveBadge } from './LiveBadge';

export function MarketStatusBanner() {
  const now = new Date();
  const hours = now.getHours();
  const isMarketOpen = hours >= 9 && hours < 16;

  return (
    <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-xl p-4 border border-e2e8f0 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <LiveBadge />
        <div className="h-6 w-px bg-[#e2e8f0]" />
        <div>
          <span className="text-[#1e293b]">Market Status: </span>
          <span className={isMarketOpen ? 'text-[#16a34a]' : 'text-orange-500'}>
            {isMarketOpen ? 'Open' : 'Pre-Market'}
          </span>
        </div>
      </div>
      <div className="text-[#1e293b]">
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}
