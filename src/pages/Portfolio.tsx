import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Briefcase, X, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const API_URL = 'https://backend.brokerai.ai:8088/api';
const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#84cc16'];

interface Position { _id: string; symbol: string; quantity: number; avgPrice: number; currentPrice: number; currentValue: number; totalGain: number; totalGainPercent: number; }
interface Summary { totalValue: number; totalCost: number; totalGain: number; totalGainPercent: number; positionCount: number; }

export function Portfolio() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalValue: 0, totalCost: 0, totalGain: 0, totalGainPercent: 0, positionCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState({ symbol: '', quantity: '', avgPrice: '' } as any);

  useEffect(() => { fetchPortfolio(); const i = setInterval(fetchPortfolio, 60000); return () => clearInterval(i); }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/portfolio/positions`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setPositions(data.positions || []);
        setSummary(data.summary || { totalValue: 0, totalCost: 0, totalGain: 0, totalGainPercent: 0, positionCount: 0 });
      }
    } catch (e) {
      console.error('Failed to fetch portfolio:', e);
    } finally { setLoading(false); }
  };

  const addPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/portfolio/positions`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ symbol: newPosition.symbol, quantity: parseFloat(newPosition.quantity), avgPrice: parseFloat(newPosition.avgPrice) }) });
      if (response.ok) { setShowAddModal(false); setNewPosition({ symbol: '', quantity: '', avgPrice: '' }); fetchPortfolio(); }
    } catch (e) { console.error('Failed to add position:', e); }
  };

  const removePosition = async (symbol: string) => {
    if (!confirm(`Remove ${symbol} from portfolio?`)) return;
    try { const token = localStorage.getItem('token'); await fetch(`${API_URL}/portfolio/positions/${symbol}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); fetchPortfolio(); } catch (e) { console.error('Failed to remove position:', e); }
  };

  const pieData = positions.map((p) => ({ name: p.symbol, value: p.currentValue, percentage: ((p.currentValue / (summary.totalValue || 1)) * 100).toFixed(1) }));

  if (loading) {
    return (<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>);
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h1 className="text-2xl font-black text-white">My Portfolio</h1><p className="text-slate-400">Track your investments and performance</p></div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"><Plus size={20} /><span>Add Position</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2"><DollarSign size={20} className="text-emerald-400" /><span className="text-sm text-slate-400 font-semibold">Total Value</span></div>
          <p className="text-2xl font-black text-white">${summary.totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2"><Briefcase size={20} className="text-cyan-400" /><span className="text-sm text-slate-400 font-semibold">Total Cost</span></div>
          <p className="text-2xl font-black text-white">${summary.totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2">{summary.totalGain >= 0 ? (<TrendingUp size={20} className="text-emerald-400" />) : (<TrendingDown size={20} className="text-red-400" />)}<span className="text-sm text-slate-400 font-semibold">Total Gain/Loss</span></div>
          <p className={`text-2xl font-black ${summary.totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{summary.totalGain >= 0 ? '+' : ''}${summary.totalGain.toFixed(2)}</p>
          <p className={`${summary.totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'} text-sm font-semibold`}>{summary.totalGain >= 0 ? '+' : ''}{summary.totalGainPercent.toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2"><Briefcase size={20} className="text-amber-400" /><span className="text-sm text-slate-400 font-semibold">Positions</span></div>
          <p className="text-2xl font-black text-white">{summary.positionCount}</p>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl"><Briefcase className="mx-auto text-slate-400 mb-4" size={48} /><h3 className="text-lg font-bold text-white mb-2">No positions yet</h3><p className="text-slate-400 mb-4">Add your first stock position to start tracking</p><button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30">Add Your First Position</button></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-3"><PieChartIcon className="h-6 w-6 text-emerald-400" />Portfolio Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Positions List */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-x-auto">
            <h2 className="text-lg font-black text-white mb-4">Holdings</h2>
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50 font-semibold">
                  <th className="pb-3 pr-4">Symbol</th>
                  <th className="pb-3 pr-4 text-right">Qty</th>
                  <th className="pb-3 pr-4 text-right">Avg Price</th>
                  <th className="pb-3 pr-4 text-right">Current</th>
                  <th className="pb-3 pr-4 text-right">Value</th>
                  <th className="pb-3 pr-4 text-right">Gain/Loss</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => (
                  <tr key={pos._id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 pr-4 font-black text-emerald-400 text-lg">{pos.symbol}</td>
                    <td className="py-4 pr-4 text-right text-slate-300">{pos.quantity}</td>
                    <td className="py-4 pr-4 text-right text-slate-400">${pos.avgPrice.toFixed(2)}</td>
                    <td className="py-4 pr-4 text-right font-semibold text-white">${pos.currentPrice.toFixed(2)}</td>
                    <td className="py-4 pr-4 text-right font-bold text-white">${pos.currentValue.toFixed(2)}</td>
                    <td className={`py-4 pr-4 text-right font-bold ${pos.totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      <div>{pos.totalGain >= 0 ? '+' : ''}${pos.totalGain.toFixed(2)}</div>
                      <div className="text-xs font-semibold">
                        ({pos.totalGain >= 0 ? '+' : ''}{pos.totalGainPercent.toFixed(2)}%)
                      </div>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => removePosition(pos.symbol)}
                        className="p-2 hover:bg-red-500/10 rounded text-red-400 hover:text-red-300 transition-colors"
                        title="Remove position"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 max-w-md w-full shadow-2xl"><h3 className="text-xl font-black text-white mb-4">Add Position to Portfolio</h3><form onSubmit={addPosition}><div className="space-y-4"><div><label className="block text-sm font-semibold mb-1 text-slate-300">Stock Symbol</label><input type="text" value={newPosition.symbol} onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })} className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 uppercase" placeholder="AAPL" required /></div><div><label className="block text-sm font-semibold mb-1 text-slate-300">Quantity (shares)</label><input type="number" step="0.01" min="0" value={newPosition.quantity} onChange={(e) => setNewPosition({ ...newPosition, quantity: e.target.value })} className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="10" required /></div><div><label className="block text-sm font-semibold mb-1 text-slate-300">Average Purchase Price</label><input type="number" step="0.01" min="0" value={newPosition.avgPrice} onChange={(e) => setNewPosition({ ...newPosition, avgPrice: e.target.value })} className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="150.00" required /></div></div><div className="flex gap-2 mt-6"><button type="button" onClick={() => { setShowAddModal(false); setNewPosition({ symbol: '', quantity: '', avgPrice: '' }); }} className="flex-1 px-4 py-2 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 text-slate-300 font-semibold transition-all">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30">Add Position</button></div></form></div></div>
      )}
    </div>
  );
}
