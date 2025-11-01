import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Newspaper, RefreshCw } from 'lucide-react';
import { NewsCard } from '../components/NewsCard';

const API_URL = 'https://backend.brokerai.ai:8088/api';

export function Intelligence() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/news`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedSentiment === 'all' ? news : news.filter((a: any) => a.sentiment === selectedSentiment);

  const timeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-4 lg:space-y-6 relative">
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Newspaper className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Market Intelligence Feed</h1>
                <p className="text-sm text-slate-400">{news.length} articles • Updated continuously</p>
              </div>
            </div>
            <button onClick={fetchNews} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/30">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Filter by Sentiment</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'bullish', 'bearish', 'neutral'].map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => setSelectedSentiment(sentiment)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedSentiment === sentiment 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-slate-700/50 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article: any) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
            <Newspaper className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-400">No news articles found</p>
          </div>
        )}
      </div>
    </div>
  );
}
