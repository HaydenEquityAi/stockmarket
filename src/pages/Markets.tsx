import { useEffect, useState } from 'react';
import { sectorData, globalMarkets, marketBreadth } from '../lib/mock-data';
import { TrendingUp, TrendingDown, Globe, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndexCard } from '../components/IndexCard';

type MarketTab = 'indices' | 'sectors' | 'global' | 'commodities';

export function Markets() {
  const [activeTab, setActiveTab] = useState<MarketTab>('indices');
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://backend.brokerai.ai:8088/api';

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const symbols = ['SPY', 'DIA', 'QQQ'];
      const response = await fetch(`${API_URL}/market/quotes?symbols=${symbols.join(',')}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setIndices(data.quotes || []);
    } catch (e) {
      console.error('Failed to fetch market data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const i = setInterval(fetchMarketData, 60000);
    return () => clearInterval(i);
  }, []);

  const commodities = [
    { name: 'Gold', price: 2034.50, change: 12.30, changePercent: 0.61 },
    { name: 'Silver', price: 24.15, change: -0.23, changePercent: -0.94 },
    { name: 'Crude Oil', price: 78.45, change: 2.15, changePercent: 2.82 },
    { name: 'Natural Gas', price: 3.12, change: -0.08, changePercent: -2.50 },
    { name: 'Copper', price: 3.87, change: 0.05, changePercent: 1.31 }
  ];

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43245.67, change: 1245.32, changePercent: 2.97 },
    { symbol: 'ETH', name: 'Ethereum', price: 2289.45, change: -45.23, changePercent: -1.94 },
    { symbol: 'SOL', name: 'Solana', price: 98.34, change: 5.67, changePercent: 6.12 },
    { symbol: 'ADA', name: 'Cardano', price: 0.52, change: 0.02, changePercent: 4.00 }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-50 mb-2">Markets</h1>
          <p className="text-slate-400">Global market overview and analysis</p>
        </div>
      </div>

      {/* Market Breadth */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-slate-50 mb-4">Market Breadth</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span>Advancing</span>
            </div>
            <div className="font-mono text-slate-50">{marketBreadth.advancing.toLocaleString()}</div>
            <div className="text-slate-400">stocks</div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <TrendingDown className="w-5 h-5" />
              <span>Declining</span>
            </div>
            <div className="font-mono text-slate-50">{marketBreadth.declining.toLocaleString()}</div>
            <div className="text-slate-400">stocks</div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Zap className="w-5 h-5" />
              <span>Unchanged</span>
            </div>
            <div className="font-mono text-slate-50">{marketBreadth.unchanged.toLocaleString()}</div>
            <div className="text-slate-400">stocks</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('indices')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'indices'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Indices
        </button>
        <button
          onClick={() => setActiveTab('sectors')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'sectors'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Sectors
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'global'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setActiveTab('commodities')}
          className={`px-6 py-3 rounded-lg transition-all ${
            activeTab === 'commodities'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Commodities & Crypto
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'indices' && (
        <div>
          <h2 className="text-slate-50 mb-4">Major Indices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {loading && indices.length === 0 ? (
              <div className="text-slate-400">Loading indices...</div>
            ) : (
              indices.map((q) => (
                <div key={q.symbol} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-slate-50">{q.symbol}</div>
                    <div className={`${q.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{q.changePercent?.toFixed(2)}%</div>
                  </div>
                  <div className="text-slate-50 font-mono text-xl">${q.price?.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          <h2 className="text-slate-50 mb-4">Other Indices</h2>
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900 text-slate-400 border-b border-slate-700">
              <div>Index</div>
              <div>Value</div>
              <div>Change</div>
              <div>Change %</div>
            </div>
            {[
              { name: 'Russell 2000', value: 1845.32, change: 15.67, changePercent: 0.86 },
              { name: 'VIX', value: 14.23, change: -1.45, changePercent: -9.25 },
              { name: 'FTSE 100', value: 7628.45, change: -23.12, changePercent: -0.30 }
            ].map((index) => {
              const isPositive = index.change >= 0;
              return (
                <div key={index.name} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors">
                  <div className="text-slate-50">{index.name}</div>
                  <div className="text-slate-50 font-mono">{index.value.toLocaleString()}</div>
                  <div className={`font-mono ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{index.change.toFixed(2)}
                  </div>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-mono">{isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'sectors' && (
        <div>
          <h2 className="text-slate-50 mb-4">Sector Performance</h2>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="change" radius={[8, 8, 0, 0]}>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorData.map((sector) => {
              const isPositive = sector.change >= 0;
              return (
                <div key={sector.name} className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-all cursor-pointer">
                  <div className="text-slate-50 mb-2">{sector.name}</div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-slate-300">{sector.value}%</div>
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-mono">{isPositive ? '+' : ''}{sector.change}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'global' && (
        <div>
          <h2 className="text-slate-50 mb-4">Global Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {globalMarkets.map((market) => {
              const isPositive = market.change >= 0;
              return (
                <div key={market.name} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-slate-50 mb-1">{market.name}</div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className={`uppercase ${market.status === 'closed' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {market.status}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded ${isPositive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {isPositive ? '+' : ''}{market.change}%
                    </div>
                  </div>
                  <div className="font-mono text-slate-50">{market.value.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'commodities' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-slate-50 mb-4">Commodities</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900 text-slate-400 border-b border-slate-700">
                <div>Commodity</div>
                <div>Price</div>
                <div>Change</div>
                <div>Change %</div>
              </div>
              {commodities.map((commodity) => {
                const isPositive = commodity.change >= 0;
                return (
                  <div key={commodity.name} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="text-slate-50">{commodity.name}</div>
                    <div className="text-slate-50 font-mono">${commodity.price.toFixed(2)}</div>
                    <div className={`font-mono ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{commodity.change.toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-mono">{isPositive ? '+' : ''}{commodity.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-slate-50 mb-4">Cryptocurrency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cryptos.map((crypto) => {
                const isPositive = crypto.change >= 0;
                return (
                  <div key={crypto.symbol} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-slate-50 mb-1">{crypto.symbol}</div>
                        <div className="text-slate-400">{crypto.name}</div>
                      </div>
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-mono">{isPositive ? '+' : ''}{crypto.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="font-mono text-slate-50 mb-2">${crypto.price.toLocaleString()}</div>
                    <div className={`font-mono ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}${crypto.change.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
