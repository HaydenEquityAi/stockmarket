import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Search, X } from 'lucide-react';

const API_URL = 'https://backend.brokerai.ai:8088/api';

export function Stocks() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => { fetchWatchlist(); }, []);

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchQuotes();
      const interval = setInterval(fetchQuotes, 60000);
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/watchlist`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.symbols || data.watchlist?.map((w: any) => w.symbol) || []);
      }
    } catch (e) {
      console.error('Failed to fetch watchlist:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    if (watchlist.length === 0) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/market/quotes?symbols=${watchlist.join(',')}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        const map: Record<string, any> = {};
        (data.quotes || []).forEach((q: any) => { map[q.symbol] = q; });
        setQuotes(map);
      }
    } catch (e) {
      console.error('Failed to fetch quotes:', e);
    }
  };

  const addSymbol = async (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = newSymbol.toUpperCase().trim();
    if (!symbol || watchlist.includes(symbol)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ symbol })
      });
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.symbols || []);
        setNewSymbol('');
        setShowAddModal(false);
      }
    } catch (e) {
      console.error('Failed to add symbol:', e);
    }
  };

  const removeSymbol = async (symbol: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/watchlist/${symbol}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        setWatchlist((prev) => prev.filter((s) => s !== symbol));
        setQuotes((prev) => { const n = { ...prev }; delete n[symbol]; return n; });
      }
    } catch (e) {
      console.error('Failed to remove symbol:', e);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Watchlist</h1>
          <p className="text-gray-600">Track your favorite stocks</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Add Stock
        </button>
      </div>

      {!loading && watchlist.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No stocks in your watchlist</h3>
          <p className="text-gray-600 mb-4">Add stocks to track their real-time prices</p>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Your First Stock</button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && watchlist.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {watchlist.map((symbol) => {
            const quote = quotes[symbol];
            return (
              <div key={symbol} className="bg-white rounded-xl p-6 shadow-sm border relative group">
                <button onClick={() => removeSymbol(symbol)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={16} />
                </button>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{symbol}</h3>
                {quote ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900 mb-2">${quote.price?.toFixed(2) || '0.00'}</p>
                    <div className={`flex items-center gap-1 ${(quote.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="text-sm font-medium">{(quote.changePercent || 0) >= 0 ? '+' : ''}{(quote.changePercent || 0).toFixed(2)}%</span>
                      <span className="text-sm">({(quote.change || 0) >= 0 ? '+' : ''}{(quote.change || 0).toFixed(2)})</span>
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add Stock to Watchlist</h3>
            <form onSubmit={addSymbol}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Stock Symbol</label>
                <input type="text" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value.toUpperCase())} placeholder="AAPL, NVDA, TSLA..." className="w-full p-3 border rounded-lg uppercase" autoFocus required />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowAddModal(false); setNewSymbol(''); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
