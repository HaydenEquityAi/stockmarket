import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, X } from 'lucide-react';
import { LiveStockCard } from '../components/LiveStockCard';

const API_URL = 'https://backend.brokerai.ai:8088/api';

interface WatchlistItem {
  symbol: string;
  addedAt: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function Portfolio() {
  const { token } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchWatchlist(); }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch(`${API_URL}/watchlist`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setWatchlist(data.watchlist);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const response = await fetch(`${API_URL}/watchlist`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ symbol: newSymbol.toUpperCase() })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
      setSuccess(`${newSymbol.toUpperCase()} added to watchlist`);
      setNewSymbol(''); setShowAddModal(false); fetchWatchlist();
    } catch (error: any) { setError(error.message || 'Failed to add stock'); }
  };

  const handleRemoveStock = async (symbol: string) => {
    try {
      const response = await fetch(`${API_URL}/watchlist/${symbol}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) { setSuccess(`${symbol} removed from watchlist`); fetchWatchlist(); }
    } catch (error) { setError('Failed to remove stock'); }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
          <p className="text-gray-600">Track your favorite stocks</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Add Stock
        </button>
      </div>
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}
      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your watchlist is empty</p>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Your First Stock</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.symbol} className="relative">
              <button onClick={() => handleRemoveStock(item.symbol)} className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                <X size={16} />
              </button>
              <LiveStockCard symbol={item.symbol} name={item.symbol} />
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Stock to Watchlist</h2>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Symbol</label>
                <input type="text" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value.toUpperCase())} placeholder="AAPL, MSFT, GOOGL..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowAddModal(false); setNewSymbol(''); setError(''); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
