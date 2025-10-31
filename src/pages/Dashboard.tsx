import { MarketStatusBanner } from '../components/MarketStatusBanner';
import { NewsCard } from '../components/NewsCard';
import { LiveIndexCard } from '../components/LiveIndexCard';
import { LiveStockCard } from '../components/LiveStockCard';
import { newsItems, portfolioHoldings } from '../lib/mock-data';
import React, { useEffect, useState } from 'react';
import { ArrowUp, TrendingUp, DollarSign, Target } from 'lucide-react';


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
    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-black mb-1">Dashboard</h1>
          <p className="text-sm lg:text-base text-[#1e293b]">Welcome back, here's what's happening in the markets</p>
        </div>
      </div>

      <MarketStatusBanner />

      {/* Market Indices */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Market Indices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <LiveIndexCard symbol="SPY" name="S&P 500" />
          <LiveIndexCard symbol="DIA" name="Dow Jones" />
          <LiveIndexCard symbol="QQQ" name="Nasdaq" />
        </div>
      </div>

      {/* Portfolio Summary & Smart Money Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div
          className="lg:col-span-2 bg-white rounded-xl p-6 border border-e2e8f0 shadow-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-black">Portfolio Summary</h3>
            <div className="text-[#1e293b]">Last updated: Just now</div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#1e293b] mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Total Value</span>
              </div>
              <div className="font-mono text-black">${totalValue.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-[#1e293b] mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Today's Gain</span>
              </div>
              <div className="font-mono text-[#16a34a]">+$2,456.78</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-[#1e293b] mb-2">
                <Target className="w-4 h-4" />
                <span>All-Time Gain</span>
              </div>
              <div className="font-mono text-[#16a34a]">
                +${totalGain.toLocaleString()} ({totalGainPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-gradient-to-br from-[#2563eb] to-blue-700 rounded-xl p-6 border border-[#2563eb] shadow-lg shadow-[#2563eb]/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-white uppercase tracking-wide">Smart Money Alert</span>
          </div>
          <p className="text-blue-100 mb-4">
            Nancy Pelosi bought $5.0M in NVDA. Stock up 12.4% since trade.
          </p>
          <button className="w-full bg-white text-[#2563eb] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Trending Stocks & News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Trending Stocks</h2>
            <button className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors">View All</button>
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
            <h2 className="text-black">Market News</h2>
            <button className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors" onClick={fetchNews} disabled={newsLoading}>
              {newsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="space-y-3">
            {(news.length ? news : []).slice(0, 3).map((article: any) => (
              <NewsCard key={article.id} article={article} />
            ))}
            {!newsLoading && news.length === 0 && (
              <div className="text-sm text-gray-500">No news available</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Gainers */}
      <div>
        <h2 className="text-black mb-4">Top Gainers Today</h2>
        <div className="bg-white rounded-xl border border-e2e8f0 overflow-hidden shadow-sm">
          <div className="grid grid-cols-5 gap-4 p-4 bg-[#f8fafc] text-[#1e293b] border-b border-e2e8f0">
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
            <div key={s.symbol} className="grid grid-cols-5 gap-4 p-4 border-b border-e2e8f0 last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer">
              <div className="text-black font-mono">{s.symbol}</div>
              <div className="text-[#1e293b]">{s.name}</div>
              <div className="text-black font-mono">
                {/* Inline live price */}
                {/* Using LivePriceDisplay would be ideal; keeping inline simplicity */}
                <span id={`price-${s.symbol}`}>
                  {/* Optionally integrate LivePriceDisplay here */}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#16a34a]">
                <ArrowUp className="w-4 h-4" />
                <span className="font-mono">live</span>
              </div>
              <div className="text-[#1e293b]">—</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
