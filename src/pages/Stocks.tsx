import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { trendingStocks, newsItems } from '../lib/mock-data';
import { Star, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { NewsCard } from '../components/NewsCard';

export function Stocks() {
  const [selectedStock, setSelectedStock] = useState(trendingStocks[0]);
  const [watchlist] = useState([trendingStocks[0], trendingStocks[1], trendingStocks[3]]);

  const chartData = selectedStock.data.map((value, index) => ({
    time: `${9 + Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`,
    price: value
  }));

  const isPositive = selectedStock.change >= 0;

  return (
    <div className="p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black mb-2">Stocks</h1>
          <p className="text-[#1e293b]">Track and analyze stock performance</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Watchlist Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-e2e8f0 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-black">Watchlist</h3>
              <button className="p-1 hover:bg-[#f1f5f9] rounded transition-colors">
                <Plus className="w-4 h-4 text-[#1e293b]" />
              </button>
            </div>
            
            <div className="space-y-2">
              {watchlist.map((stock) => (
                <motion.div
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedStock.symbol === stock.symbol
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#f8fafc] hover:bg-[#f1f5f9] border border-e2e8f0'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono">{stock.symbol}</span>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div className="font-mono">${stock.price.toFixed(2)}</div>
                  <div className={`font-mono ${stock.change >= 0 ? (selectedStock.symbol === stock.symbol ? 'text-emerald-200' : 'text-[#16a34a]') : (selectedStock.symbol === stock.symbol ? 'text-red-200' : 'text-[#dc2626]')}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] py-2 px-4 rounded-lg transition-colors border border-e2e8f0">
              Manage Watchlist
            </button>
          </div>

          <div className="mt-6 bg-white rounded-xl border border-e2e8f0 p-4 shadow-sm">
            <h3 className="text-black mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[#1e293b] mb-1">Market Cap</div>
                <div className="text-black">{selectedStock.marketCap}</div>
              </div>
              <div>
                <div className="text-[#1e293b] mb-1">Volume</div>
                <div className="text-black">{selectedStock.volume}</div>
              </div>
              <div>
                <div className="text-[#1e293b] mb-1">Avg Volume</div>
                <div className="text-black">45.2M</div>
              </div>
              <div>
                <div className="text-[#1e293b] mb-1">52-Week High</div>
                <div className="text-black">$925.00</div>
              </div>
              <div>
                <div className="text-[#1e293b] mb-1">52-Week Low</div>
                <div className="text-black">$620.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="col-span-6">
          <div className="bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-black">{selectedStock.symbol}</h2>
                  <button className="p-1 hover:bg-[#f1f5f9] rounded transition-colors">
                    <Star className="w-5 h-5 text-[#1e293b]" />
                  </button>
                </div>
                <p className="text-[#1e293b] mb-4">{selectedStock.name}</p>
                
                <div className="flex items-baseline gap-4">
                  <div className="font-mono text-black">${selectedStock.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-mono">
                      {isPositive ? '+' : ''}{selectedStock.change.toFixed(2)} ({isPositive ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y', 'All'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded ${
                      period === '1D'
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0] border border-e2e8f0'
                    } transition-colors`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#1e293b" />
                  <YAxis stroke="#1e293b" domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#000000'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#16a34a' : '#dc2626'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white py-3 px-4 rounded-lg transition-colors">
                Buy
              </button>
              <button className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-lg transition-colors">
                Sell
              </button>
              <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] py-3 px-4 rounded-lg transition-colors border border-e2e8f0">
                Add to Portfolio
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
            <h3 className="text-black mb-4">Company News</h3>
            <div className="space-y-3">
              {newsItems.filter(n => n.tickers.includes(selectedStock.symbol)).map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>
        </div>

        {/* Trades Feed */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-e2e8f0 p-4 shadow-sm">
            <h3 className="text-black mb-4">Live Trades</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {Array.from({ length: 20 }).map((_, i) => {
                const isBuy = Math.random() > 0.5;
                const price = selectedStock.price + (Math.random() - 0.5) * 2;
                const shares = Math.floor(Math.random() * 1000) + 100;
                
                return (
                  <motion.div
                    key={i}
                    className="p-2 bg-[#f8fafc] rounded border border-e2e8f0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className={isBuy ? 'text-[#16a34a]' : 'text-[#dc2626]'}>
                        {isBuy ? 'BUY' : 'SELL'}
                      </span>
                      <span className="text-[#1e293b]">{shares}</span>
                    </div>
                    <div className="font-mono text-[#1e293b]">${price.toFixed(2)}</div>
                    <div className="text-[#1e293b]/60">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
