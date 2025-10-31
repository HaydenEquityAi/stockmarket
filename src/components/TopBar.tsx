import { Search, Bell, Settings, User } from 'lucide-react';
import { LiveBadge } from './LiveBadge';

export function TopBar() {
  return (
    <div className="h-16 bg-white border-b border-e2e8f0 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1e293b]" />
          <input
            type="text"
            placeholder="Search stocks, indices, or news..."
            className="w-96 bg-[#f8fafc] border border-e2e8f0 rounded-lg pl-10 pr-4 py-2 text-black placeholder-[#1e293b]/60 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <LiveBadge />
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-[#1e293b]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#dc2626] rounded-full" />
          </button>
          
          <button className="p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-[#1e293b]" />
          </button>
          
          <div className="h-6 w-px bg-[#e2e8f0]" />
          
          <button className="flex items-center gap-2 hover:bg-[#f1f5f9] rounded-lg px-3 py-2 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563eb] to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1e293b]">Trader</span>
          </button>
        </div>
      </div>
    </div>
  );
}
