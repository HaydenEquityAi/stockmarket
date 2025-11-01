import { Search, Bell, Settings, User, LogOut } from 'lucide-react';
import { LiveBadge } from './LiveBadge';
import { useAuth } from '../contexts/AuthContext';

export function TopBar() {
  const { user, logout } = useAuth();
  return (
    <div className="h-14 lg:h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 lg:gap-6 w-full">
        <div className="relative hidden sm:block flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stocks, indices, or news..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 ml-auto">
        {/* Mobile search icon */}
        <button className="sm:hidden p-2 hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-white transition-colors"><Search size={20} /></button>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-400">LIVE</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors relative text-slate-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
          </button>
          <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-700/50" />
          <button className="hidden lg:flex items-center gap-2 hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">{user?.name || 'Trader'}</span>
          </button>
        </div>
        {/* Mobile user icon */}
        <button className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-white transition-colors"><User size={20} /></button>
        {/* Logout */}
        <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
