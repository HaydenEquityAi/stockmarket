import { LayoutDashboard, TrendingUp, Briefcase, Lightbulb, Users, Globe, LineChart } from 'lucide-react';

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
  return (
    <div className="w-64 bg-f8fafc border-r border-e2e8f0 h-screen flex flex-col">
      <div className="p-6 border-b border-e2e8f0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2563eb] to-blue-400 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-black">MarketPulse</div>
            <div className="text-[#1e293b]">by BrokerAI</div>
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
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2563eb] text-white'
                    : 'text-[#1e293b] hover:text-black hover:bg-[#f1f5f9]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-e2e8f0">
        <div className="px-4 py-3 bg-[#f1f5f9] rounded-lg">
          <div className="text-[#1e293b] mb-1">Account</div>
          <div className="text-black">Premium Trader</div>
        </div>
      </div>
    </div>
  );
}
