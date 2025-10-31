import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Briefcase, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const API_URL = 'https://backend.brokerai.ai:8088/api';
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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
    return (<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>);
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1><p className="text-gray-600">Track your investments and performance</p></div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={20} /><span>Add Position</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center gap-2 mb-2"><DollarSign size={20} className="text-blue-600" /><span className="text-sm text-gray-600">Total Value</span></div><p className="text-2xl font-bold">${summary.totalValue.toFixed(2)}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center gap-2 mb-2"><Briefcase size={20} className="text-gray-600" /><span className="text-sm text-gray-600">Total Cost</span></div><p className="text-2xl font-bold">${summary.totalCost.toFixed(2)}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center gap-2 mb-2">{summary.totalGain >= 0 ? (<TrendingUp size={20} className="text-green-600" />) : (<TrendingDown size={20} className="text-red-600" />)}<span className="text-sm text-gray-600">Total Gain/Loss</span></div><p className={`text-2xl font-bold ${summary.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>{summary.totalGain >= 0 ? '+' : ''}${summary.totalGain.toFixed(2)}</p><p className={`${summary.totalGain >= 0 ? 'text-green-600' : 'text-red-600'} text-sm`}>{summary.totalGain >= 0 ? '+' : ''}{summary.totalGainPercent.toFixed(2)}%</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center gap-2 mb-2"><Briefcase size={20} className="text-purple-600" /><span className="text-sm text-gray-600">Positions</span></div><p className="text-2xl font-bold">{summary.positionCount}</p></div>
      </div>

      {positions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm"><Briefcase className="mx-auto text-gray-400 mb-4" size={48} /><h3 className="text-lg font-semibold text-gray-900 mb-2">No positions yet</h3><p className="text-gray-600 mb-4">Add your first stock position to start tracking</p><button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Your First Position</button></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Portfolio Allocation</h2>
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
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Positions List */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">Holdings</h2>
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
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
                  <tr key={pos._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 pr-4 font-bold text-blue-600">{pos.symbol}</td>
                    <td className="py-4 pr-4 text-right">{pos.quantity}</td>
                    <td className="py-4 pr-4 text-right text-gray-600">${pos.avgPrice.toFixed(2)}</td>
                    <td className="py-4 pr-4 text-right font-medium">${pos.currentPrice.toFixed(2)}</td>
                    <td className="py-4 pr-4 text-right font-semibold">${pos.currentValue.toFixed(2)}</td>
                    <td className={`py-4 pr-4 text-right font-medium ${pos.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div>{pos.totalGain >= 0 ? '+' : ''}${pos.totalGain.toFixed(2)}</div>
                      <div className="text-xs">
                        ({pos.totalGain >= 0 ? '+' : ''}{pos.totalGainPercent.toFixed(2)}%)
                      </div>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => removePosition(pos.symbol)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl p-6 max-w-md w-full"><h3 className="text-xl font-bold mb-4">Add Position to Portfolio</h3><form onSubmit={addPosition}><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Stock Symbol</label><input type="text" value={newPosition.symbol} onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })} className="w-full p-3 border rounded-lg uppercase" placeholder="AAPL" required /></div><div><label className="block text-sm font-medium mb-1">Quantity (shares)</label><input type="number" step="0.01" min="0" value={newPosition.quantity} onChange={(e) => setNewPosition({ ...newPosition, quantity: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="10" required /></div><div><label className="block text-sm font-medium mb-1">Average Purchase Price</label><input type="number" step="0.01" min="0" value={newPosition.avgPrice} onChange={(e) => setNewPosition({ ...newPosition, avgPrice: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="150.00" required /></div></div><div className="flex gap-2 mt-6"><button type="button" onClick={() => { setShowAddModal(false); setNewPosition({ symbol: '', quantity: '', avgPrice: '' }); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Position</button></div></form></div></div>
      )}
    </div>
  );
}
