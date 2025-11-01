import { MarketStatusBanner } from '../components/MarketStatusBanner';
import { NewsCard } from '../components/NewsCard';
import { LiveIndexCard } from '../components/LiveIndexCard';
import { LiveStockCard } from '../components/LiveStockCard';
import { newsItems, portfolioHoldings } from '../lib/mock-data';
import React, { useEffect, useState } from 'react';
import { ArrowUp, TrendingUp, DollarSign, Target, Zap } from 'lucide-react';


export function Dashboard() {
  const API_URL = 'https://backend.brokerai.ai:8088/api';
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      const response = await fetch(`${API_URL}/news`);
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalGain = portfolioHoldings.reduce((sum, holding) => sum + holding.gain, 0);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

  return (
    <div className="p-4 lg:p-8 space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-3xl font-black text-white mb-1">Dashboard</h1>
          <p className="text-sm lg:text-base text-slate-400">Welcome back, here's what's happening in the markets</p>
        </div>
      </div>

      <MarketStatusBanner />

      {/* Portfolio Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">Portfolio Value</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mb-1">${totalValue.toLocaleString()}</div>
          <div className="text-emerald-400 text-sm font-semibold">+12.4% ($4,982)</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">24h Change</span>
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mb-1">+12.4%</div>
          <div className="text-cyan-400 text-sm font-semibold">↑ $5.1K</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">Positions</span>
            <Target className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white mb-1">8</div>
          <div className="text-purple-400 text-sm font-semibold">All profitable</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">All-Time Gain</span>
            <Zap className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mb-1">
            +${totalGain.toLocaleString()}
          </div>
          <div className="text-emerald-400 text-sm font-semibold">
            {totalGainPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div>
        <h2 className="text-xl font-black text-white mb-4">Market Indices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <LiveIndexCard symbol="SPY" name="S&P 500" />
          <LiveIndexCard symbol="DIA" name="Dow Jones" />
          <LiveIndexCard symbol="QQQ" name="Nasdaq" />
        </div>
      </div>

      {/* Portfolio Summary & Smart Money Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">Portfolio Summary</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-emerald-400 font-semibold">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Total Value</span>
              </div>
              <div className="font-mono text-white text-xl font-black">${totalValue.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Today's Gain</span>
              </div>
              <div className="font-mono text-emerald-400 text-xl font-black">+$2,456.78</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2 text-sm">
                <Target className="w-4 h-4" />
                <span>All-Time Gain</span>
              </div>
              <div className="font-mono text-emerald-400 text-xl font-black">
                +${totalGain.toLocaleString()} ({totalGainPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-emerald-400 uppercase tracking-wide font-bold text-sm">Smart Money Alert</span>
          </div>
          <p className="text-slate-300 mb-4 text-sm">
            Nancy Pelosi bought $5.0M in NVDA. Stock up 12.4% since trade.
          </p>
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg transition-all font-semibold">
            View Details
          </button>
        </div>
      </div>

      {/* Trending Stocks & News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white">Trending Stocks</h2>
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-semibold">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiveStockCard symbol="NVDA" name="NVIDIA Corporation" />
            <LiveStockCard symbol="AAPL" name="Apple Inc." />
            <LiveStockCard symbol="MSFT" name="Microsoft Corporation" />
            <LiveStockCard symbol="TSLA" name="Tesla, Inc." />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Market News</h2>
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-semibold" onClick={fetchNews} disabled={newsLoading}>
              {newsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="space-y-3">
            {(news.length ? news : []).slice(0, 3).map((article: any) => (
              <NewsCard key={article.id} article={article} />
            ))}
            {!newsLoading && news.length === 0 && (
              <div className="text-sm text-slate-400">No news available</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Gainers */}
      <div>
        <h2 className="text-white font-black mb-4">Top Gainers Today</h2>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-slate-800/50 text-slate-400 border-b border-slate-700/50 font-semibold text-sm">
            <div>Symbol</div>
            <div>Name</div>
            <div>Price</div>
            <div>Change</div>
            <div>Volume</div>
          </div>
          {[
            { symbol: 'NVDA', name: 'NVIDIA Corporation' },
            { symbol: 'AAPL', name: 'Apple Inc.' },
            { symbol: 'MSFT', name: 'Microsoft Corporation' },
            { symbol: 'TSLA', name: 'Tesla, Inc.' }
          ].map((s) => (
            <div key={s.symbol} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/30 last:border-0 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="text-white font-bold font-mono">{s.symbol}</div>
              <div className="text-slate-300">{s.name}</div>
              <div className="text-white font-mono">
                <span id={`price-${s.symbol}`}>
                  {/* Live price integration */}
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <ArrowUp className="w-4 h-4" />
                <span className="font-mono">Live</span>
              </div>
              <div className="text-slate-400">—</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
