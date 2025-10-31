// Mock data for the trading platform

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  data: number[];
}

export interface Index {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  data: number[];
}

export interface Trade {
  id: string;
  name: string;
  role: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  amount: string;
  date: string;
  priceChange: number;
  shares: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tickers: string[];
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gain: number;
  gainPercent: number;
  data: number[];
}

export const indices: Index[] = [
  {
    name: 'S&P 500',
    symbol: 'SPX',
    value: 4783.45,
    change: 23.67,
    changePercent: 0.50,
    data: [4750, 4755, 4748, 4760, 4765, 4758, 4770, 4775, 4768, 4780, 4783]
  },
  {
    name: 'Dow Jones',
    symbol: 'DJI',
    value: 37248.35,
    change: -45.23,
    changePercent: -0.12,
    data: [37280, 37270, 37265, 37255, 37260, 37250, 37245, 37240, 37235, 37250, 37248]
  },
  {
    name: 'Nasdaq',
    symbol: 'IXIC',
    value: 14972.76,
    change: 156.89,
    changePercent: 1.06,
    data: [14800, 14820, 14810, 14850, 14880, 14860, 14900, 14920, 14940, 14960, 14973]
  }
];

export const trendingStocks: Stock[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    volume: '42.5M',
    marketCap: '2.16T',
    data: [860, 862, 858, 865, 870, 868, 872, 875, 873, 876, 875]
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.95,
    change: 2.34,
    changePercent: 1.25,
    volume: '58.3M',
    marketCap: '2.95T',
    data: [187, 188, 187.5, 188.5, 189, 188.8, 189.5, 190, 189.8, 190.2, 189.95]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    change: -3.21,
    changePercent: -0.84,
    volume: '28.7M',
    marketCap: '2.82T',
    data: [382, 381, 380, 379, 380.5, 379, 378, 379.5, 378.5, 379, 378.91]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 242.84,
    change: 8.67,
    changePercent: 3.70,
    volume: '125.4M',
    marketCap: '771B',
    data: [235, 236, 238, 237, 239, 240, 238, 241, 243, 242, 242.84]
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.80,
    change: 1.92,
    changePercent: 1.37,
    volume: '31.2M',
    marketCap: '1.79T',
    data: [139.5, 140, 139.8, 140.5, 141, 140.8, 141.5, 142, 141.5, 141.9, 141.80]
  }
];

export const portfolioHoldings: PortfolioHolding[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 150,
    avgCost: 175.50,
    currentPrice: 189.95,
    totalValue: 28492.50,
    gain: 2167.50,
    gainPercent: 8.24,
    data: [26325, 26550, 26800, 27100, 27350, 27600, 27850, 28100, 28250, 28400, 28492.50]
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 50,
    avgCost: 720.00,
    currentPrice: 875.28,
    totalValue: 43764.00,
    gain: 7764.00,
    gainPercent: 21.57,
    data: [36000, 37500, 38200, 39500, 40800, 41200, 42100, 42800, 43200, 43500, 43764]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 100,
    avgCost: 350.00,
    currentPrice: 378.91,
    totalValue: 37891.00,
    gain: 2891.00,
    gainPercent: 8.26,
    data: [35000, 35500, 36200, 36800, 37100, 37350, 37500, 37650, 37750, 37850, 37891]
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 200,
    avgCost: 135.00,
    currentPrice: 141.80,
    totalValue: 28360.00,
    gain: 1360.00,
    gainPercent: 5.04,
    data: [27000, 27300, 27500, 27700, 27900, 28000, 28100, 28200, 28250, 28300, 28360]
  }
];

export const smartMoneyTrades: Trade[] = [
  {
    id: '1',
    name: 'Nancy Pelosi',
    role: 'Congress',
    ticker: 'NVDA',
    type: 'BUY',
    amount: '$5.0M',
    date: '2025-10-28',
    priceChange: 12.4,
    shares: 5714
  },
  {
    id: '2',
    name: 'Berkshire Hathaway',
    role: 'Hedge Fund',
    ticker: 'AAPL',
    type: 'BUY',
    amount: '$125.0M',
    date: '2025-10-27',
    priceChange: 8.2,
    shares: 657894
  },
  {
    id: '3',
    name: 'Elon Musk',
    role: 'Insider',
    ticker: 'TSLA',
    type: 'SELL',
    amount: '$8.5M',
    date: '2025-10-26',
    priceChange: -2.1,
    shares: 35000
  },
  {
    id: '4',
    name: 'Michael Burry',
    role: 'Hedge Fund',
    ticker: 'GOOGL',
    type: 'BUY',
    amount: '$15.2M',
    date: '2025-10-25',
    priceChange: 5.8,
    shares: 107194
  },
  {
    id: '5',
    name: 'Josh Hawley',
    role: 'Congress',
    ticker: 'MSFT',
    type: 'SELL',
    amount: '$2.3M',
    date: '2025-10-24',
    priceChange: -1.5,
    shares: 6070
  }
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'NVIDIA announces new AI chip breakthrough, stock surges',
    source: 'Bloomberg',
    time: '15 min ago',
    sentiment: 'bullish',
    tickers: ['NVDA']
  },
  {
    id: '2',
    title: 'Fed signals potential rate cut in Q1 2026',
    source: 'Reuters',
    time: '1 hour ago',
    sentiment: 'bullish',
    tickers: ['SPX', 'DJI']
  },
  {
    id: '3',
    title: 'Tesla faces production challenges in Berlin factory',
    source: 'CNBC',
    time: '2 hours ago',
    sentiment: 'bearish',
    tickers: ['TSLA']
  },
  {
    id: '4',
    title: 'Apple reports record iPhone sales in China',
    source: 'WSJ',
    time: '3 hours ago',
    sentiment: 'bullish',
    tickers: ['AAPL']
  },
  {
    id: '5',
    title: 'Tech sector rotation continues as investors seek value',
    source: 'MarketWatch',
    time: '4 hours ago',
    sentiment: 'neutral',
    tickers: ['IXIC', 'GOOGL', 'MSFT']
  }
];

export const portfolioHistory = [
  { date: '10/01', value: 125000 },
  { date: '10/05', value: 127500 },
  { date: '10/10', value: 126800 },
  { date: '10/15', value: 129200 },
  { date: '10/20', value: 131500 },
  { date: '10/25', value: 133800 },
  { date: '10/30', value: 138507.50 }
];

export const sectorData = [
  { name: 'Technology', value: 28.5, change: 1.2 },
  { name: 'Healthcare', value: 15.3, change: -0.4 },
  { name: 'Financials', value: 18.7, change: 0.8 },
  { name: 'Consumer', value: 12.4, change: 0.3 },
  { name: 'Energy', value: 8.9, change: -1.5 },
  { name: 'Industrials', value: 10.2, change: 0.6 },
  { name: 'Other', value: 6.0, change: 0.2 }
];

export const marketBreadth = {
  advancing: 2845,
  declining: 1234,
  unchanged: 421
};

export const globalMarkets = [
  { name: 'Shanghai Composite', value: 3245.67, change: 0.45, status: 'closed' },
  { name: 'FTSE 100', value: 7628.45, change: -0.23, status: 'closed' },
  { name: 'DAX', value: 16234.89, change: 0.67, status: 'closed' },
  { name: 'Nikkei 225', value: 32845.12, change: 1.12, status: 'closed' }
];
