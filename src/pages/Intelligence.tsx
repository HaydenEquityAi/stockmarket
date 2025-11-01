import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Newspaper, RefreshCw } from 'lucide-react';
import { NewsCard } from '../components/NewsCard';

const API_URL = 'https://backend.brokerai.ai:8088/api';

export function Intelligence() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📰 Fetching news from:', `${API_URL}/news`);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/news`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      console.log('📰 News response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📰 News response data:', data);
      
      // Handle both response formats: { news: [...] } or direct array
      const articles = Array.isArray(data) ? data : (data.news || []);
      console.log('📰 Parsed articles:', articles.length);
      
      setNews(articles);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setError('Failed to load news. Please try again.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedSentiment === 'all' 
    ? news 
    : news.filter((a: any) => a.sentiment === selectedSentiment);

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
                <p className="text-sm text-slate-400">
                  {loading ? 'Loading...' : `${news.length} articles`} • Updated continuously
                </p>
              </div>
            </div>
            <button 
              onClick={fetchNews} 
              disabled={loading} 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/30"
            >
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
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchNews}
              className="mt-2 text-red-400 hover:text-red-300 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

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
              <NewsCard key={article.id || article.title} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
            <Newspaper className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-400 mb-2">
              {error ? 'Failed to load news articles' : 'No news articles found'}
            </p>
            {!error && (
              <button 
                onClick={fetchNews}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all"
              >
                Refresh News
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
