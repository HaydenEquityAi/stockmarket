import { useState } from 'react';
import { trendingStocks } from '../lib/mock-data';
import { Filter, TrendingUp, Target, Zap, BarChart3 } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type AnalysisTab = 'screener' | 'technical' | 'signals' | 'compare';

export function Analysis() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('screener');
  const [compareStocks, setCompareStocks] = useState([trendingStocks[0], trendingStocks[1]]);

  const screenedStocks = trendingStocks.filter(s => s.changePercent > 1);

  const aiSignals = [
    {
      ticker: 'NVDA',
      signal: 'Strong Buy',
      confidence: 92,
      reason: 'Momentum breakout with high volume',
      type: 'bullish'
    },
    {
      ticker: 'AAPL',
      signal: 'Buy',
      confidence: 78,
      reason: 'Oversold RSI with positive divergence',
      type: 'bullish'
    },
    {
      ticker: 'MSFT',
      signal: 'Hold',
      confidence: 65,
      reason: 'Trading in neutral range',
      type: 'neutral'
    },
    {
      ticker: 'TSLA',
      signal: 'Strong Buy',
      confidence: 85,
      reason: 'Golden cross pattern forming',
      type: 'bullish'
    }
  ];

  const technicalIndicators = {
    rsi: 67.5,
    macd: 'Bullish',
    movingAverage: 'Above 50-day',
    support: 850.00,
    resistance: 900.00
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-50 mb-2">Analysis</h1>
          <p className="text-slate-400">Advanced tools for market analysis</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('screener')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'screener'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          Screener
        </button>
        <button
          onClick={() => setActiveTab('technical')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'technical'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Technical
        </button>
        <button
          onClick={() => setActiveTab('signals')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'signals'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          AI Signals
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'compare'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          Compare
        </button>
      </div>

      {/* Screener Tab */}
      {activeTab === 'screener' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Filter Sidebar */}
          <div className="col-span-3">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sticky top-6">
              <h3 className="text-slate-50 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 mb-2 block">Market Cap</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300">
                    <option>All</option>
                    <option>Large Cap (&gt;$10B)</option>
                    <option>Mid Cap ($2B-$10B)</option>
                    <option>Small Cap (&lt;$2B)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 mb-2 block">Price Change</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300">
                    <option>Any</option>
                    <option>Up &gt;1%</option>
                    <option>Up &gt;5%</option>
                    <option>Down &gt;1%</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 mb-2 block">Volume</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300">
                    <option>Any</option>
                    <option>High (&gt;10M)</option>
                    <option>Medium (1M-10M)</option>
                    <option>Low (&lt;1M)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 mb-2 block">Sector</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300">
                    <option>All</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Energy</option>
                  </select>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Apply Filters
                </button>
                
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="col-span-9">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-50">Results ({screenedStocks.length} stocks)</h2>
              <button className="bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors">
                Export
              </button>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 bg-slate-900 text-slate-400 border-b border-slate-700">
                <div>Symbol</div>
                <div>Name</div>
                <div>Price</div>
                <div>Change</div>
                <div>Volume</div>
                <div>Market Cap</div>
              </div>
              {screenedStocks.map((stock) => (
                <div key={stock.symbol} className="grid grid-cols-6 gap-4 p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className="text-slate-50 font-mono">{stock.symbol}</div>
                  <div className="text-slate-300">{stock.name}</div>
                  <div className="text-slate-50 font-mono">${stock.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    <span className="font-mono">{stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                  </div>
                  <div className="text-slate-300">{stock.volume}</div>
                  <div className="text-slate-300">{stock.marketCap}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Technical Tab */}
      {activeTab === 'technical' && (
        <div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <h2 className="text-slate-50 mb-4">NVDA Technical Analysis</h2>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 mb-2">RSI (14)</div>
                <div className="font-mono text-slate-50">{technicalIndicators.rsi}</div>
                <div className="text-orange-500">Overbought</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 mb-2">MACD</div>
                <div className="text-emerald-500">{technicalIndicators.macd}</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 mb-2">MA (50)</div>
                <div className="text-emerald-500">{technicalIndicators.movingAverage}</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 mb-2">Support</div>
                <div className="font-mono text-slate-50">${technicalIndicators.support}</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 mb-2">Resistance</div>
                <div className="font-mono text-slate-50">${technicalIndicators.resistance}</div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendingStocks[0].data.map((value, index) => ({ time: index, price: value }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-slate-50 mb-4">Momentum Indicators</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">RSI</span>
                  <span className="text-orange-500">Overbought</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stochastic</span>
                  <span className="text-emerald-500">Bullish</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CCI</span>
                  <span className="text-emerald-500">Bullish</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-slate-50 mb-4">Trend Indicators</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">MACD</span>
                  <span className="text-emerald-500">Bullish</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ADX</span>
                  <span className="text-emerald-500">Strong Trend</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Moving Avg</span>
                  <span className="text-emerald-500">Bullish</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-slate-50 mb-4">Volume Indicators</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">OBV</span>
                  <span className="text-emerald-500">Rising</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume Trend</span>
                  <span className="text-emerald-500">Above Avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Accumulation</span>
                  <span className="text-emerald-500">Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Signals Tab */}
      {activeTab === 'signals' && (
        <div>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 border border-blue-500 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-white" />
              <h2 className="text-white">AI-Powered Trading Signals</h2>
            </div>
            <p className="text-blue-100">Machine learning algorithms analyze patterns to generate trading signals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSignals.map((signal) => (
              <div key={signal.ticker} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-slate-50 mb-1">{signal.ticker}</div>
                    <div className={`${
                      signal.type === 'bullish' ? 'text-emerald-500' :
                      signal.type === 'bearish' ? 'text-red-500' :
                      'text-slate-400'
                    }`}>
                      {signal.signal}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 mb-1">Confidence</div>
                    <div className="font-mono text-slate-50">{signal.confidence}%</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                  <div className="text-slate-400 mb-1">Reason</div>
                  <div className="text-slate-300">{signal.reason}</div>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      signal.confidence >= 80 ? 'bg-emerald-500' :
                      signal.confidence >= 60 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <h2 className="text-slate-50 mb-4">Compare Stocks</h2>
            <div className="grid grid-cols-2 gap-6">
              {compareStocks.map((stock) => (
                <div key={stock.symbol} className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-slate-50 mb-2">{stock.symbol}</div>
                  <div className="font-mono text-slate-50 mb-1">${stock.price.toFixed(2)}</div>
                  <div className={`font-mono ${stock.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {compareStocks.map((stock) => (
              <div key={stock.symbol} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-slate-50 mb-4">{stock.symbol} Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Cap</span>
                    <span className="text-slate-50">{stock.marketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Volume</span>
                    <span className="text-slate-50">{stock.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">P/E Ratio</span>
                    <span className="text-slate-50">45.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">EPS</span>
                    <span className="text-slate-50">$4.12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dividend Yield</span>
                    <span className="text-slate-50">0.52%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
