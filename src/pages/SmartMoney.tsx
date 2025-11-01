import { useEffect, useState } from 'react';
import { TradeCard } from '../components/TradeCard';
import { TrendingUp, Award, Users } from 'lucide-react';

type TradeType = 'congress' | 'hedge-funds' | 'insiders';

export function SmartMoney() {
  const [activeTab, setActiveTab] = useState<TradeType>('congress');
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://backend.brokerai.ai:8088/api';

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/smart-money/trades`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setTrades(data.trades || data || []);
    } catch (e) {
      console.error('Failed to fetch trades:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrades(); }, []);

  const leaderboard = [
    { rank: 1, name: 'Nancy Pelosi', trades: 47, success: 92.3, gain: '+$45.2M' },
    { rank: 2, name: 'Berkshire Hathaway', trades: 156, success: 87.5, gain: '+$2.4B' },
    { rank: 3, name: 'Elon Musk', trades: 23, success: 78.2, gain: '+$156M' },
    { rank: 4, name: 'Michael Burry', trades: 34, success: 85.1, gain: '+$234M' },
    { rank: 5, name: 'Josh Hawley', trades: 28, success: 76.8, gain: '+$12.5M' }
  ];

  const filteredTrades = trades.filter((trade) => {
    if (activeTab === 'congress') return trade.role === 'Congress';
    if (activeTab === 'hedge-funds') return trade.role === 'Hedge Fund';
    if (activeTab === 'insiders') return trade.role === 'Insider';
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-2">Smart Money</h1>
          <p className="text-slate-400">Track trades from Congress, hedge funds, and corporate insiders</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-6 h-6 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">Congressional Trades</span>
          </div>
          <div className="font-mono text-white text-2xl font-black mb-2">234</div>
          <div className="text-emerald-300 text-sm">This month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30 shadow-2xl shadow-purple-500/10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <span className="text-purple-300 font-semibold">Hedge Fund Moves</span>
          </div>
          <div className="font-mono text-white text-2xl font-black mb-2">1,245</div>
          <div className="text-purple-300 text-sm">Last 30 days</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">Avg Success Rate</span>
          </div>
          <div className="font-mono text-white text-2xl font-black mb-2">84.3%</div>
          <div className="text-cyan-300 text-sm">All traders</div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('congress')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                activeTab === 'congress'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50'
              }`}
            >
              Congress
            </button>
            <button
              onClick={() => setActiveTab('hedge-funds')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                activeTab === 'hedge-funds'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50'
              }`}
            >
              Hedge Funds
            </button>
            <button
              onClick={() => setActiveTab('insiders')}
              className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                activeTab === 'insiders'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50'
              }`}
            >
              Insiders
            </button>
          </div>

          {/* Trades Grid */}
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="text-slate-400">Loading trades...</div>
            ) : (
              filteredTrades.map((trade) => (
                <TradeCard key={trade.id || trade.tradeId} trade={trade} />
              ))
            )}
            
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
        <div className="lg:col-span-4">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-amber-400" />
              <h2 className="text-white font-black">Leaderboard</h2>
            </div>

            <div className="space-y-4">
              {leaderboard.map((trader) => (
                <div
                  key={trader.rank}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      trader.rank === 1 ? 'bg-amber-500 text-slate-900' :
                      trader.rank === 2 ? 'bg-slate-400 text-slate-900' :
                      trader.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      #{trader.rank}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold">{trader.name}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-slate-400 text-sm">Trades</div>
                      <div className="text-slate-300 font-semibold">{trader.trades}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Success</div>
                      <div className="text-emerald-400 font-bold">{trader.success}%</div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <div className="text-slate-400 text-sm">Total Gain</div>
                    <div className="text-emerald-400 font-mono font-bold">{trader.gain}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-lg shadow-emerald-500/30">
              View Full Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
