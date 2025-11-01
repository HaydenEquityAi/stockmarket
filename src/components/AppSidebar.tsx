import { LayoutDashboard, TrendingUp, Briefcase, Lightbulb, Users, Globe, LineChart, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'stocks', icon: TrendingUp, label: 'Stocks' },
  { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
  { id: 'intelligence', icon: Lightbulb, label: 'Intelligence' },
  { id: 'smart-money', icon: Users, label: 'Smart Money' },
  { id: 'markets', icon: Globe, label: 'Markets' },
  { id: 'analysis', icon: LineChart, label: 'Analysis' }
];

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-lg text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 h-screen flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white font-black">MarketPulse</div>
            <div className="text-slate-400 text-sm">by BrokerAI</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-white border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-slate-400 mb-1 text-sm">Account</div>
          <div className="text-white font-semibold">Premium Trader</div>
        </div>
      </div>
      </div>

      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30" />
      )}
    </>
  );
}
