import { useState } from 'react';
import { newsItems } from '../lib/mock-data';
import { NewsCard } from '../components/NewsCard';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function Intelligence() {
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [selectedSector, setSelectedSector] = useState('all');

  const sentimentData = [
    { name: 'Bullish', value: 45, color: '#16a34a' },
    { name: 'Neutral', value: 35, color: '#1e293b' },
    { name: 'Bearish', value: 20, color: '#dc2626' }
  ];

  const filteredNews = newsItems.filter(news => {
    if (selectedSentiment !== 'all' && news.sentiment !== selectedSentiment) return false;
    return true;
  });

  return (
    <div className="p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black mb-2">Intelligence</h1>
          <p className="text-[#1e293b]">AI-powered market insights and sentiment analysis</p>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
          <h3 className="text-black mb-4">Market Sentiment</h3>
          
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#1e293b]">{item.name}</span>
                </div>
                <span className="text-[#1e293b]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#16a34a] to-emerald-700 rounded-xl p-6 border border-[#16a34a] shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <span className="text-emerald-100">Bullish Signals</span>
            </div>
            <div className="font-mono text-white mb-2">156</div>
            <div className="text-emerald-100">+23 from yesterday</div>
          </div>

          <div className="bg-gradient-to-br from-[#dc2626] to-red-700 rounded-xl p-6 border border-[#dc2626] shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-6 h-6 text-white" />
              <span className="text-red-100">Bearish Signals</span>
            </div>
            <div className="font-mono text-white mb-2">87</div>
            <div className="text-red-100">-12 from yesterday</div>
          </div>

          <div className="bg-gradient-to-br from-[#2563eb] to-blue-700 rounded-xl p-6 border border-[#2563eb] shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <span className="text-blue-100">AI Confidence</span>
            </div>
            <div className="font-mono text-white mb-2">87.5%</div>
            <div className="text-blue-100">High accuracy</div>
          </div>
        </div>
      </div>

      {/* Filters and News Feed */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-e2e8f0 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#1e293b]" />
              <h3 className="text-black">Filters</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[#1e293b] mb-2">Sentiment</div>
                <div className="space-y-2">
                  {['all', 'bullish', 'bearish', 'neutral'].map((sentiment) => (
                    <button
                      key={sentiment}
                      onClick={() => setSelectedSentiment(sentiment as any)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedSentiment === sentiment
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0] border border-e2e8f0'
                      }`}
                    >
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[#1e293b] mb-2">Sector</div>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full bg-white border border-e2e8f0 rounded px-3 py-2 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="all">All Sectors</option>
                  <option value="tech">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="energy">Energy</option>
                </select>
              </div>

              <div>
                <div className="text-[#1e293b] mb-2">My Stocks Only</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-white border-e2e8f0" />
                  <span className="text-[#1e293b]">Filter by watchlist</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl border border-e2e8f0 p-4 shadow-sm">
            <h3 className="text-black mb-3">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['AI', 'Fed Rate', 'Earnings', 'Tech', 'EV', 'China'].map((topic) => (
                <span key={topic} className="px-3 py-1 bg-[#f1f5f9] rounded-full text-[#1e293b] hover:bg-[#e2e8f0] cursor-pointer transition-colors border border-e2e8f0">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black">Market Intelligence Feed</h2>
            <div className="text-[#1e293b]">{filteredNews.length} articles</div>
          </div>

          <div className="space-y-4">
            {filteredNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
            
            {/* Additional mock news */}
            <NewsCard news={{
              id: '6',
              title: 'Semiconductors rally as demand outlook improves',
              source: 'Financial Times',
              time: '5 hours ago',
              sentiment: 'bullish',
              tickers: ['NVDA', 'AMD']
            }} />
            
            <NewsCard news={{
              id: '7',
              title: 'Inflation data comes in below expectations',
              source: 'Bloomberg',
              time: '6 hours ago',
              sentiment: 'bullish',
              tickers: ['SPX', 'DJI']
            }} />
            
            <NewsCard news={{
              id: '8',
              title: 'European markets face headwinds from energy crisis',
              source: 'Reuters',
              time: '7 hours ago',
              sentiment: 'bearish',
              tickers: []
            }} />
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
        <h2 className="text-black mb-4">AI-Generated Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#f8fafc] rounded-lg p-4 border border-e2e8f0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#16a34a] rounded-full" />
              <span className="text-[#1e293b]">Strong Buy Signal</span>
            </div>
            <p className="text-[#1e293b] mb-2">
              NVDA showing strong momentum with institutional accumulation. AI models predict continued upside.
            </p>
            <div className="text-[#1e293b]/60">Confidence: 85%</div>
          </div>

          <div className="bg-[#f8fafc] rounded-lg p-4 border border-e2e8f0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-[#1e293b]">Watch Alert</span>
            </div>
            <p className="text-[#1e293b] mb-2">
              Tech sector rotation detected. Consider rebalancing portfolio allocation.
            </p>
            <div className="text-[#1e293b]/60">Confidence: 72%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
