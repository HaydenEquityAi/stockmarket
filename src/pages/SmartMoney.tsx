import { useState } from 'react';
import { smartMoneyTrades } from '../lib/mock-data';
import { TradeCard } from '../components/TradeCard';
import { TrendingUp, Award, Users } from 'lucide-react';

type TradeType = 'congress' | 'hedge-funds' | 'insiders';

export function SmartMoney() {
  const [activeTab, setActiveTab] = useState<TradeType>('congress');

  const leaderboard = [
    { rank: 1, name: 'Nancy Pelosi', trades: 47, success: 92.3, gain: '+$45.2M' },
    { rank: 2, name: 'Berkshire Hathaway', trades: 156, success: 87.5, gain: '+$2.4B' },
    { rank: 3, name: 'Elon Musk', trades: 23, success: 78.2, gain: '+$156M' },
    { rank: 4, name: 'Michael Burry', trades: 34, success: 85.1, gain: '+$234M' },
    { rank: 5, name: 'Josh Hawley', trades: 28, success: 76.8, gain: '+$12.5M' }
  ];

  const filteredTrades = smartMoneyTrades.filter(trade => {
    if (activeTab === 'congress') return trade.role === 'Congress';
    if (activeTab === 'hedge-funds') return trade.role === 'Hedge Fund';
    if (activeTab === 'insiders') return trade.role === 'Insider';
    return true;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-50 mb-2">Smart Money</h1>
          <p className="text-slate-400">Track trades from Congress, hedge funds, and corporate insiders</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border border-blue-500 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-6 h-6 text-white" />
            <span className="text-blue-100">Congressional Trades</span>
          </div>
          <div className="font-mono text-white mb-2">234</div>
          <div className="text-blue-100">This month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-500 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <span className="text-purple-100">Hedge Fund Moves</span>
          </div>
          <div className="font-mono text-white mb-2">1,245</div>
          <div className="text-purple-100">Last 30 days</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-6 border border-emerald-500 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-6 h-6 text-white" />
            <span className="text-emerald-100">Avg Success Rate</span>
          </div>
          <div className="font-mono text-white mb-2">84.3%</div>
          <div className="text-emerald-100">All traders</div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('congress')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'congress'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Congress
            </button>
            <button
              onClick={() => setActiveTab('hedge-funds')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'hedge-funds'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Hedge Funds
            </button>
            <button
              onClick={() => setActiveTab('insiders')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'insiders'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Insiders
            </button>
          </div>

          {/* Trades Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredTrades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))}
            
            {/* Additional mock trades based on tab */}
            {activeTab === 'congress' && (
              <>
                <TradeCard trade={{
                  id: '6',
                  name: 'Dan Crenshaw',
                  role: 'Congress',
                  ticker: 'META',
                  type: 'BUY',
                  amount: '$3.2M',
                  date: '2025-10-23',
                  priceChange: 6.8,
                  shares: 8500
                }} />
                <TradeCard trade={{
                  id: '7',
                  name: 'Alexandria Ocasio-Cortez',
                  role: 'Congress',
                  ticker: 'TSLA',
                  type: 'SELL',
                  amount: '$1.8M',
                  date: '2025-10-22',
                  priceChange: -3.2,
                  shares: 7400
                }} />
              </>
            )}
            
            {activeTab === 'hedge-funds' && (
              <>
                <TradeCard trade={{
                  id: '8',
                  name: 'Bridgewater Associates',
                  role: 'Hedge Fund',
                  ticker: 'SPY',
                  type: 'BUY',
                  amount: '$450M',
                  date: '2025-10-25',
                  priceChange: 4.2,
                  shares: 950000
                }} />
                <TradeCard trade={{
                  id: '9',
                  name: 'Renaissance Technologies',
                  role: 'Hedge Fund',
                  ticker: 'QQQ',
                  type: 'BUY',
                  amount: '$280M',
                  date: '2025-10-24',
                  priceChange: 5.6,
                  shares: 750000
                }} />
              </>
            )}
            
            {activeTab === 'insiders' && (
              <>
                <TradeCard trade={{
                  id: '10',
                  name: 'Tim Cook',
                  role: 'Insider',
                  ticker: 'AAPL',
                  type: 'SELL',
                  amount: '$25M',
                  date: '2025-10-26',
                  priceChange: 2.1,
                  shares: 131578
                }} />
                <TradeCard trade={{
                  id: '11',
                  name: 'Satya Nadella',
                  role: 'Insider',
                  ticker: 'MSFT',
                  type: 'SELL',
                  amount: '$18M',
                  date: '2025-10-25',
                  priceChange: 1.5,
                  shares: 47493
                }} />
              </>
            )}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="col-span-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-slate-50">Leaderboard</h2>
            </div>

            <div className="space-y-4">
              {leaderboard.map((trader) => (
                <div
                  key={trader.rank}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trader.rank === 1 ? 'bg-yellow-500 text-slate-900' :
                      trader.rank === 2 ? 'bg-slate-400 text-slate-900' :
                      trader.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      #{trader.rank}
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-50">{trader.name}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-slate-500">Trades</div>
                      <div className="text-slate-300">{trader.trades}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Success</div>
                      <div className="text-emerald-500">{trader.success}%</div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <div className="text-slate-500">Total Gain</div>
                    <div className="text-emerald-500 font-mono">{trader.gain}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
              View Full Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
