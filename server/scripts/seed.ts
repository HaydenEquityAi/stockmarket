import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../db/connection.js';
import { Stock, Index, News, SmartMoneyTrade, MarketData } from '../models/index.js';

dotenv.config({ path: './server/.env' });

// Sample data from mock-data.ts
const sampleStocks = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    volume: '42.5M',
    marketCap: '2.16T',
    sector: 'Technology',
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
    sector: 'Technology',
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
    sector: 'Technology',
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
    sector: 'Consumer Discretionary',
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
    sector: 'Technology',
    data: [139.5, 140, 139.8, 140.5, 141, 140.8, 141.5, 142, 141.5, 141.9, 141.80]
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 152.34,
    change: 1.23,
    changePercent: 0.81,
    volume: '45.2M',
    marketCap: '1.58T',
    sector: 'Consumer Discretionary',
    data: [151, 151.5, 150.8, 152, 152.5, 152.2, 152.8, 153, 152.5, 152.4, 152.34]
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 485.67,
    change: 5.43,
    changePercent: 1.13,
    volume: '22.1M',
    marketCap: '1.23T',
    sector: 'Technology',
    data: [480, 481, 479.5, 483, 485, 484, 486, 487, 485.5, 486, 485.67]
  }
];

const sampleIndices = [
  {
    symbol: 'SPX',
    name: 'S&P 500',
    value: 4783.45,
    change: 23.67,
    changePercent: 0.50,
    data: [4750, 4755, 4748, 4760, 4765, 4758, 4770, 4775, 4768, 4780, 4783]
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones',
    value: 37248.35,
    change: -45.23,
    changePercent: -0.12,
    data: [37280, 37270, 37265, 37255, 37260, 37250, 37245, 37240, 37235, 37250, 37248]
  },
  {
    symbol: 'IXIC',
    name: 'Nasdaq',
    value: 14972.76,
    change: 156.89,
    changePercent: 1.06,
    data: [14800, 14820, 14810, 14850, 14880, 14860, 14900, 14920, 14940, 14960, 14973]
  }
];

