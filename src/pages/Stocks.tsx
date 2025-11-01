import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, X, Search, RefreshCw } from 'lucide-react';

const API_URL = 'https://backend.brokerai.ai:8088/api';

interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export function Stocks() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

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
      const response = await fetch(`${API_URL}/watchlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.symbols || []);
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    if (watchlist.length === 0) return;
    
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/market/quotes?symbols=${watchlist.join(',')}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const quotesMap: Record<string, Quote> = {};
        data.quotes?.forEach((quote: Quote) => {
          quotesMap[quote.symbol] = quote;
        });
        setQuotes(quotesMap);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const addSymbol = async (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = newSymbol.toUpperCase().trim();
    
    if (!symbol || watchlist.includes(symbol)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ symbol })
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.symbols || []);
        setNewSymbol('');
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add symbol:', error);
    }
  };

  const removeSymbol = async (symbol: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/watchlist/${symbol}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setWatchlist(prev => prev.filter(s => s !== symbol));
        setQuotes(prev => {
          const newQuotes = { ...prev };
          delete newQuotes[symbol];
          return newQuotes;
        });
      }
    } catch (error) {
      console.error('Failed to remove symbol:', error);
    }
  };

  const filteredWatchlist = watchlist.filter(symbol =>
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">My Watchlist</h1>
          <p className="text-slate-400">Track real-time prices for your favorite stocks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQuotes}
            disabled={refreshing || watchlist.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-emerald-500/30 transition-all disabled:opacity-50"
            title="Refresh prices"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
          >
            <Plus size={20} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {watchlist.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your watchlist..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && watchlist.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-emerald-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No stocks in your watchlist</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Add stocks to track their real-time prices and stay updated on market movements
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
          >
            Add Your First Stock
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-slate-700/50 rounded w-20 mb-4"></div>
              <div className="h-10 bg-slate-700/50 rounded w-32 mb-3"></div>
              <div className="h-5 bg-slate-700/50 rounded w-24"></div>
            </div>
          ))}
        </div>
      )}

      {/* Stock Cards Grid */}
      {!loading && filteredWatchlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWatchlist.map(symbol => {
            const quote = quotes[symbol];
            const isPositive = (quote?.changePercent || 0) >= 0;
            
            return (
              <div
                key={symbol}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all relative group"
              >
                {/* Live Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-emerald-400 font-semibold">Live</span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeSymbol(symbol)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity border border-red-500/20"
                  title="Remove from watchlist"
                >
                  <X size={16} />
                </button>

                {/* Symbol */}
                <div className="mb-4 mt-6">
                  <h3 className="text-2xl font-black text-white">{symbol}</h3>
                </div>

                {/* Price & Change */}
                {quote ? (
                  <>
                    <div className="mb-3">
                      <p className="text-4xl font-black text-white">
                        ${quote.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <div>
                        <span className="text-lg font-black">
                          {isPositive ? '+' : ''}{quote.changePercent?.toFixed(2)}%
                        </span>
                        <span className="text-sm ml-2 text-slate-400">
                          ({isPositive ? '+' : ''}${quote.change?.toFixed(2)})
                        </span>
                      </div>
                    </div>

                    {quote.volume && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50 text-sm text-slate-400">
                        Vol: {(quote.volume / 1000000).toFixed(2)}M
                      </div>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-slate-700/50 rounded w-28"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-20"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No Search Results */}
      {!loading && watchlist.length > 0 && filteredWatchlist.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
          <Search className="mx-auto text-slate-400 mb-3" size={48} />
          <p className="text-slate-400">No stocks match "{searchQuery}"</p>
        </div>
      )}

      {/* Add Symbol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-2">Add to Watchlist</h3>
            <p className="text-slate-400 mb-6">Enter a stock symbol to track</p>
            <form onSubmit={addSymbol}>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-slate-300">Stock Symbol</label>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, NVDA, TSLA"
                  className="w-full p-3 bg-slate-800/50 border-2 border-slate-700/50 rounded-lg uppercase text-lg font-medium text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSymbol('');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-slate-700/50 rounded-lg hover:bg-slate-800/50 font-semibold text-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
