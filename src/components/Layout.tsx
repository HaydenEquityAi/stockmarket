import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Briefcase, LogOut, User } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Stocks', href: '/stocks', icon: TrendingUp },
    { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  ];
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">MarketPulse</h1>
              <p className="text-xs text-gray-400">by BrokerAI</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-900 hover:text-white'}`}>
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors">
            <LogOut size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-black text-white border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input type="search" placeholder="Search stocks, indices, or news..." className="w-96 px-4 py-2 bg-gray-900 text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500" />
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus />
              <div className="text-right">
                <div className="text-sm text-gray-400">Market Status</div>
                <div className="text-sm font-medium text-orange-400">Pre-Market</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}