const sampleNews = [
  {
    newsId: '1',
    title: 'NVIDIA announces new AI chip breakthrough, stock surges',
    source: 'Bloomberg',
    time: '15 min ago',
    sentiment: 'bullish' as const,
    tickers: ['NVDA'],
    publishedAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    newsId: '2',
    title: 'Fed signals potential rate cut in Q1 2026',
    source: 'Reuters',
    time: '1 hour ago',
    sentiment: 'bullish' as const,
    tickers: ['SPX', 'DJI'],
    publishedAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    newsId: '3',
    title: 'Tesla faces production challenges in Berlin factory',
    source: 'CNBC',
    time: '2 hours ago',
    sentiment: 'bearish' as const,
    tickers: ['TSLA'],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    newsId: '4',
    title: 'Apple reports record iPhone sales in China',
    source: 'WSJ',
    time: '3 hours ago',
    sentiment: 'bullish' as const,
    tickers: ['AAPL'],
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    newsId: '5',
    title: 'Tech sector rotation continues as investors seek value',
    source: 'MarketWatch',
    time: '4 hours ago',
    sentiment: 'neutral' as const,
    tickers: ['IXIC', 'GOOGL', 'MSFT'],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

const sampleSmartMoneyTrades = [
  {
    tradeId: '1',
    name: 'Nancy Pelosi',
    role: 'Congress' as const,
    ticker: 'NVDA',
    type: 'BUY' as const,
    amount: '$5.0M',
    date: '2025-10-28',
    priceChange: 12.4,
    shares: 5714
  },
  {
    tradeId: '2',
    name: 'Berkshire Hathaway',
    role: 'Hedge Fund' as const,
    ticker: 'AAPL',
    type: 'BUY' as const,
    amount: '$125.0M',
    date: '2025-10-27',
    priceChange: 8.2,
    shares: 657894
  },
  {
    tradeId: '3',
    name: 'Elon Musk',
    role: 'Insider' as const,
    ticker: 'TSLA',
    type: 'SELL' as const,
    amount: '$8.5M',
    date: '2025-10-26',
    priceChange: -2.1,
    shares: 35000
  },
  {
    tradeId: '4',
    name: 'Michael Burry',
    role: 'Hedge Fund' as const,
    ticker: 'GOOGL',
    type: 'BUY' as const,
    amount: '$15.2M',
    date: '2025-10-25',
    priceChange: 5.8,
    shares: 107194
  },
  {
    tradeId: '5',
    name: 'Josh Hawley',
    role: 'Congress' as const,
    ticker: 'MSFT',
    type: 'SELL' as const,
    amount: '$2.3M',
    date: '2025-10-24',
    priceChange: -1.5,
    shares: 6070
  }
];

const sampleMarketData = [
  // Sectors
  { type: 'sector' as const, name: 'Technology', value: 28.5, change: 1.2, changePercent: 4.4 },
  { type: 'sector' as const, name: 'Healthcare', value: 15.3, change: -0.4, changePercent: -2.5 },
  { type: 'sector' as const, name: 'Financials', value: 18.7, change: 0.8, changePercent: 4.5 },
  { type: 'sector' as const, name: 'Consumer', value: 12.4, change: 0.3, changePercent: 2.5 },
  { type: 'sector' as const, name: 'Energy', value: 8.9, change: -1.5, changePercent: -14.4 },
  { type: 'sector' as const, name: 'Industrials', value: 10.2, change: 0.6, changePercent: 6.3 },
  { type: 'sector' as const, name: 'Other', value: 6.0, change: 0.2, changePercent: 3.4 },
  // Global Markets
  { type: 'global' as const, name: 'Shanghai Composite', value: 3245.67, change: 0.45, changePercent: 0.014, status: 'closed' },
  { type: 'global' as const, name: 'FTSE 100', value: 7628.45, change: -0.23, changePercent: -0.003, status: 'closed' },
  { type: 'global' as const, name: 'DAX', value: 16234.89, change: 0.67, changePercent: 0.004, status: 'closed' },
  { type: 'global' as const, name: 'Nikkei 225', value: 32845.12, change: 1.12, changePercent: 0.034, status: 'closed' },
  // Commodities
  { type: 'commodity' as const, name: 'Gold', symbol: 'XAUUSD', price: 2050.45, change: 12.30, changePercent: 0.60 },
  { type: 'commodity' as const, name: 'Crude Oil', symbol: 'CL', price: 78.92, change: -1.23, changePercent: -1.53 },
  { type: 'commodity' as const, name: 'Silver', symbol: 'XAGUSD', price: 24.67, change: 0.45, changePercent: 1.86 },
  // Crypto
  { type: 'crypto' as const, name: 'Bitcoin', symbol: 'BTC', price: 43250.78, change: 1250.45, changePercent: 2.98 },
  { type: 'crypto' as const, name: 'Ethereum', symbol: 'ETH', price: 2580.23, change: 45.67, changePercent: 1.80 },
  { type: 'crypto' as const, name: 'Solana', symbol: 'SOL', price: 98.45, change: 3.21, changePercent: 3.37 }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Stock.deleteMany({});
    await Index.deleteMany({});
    await News.deleteMany({});
    await SmartMoneyTrade.deleteMany({});
    await MarketData.deleteMany({});
    
    // Seed Stocks
    console.log('📈 Seeding stocks...');
    await Stock.insertMany(sampleStocks);
    console.log(`✅ Seeded ${sampleStocks.length} stocks`);
    
    // Seed Indices
    console.log('📊 Seeding indices...');
    await Index.insertMany(sampleIndices);
    console.log(`✅ Seeded ${sampleIndices.length} indices`);
    
    // Seed News
    console.log('📰 Seeding news...');
    await News.insertMany(sampleNews);
    console.log(`✅ Seeded ${sampleNews.length} news items`);
    
    // Seed Smart Money Trades
    console.log('💰 Seeding smart money trades...');
    await SmartMoneyTrade.insertMany(sampleSmartMoneyTrades);
    console.log(`✅ Seeded ${sampleSmartMoneyTrades.length} smart money trades`);
    
    // Seed Market Data
    console.log('🌍 Seeding market data...');
    await MarketData.insertMany(sampleMarketData);
    console.log(`✅ Seeded ${sampleMarketData.length} market data entries`);
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

