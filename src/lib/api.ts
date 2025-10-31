// API service layer for BrokerAI backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Stock APIs
export const stockAPI = {
  getAll: () => fetchAPI<any[]>('/stocks'),
  getTrending: () => fetchAPI<any[]>('/stocks/trending'),
  search: (query: string) => fetchAPI<any[]>(`/stocks/search?q=${encodeURIComponent(query)}`),
  getBySymbol: (symbol: string) => fetchAPI<any>(`/stocks/${symbol.toUpperCase()}`),
};

// Market APIs
export const marketAPI = {
  getIndices: () => fetchAPI<any[]>('/market/indices'),
  getStatus: () => fetchAPI<any>('/market/status'),
  getSectors: () => fetchAPI<any[]>('/market/sectors'),
  getGlobalMarkets: () => fetchAPI<any[]>('/market/global'),
  getCommodities: () => fetchAPI<any[]>('/market/commodities'),
  getCrypto: () => fetchAPI<any[]>('/market/crypto'),
  getBreadth: () => fetchAPI<any>('/market/breadth'),
};

// Portfolio APIs
export const portfolioAPI = {
  get: (userId?: string) => 
    fetchAPI<any>(`/portfolio${userId ? `?userId=${userId}` : ''}`),
  add: (data: { userId?: string; symbol: string; shares: number; avgCost: number }) =>
    fetchAPI<any>('/portfolio/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  remove: (symbol: string, userId?: string) =>
    fetchAPI<any>(`/portfolio/${symbol}${userId ? `?userId=${userId}` : ''}`, {
      method: 'DELETE',
    }),
  getHistory: (userId?: string) =>
    fetchAPI<any[]>(`/portfolio/history${userId ? `?userId=${userId}` : ''}`),
};

// News APIs
export const newsAPI = {
  getAll: (params?: { limit?: number; sentiment?: string; ticker?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.sentiment) queryParams.set('sentiment', params.sentiment);
    if (params?.ticker) queryParams.set('ticker', params.ticker);
    const query = queryParams.toString();
    return fetchAPI<any[]>(`/news${query ? `?${query}` : ''}`);
  },
  getByStock: (symbol: string) => fetchAPI<any[]>(`/news/stock/${symbol.toUpperCase()}`),
};

// Smart Money APIs
export const smartMoneyAPI = {
  getTrades: (params?: { role?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.set('role', params.role);
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    const query = queryParams.toString();
    return fetchAPI<any[]>(`/smart-money/trades${query ? `?${query}` : ''}`);
  },
  getLeaderboard: () => fetchAPI<any[]>('/smart-money/leaderboard'),
};

// Watchlist APIs
export const watchlistAPI = {
  get: (userId?: string) =>
    fetchAPI<any>(`/watchlist${userId ? `?userId=${userId}` : ''}`),
  add: (data: { userId?: string; symbol: string }) =>
    fetchAPI<any>('/watchlist/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  remove: (symbol: string, userId?: string) =>
    fetchAPI<any>(`/watchlist/${symbol}${userId ? `?userId=${userId}` : ''}`, {
      method: 'DELETE',
    }),
};

// Analysis APIs
export const analysisAPI = {
  screenStocks: (filters: { marketCap?: string; priceChange?: string; volume?: string; sector?: string }) =>
    fetchAPI<any[]>('/analysis/screen', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),
  getAISignals: () => fetchAPI<any[]>('/analysis/signals'),
  getTechnicalIndicators: (symbol: string) =>
    fetchAPI<any>(`/analysis/technical/${symbol.toUpperCase()}`),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: (userId?: string) =>
    fetchAPI<any>(`/dashboard/overview${userId ? `?userId=${userId}` : ''}`),
};

// Combined API export
export const api = {
  stocks: stockAPI,
  market: marketAPI,
  portfolio: portfolioAPI,
  news: newsAPI,
  smartMoney: smartMoneyAPI,
  watchlist: watchlistAPI,
  analysis: analysisAPI,
  dashboard: dashboardAPI,
};

export default api;

