import { portfolioHoldings, portfolioHistory, sectorData } from '../lib/mock-data';
import { TrendingUp, DollarSign, Target, PieChart as PieChartIcon } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import { MiniChart } from '../components/MiniChart';

export function Portfolio() {
  const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalGain = portfolioHoldings.reduce((sum, holding) => sum + holding.gain, 0);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;
  const todayGain = 2456.78;
  const todayGainPercent = (todayGain / totalValue) * 100;

  const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899', '#06b6d4'];

  const allocationData = portfolioHoldings.map((holding, index) => ({
    name: holding.symbol,
    value: holding.totalValue,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black mb-2">Portfolio</h1>
          <p className="text-[#1e293b]">Track your investments and performance</p>
        </div>
        <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 px-6 rounded-lg transition-colors">
          Add Position
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 border border-e2e8f0 shadow-md"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center gap-2 text-[#1e293b] mb-3">
            <DollarSign className="w-5 h-5" />
            <span>Total Value</span>
          </div>
          <div className="font-mono text-black mb-2">${totalValue.toLocaleString()}</div>
          <div className="text-[#1e293b]">As of {new Date().toLocaleDateString()}</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-e2e8f0 shadow-md"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center gap-2 text-[#1e293b] mb-3">
            <TrendingUp className="w-5 h-5" />
            <span>Today's P&L</span>
          </div>
          <div className="font-mono text-[#16a34a] mb-2">
            +${todayGain.toLocaleString()}
          </div>
          <div className="text-[#16a34a]">+{todayGainPercent.toFixed(2)}%</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-e2e8f0 shadow-md"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center gap-2 text-[#1e293b] mb-3">
            <Target className="w-5 h-5" />
            <span>All-Time P&L</span>
          </div>
          <div className="font-mono text-[#16a34a] mb-2">
            +${totalGain.toLocaleString()}
          </div>
          <div className="text-[#16a34a]">+{totalGainPercent.toFixed(2)}%</div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
        <h2 className="text-black mb-4">Portfolio Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#1e293b" />
              <YAxis stroke="#1e293b" />
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
                dataKey="value"
                stroke="#16a34a"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-black mb-4">Holdings</h2>
          <div className="space-y-4">
            {portfolioHoldings.map((holding) => (
              <motion.div
                key={holding.symbol}
                className="bg-white rounded-xl border border-e2e8f0 p-6 hover:border-[#2563eb]/20 transition-all shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="text-black mb-1">{holding.symbol}</div>
                    <div className="text-[#1e293b]">{holding.name}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-[#1e293b] mb-1">Shares</div>
                    <div className="text-black">{holding.shares}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-[#1e293b] mb-1">Avg Cost</div>
                    <div className="text-black font-mono">${holding.avgCost.toFixed(2)}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-[#1e293b] mb-1">Current Price</div>
                    <div className="text-black font-mono">${holding.currentPrice.toFixed(2)}</div>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="text-[#1e293b] mb-1">Total Value</div>
                    <div className="text-black font-mono mb-2">${holding.totalValue.toLocaleString()}</div>
                    <div className={`font-mono ${holding.gain >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                      {holding.gain >= 0 ? '+' : ''}${holding.gain.toFixed(2)} ({holding.gainPercent >= 0 ? '+' : ''}{holding.gainPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <MiniChart data={holding.data} height={50} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-black mb-4">Allocation</h2>
          <div className="bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#1e293b]">{item.name}</span>
                  </div>
                  <span className="text-[#1e293b]">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl border border-e2e8f0 p-6 shadow-sm">
            <h3 className="text-black mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-e2e8f0">
                <div>
                  <div className="text-black">NVDA</div>
                  <div className="text-[#1e293b]">Buy 50 shares</div>
                </div>
                <div className="text-[#16a34a]">+$43,764</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-e2e8f0">
                <div>
                  <div className="text-black">AAPL</div>
                  <div className="text-[#1e293b]">Buy 150 shares</div>
                </div>
                <div className="text-[#16a34a]">+$28,493</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-black">MSFT</div>
                  <div className="text-[#1e293b]">Buy 100 shares</div>
                </div>
                <div className="text-[#16a34a]">+$37,891</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
