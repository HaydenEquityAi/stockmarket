import mongoose, { Schema, Document, Model } from 'mongoose';

// Stock Schema
interface IStock extends Document {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  sector?: string;
  data: number[];
  lastUpdated: Date;
}

const stockSchema = new Schema<IStock>({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  marketCap: { type: String, required: true },
  volume: { type: String, required: true },
  sector: { type: String },
  data: [Number], // Price history for sparkline charts
  lastUpdated: { type: Date, default: Date.now }
});

// Index Schema (S&P 500, Dow, Nasdaq)
interface IIndex extends Document {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  data: number[];
  lastUpdated: Date;
}

const indexSchema = new Schema<IIndex>({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  change: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  data: [Number], // Historical data
  lastUpdated: { type: Date, default: Date.now }
});

// Portfolio Holding Schema
interface IPortfolioHolding {
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

// Portfolio Schema
interface IPortfolio extends Document {
  userId: string;
  holdings: IPortfolioHolding[];
  totalValue: number;
  lastUpdated: Date;
}

const portfolioSchema = new Schema<IPortfolio>({
  userId: { type: String, required: true, default: 'default-user' },
  holdings: [{
    symbol: String,
    name: String,
    shares: Number,
    avgCost: Number,
    currentPrice: Number,
    totalValue: Number,
    gain: Number,
    gainPercent: Number,
    data: [Number]
  }],
  totalValue: Number,
  lastUpdated: { type: Date, default: Date.now }
});

// News Schema
interface INews extends Document {
  newsId: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tickers: string[];
  publishedAt: Date;
}

const newsSchema = new Schema<INews>({
  newsId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  source: { type: String, required: true },
  time: { type: String, required: true },
  sentiment: { type: String, enum: ['bullish', 'bearish', 'neutral'] },
  tickers: [String],
  publishedAt: { type: Date, default: Date.now }
});

// Smart Money Trades Schema
interface ISmartMoneyTrade extends Document {
  tradeId: string;
  name: string;
  role: 'Congress' | 'Hedge Fund' | 'Insider';
  ticker: string;
  type: 'BUY' | 'SELL';
  amount: string;
  date: string;
  priceChange: number;
  shares: number;
}

const smartMoneyTradeSchema = new Schema<ISmartMoneyTrade>({
  tradeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Congress', 'Hedge Fund', 'Insider'], required: true },
  ticker: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  amount: { type: String, required: true },
  date: { type: String, required: true },
  priceChange: { type: Number, required: true },
  shares: { type: Number, required: true }
});

// Market Data Schema (Sectors, Global Markets, etc.)
interface IMarketData extends Document {
  type: 'sector' | 'global' | 'commodity' | 'crypto';
  name: string;
  value?: number;
  change?: number;
  changePercent?: number;
  status?: string; // For global markets (open/closed)
  symbol?: string;
  price?: number; // For commodities/crypto
  lastUpdated: Date;
}

const marketDataSchema = new Schema<IMarketData>({
  type: { type: String, enum: ['sector', 'global', 'commodity', 'crypto'], required: true },
  name: { type: String, required: true },
  value: { type: Number },
  change: { type: Number },
  changePercent: { type: Number },
  status: { type: String }, // For global markets (open/closed)
  symbol: { type: String },
  price: { type: Number }, // For commodities/crypto
  lastUpdated: { type: Date, default: Date.now }
});

// Watchlist Schema
interface IWatchlist extends Document {
  userId: string;
  stocks: string[]; // Array of stock symbols
  lastUpdated: Date;
}

const watchlistSchema = new Schema<IWatchlist>({
  userId: { type: String, required: true, default: 'default-user' },
  stocks: [String], // Array of stock symbols
  lastUpdated: { type: Date, default: Date.now }
});

// Export models
export const Stock = (mongoose.models.Stock as Model<IStock>) || mongoose.model<IStock>('Stock', stockSchema);
export const Index = (mongoose.models.Index as Model<IIndex>) || mongoose.model<IIndex>('Index', indexSchema);
export const Portfolio = (mongoose.models.Portfolio as Model<IPortfolio>) || mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
export const News = (mongoose.models.News as Model<INews>) || mongoose.model<INews>('News', newsSchema);
export const SmartMoneyTrade = (mongoose.models.SmartMoneyTrade as Model<ISmartMoneyTrade>) || mongoose.model<ISmartMoneyTrade>('SmartMoneyTrade', smartMoneyTradeSchema);
export const MarketData = (mongoose.models.MarketData as Model<IMarketData>) || mongoose.model<IMarketData>('MarketData', marketDataSchema);
export const Watchlist = (mongoose.models.Watchlist as Model<IWatchlist>) || mongoose.model<IWatchlist>('Watchlist', watchlistSchema);

// Export interfaces for use in other files
export type {
  IStock,
  IIndex,
  IPortfolio,
  IPortfolioHolding,
  INews,
  ISmartMoneyTrade,
  IMarketData,
  IWatchlist
};

