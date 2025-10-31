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
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Watchlist</h1>
          <p className="text-gray-600">Track real-time prices for your favorite stocks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQuotes}
            disabled={refreshing || watchlist.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            title="Refresh prices"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {watchlist.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your watchlist..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && watchlist.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stocks in your watchlist</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Add stocks to track their real-time prices and stay updated on market movements
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Add Your First Stock
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
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
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeSymbol(symbol)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from watchlist"
                >
                  <X size={16} />
                </button>

                {/* Symbol */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{symbol}</h3>
                </div>

                {/* Price & Change */}
                {quote ? (
                  <>
                    <div className="mb-3">
                      <p className="text-3xl font-bold text-gray-900">
                        ${quote.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <div>
                        <span className="text-lg font-semibold">
                          {isPositive ? '+' : ''}{quote.changePercent?.toFixed(2)}%
                        </span>
                        <span className="text-sm ml-2">
                          ({isPositive ? '+' : ''}${quote.change?.toFixed(2)})
                        </span>
                      </div>
                    </div>

                    {quote.volume && (
                      <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                        Vol: {(quote.volume / 1000000).toFixed(2)}M
                      </div>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="mt-3 text-xs text-gray-400">
                  Updated {refreshing ? 'now' : 'just now'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Search Results */}
      {!loading && watchlist.length > 0 && filteredWatchlist.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Search className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No stocks match "{searchQuery}"</p>
        </div>
      )}

      {/* Add Symbol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Add to Watchlist</h3>
            <p className="text-gray-600 mb-6">Enter a stock symbol to track</p>
            <form onSubmit={addSymbol}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Stock Symbol</label>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, NVDA, TSLA"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg uppercase text-lg font-medium focus:border-blue-500 focus:outline-none"
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
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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