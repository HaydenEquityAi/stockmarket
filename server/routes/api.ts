import express from 'express';
import {
  getStocks,
  getStockBySymbol,
  searchStocks,
  getTrendingStocks
} from '../controllers/stockController.js';
import {
  getIndices,
  getSectors,
  getGlobalMarkets,
  getCommodities,
  getCrypto,
  getMarketBreadth
} from '../controllers/marketController.js';
import {
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio,
  getPortfolioHistory
} from '../controllers/portfolioController.js';
import {
  getNews,
  getNewsByStock
} from '../controllers/newsController.js';
import { fetchFinancialNews } from '../services/newsService.js';
import {
  getSmartMoneyTrades,
  getLeaderboard
} from '../controllers/smartMoneyController.js';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from '../controllers/watchlistController.js';
import {
  screenStocks,
  getAISignals,
  getTechnicalIndicators
} from '../controllers/analysisController.js';
import { Index, Stock, News, Portfolio, Position } from '../models/index.js';
import { marketDataProvider, fetchQuotes } from '../services/marketDataProvider.js';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getCurrentUser);

// Dashboard
router.get('/dashboard/overview', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    
    let portfolioData = await Portfolio.findOne({ userId });
    if (!portfolioData) {
      portfolioData = new Portfolio({ userId, holdings: [], totalValue: 0 });
      await portfolioData.save();
    }
    
    const [indices, trendingStocks, news] = await Promise.all([
      Index.find(),
      Stock.find().sort({ changePercent: -1 }).limit(10),
      News.find().sort({ publishedAt: -1 }).limit(20)
    ]);
    
    res.json({ indices, trendingStocks, news, portfolio: portfolioData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Stocks
router.get('/stocks', getStocks);
router.get('/stocks/trending', getTrendingStocks);
router.get('/stocks/search', searchStocks);
router.get('/stocks/:symbol', getStockBySymbol);

// Market
router.get('/market/indices', getIndices);
// Status including API configuration
router.get('/market/status', async (req, res) => {
  const polygonStatus = process.env.POLYGON_API_KEY ? 'configured' : 'missing';
  const finnhubStatus = process.env.FINNHUB_API_KEY ? 'configured' : 'missing';
  res.json({
    apis: { polygon: polygonStatus, finnhub: finnhubStatus },
    pollInterval: marketDataProvider.pollMs,
    timestamp: new Date().toISOString()
  });
});
router.get('/market/sectors', getSectors);
router.get('/market/global', getGlobalMarkets);
router.get('/market/commodities', getCommodities);
router.get('/market/crypto', getCrypto);
router.get('/market/breadth', getMarketBreadth);

// Batch quotes endpoint using polygon/finnhub fallback
router.get('/market/quotes', async (req, res) => {
  try {
    const symbolsParam = (req.query.symbols as string) || '';
    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    if (symbols.length === 0) {
      return res.status(400).json({ error: 'No symbols provided' });
    }
    const quotes = await fetchQuotes(symbols);
    res.json({ quotes, timestamp: new Date().toISOString(), source: quotes.length > 0 ? 'polygon/finnhub' : 'none' });
  } catch (error) {
    console.error('Batch quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Portfolio
router.get('/portfolio', getPortfolio);
router.post('/portfolio/add', addToPortfolio);
router.delete('/portfolio/:symbol', removeFromPortfolio);
router.get('/portfolio/history', getPortfolioHistory);

// Portfolio positions (user-owned holdings with real-time enrichment)
router.get('/portfolio/positions', authenticate, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const positions = await Position.find({ userId });
    const symbols = positions.map((p: any) => p.symbol);
    if (symbols.length === 0) {
      return res.json({ positions: [], summary: { totalValue: 0, totalCost: 0, totalGain: 0, totalGainPercent: 0, positionCount: 0 } });
    }
    const quotes = await marketDataProvider.fetchQuotes(symbols);
    const map: Record<string, any> = {};
    quotes.forEach((q) => { map[q.symbol] = q; });
    const enriched = positions.map((p: any) => {
      const q = map[p.symbol];
      const currentPrice = q?.price ?? p.avgPrice;
      const currentValue = p.quantity * currentPrice;
      const totalCost = p.quantity * p.avgPrice;
      const totalGain = currentValue - totalCost;
      const totalGainPercent = totalCost ? (totalGain / totalCost) * 100 : 0;
      return { ...p.toObject(), currentPrice, currentValue, totalGain, totalGainPercent };
    });
    const totalValue = enriched.reduce((sum: number, p: any) => sum + p.currentValue, 0);
    const totalCost = positions.reduce((sum: number, p: any) => sum + (p.quantity * p.avgPrice), 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost ? (totalGain / totalCost) * 100 : 0;
    res.json({ positions: enriched, summary: { totalValue, totalCost, totalGain, totalGainPercent, positionCount: positions.length } });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

router.post('/portfolio/positions', authenticate, async (req: any, res) => {
  try {
    const { symbol, quantity, avgPrice } = req.body || {};
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!symbol || !quantity || !avgPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const upper = String(symbol).toUpperCase();
    const existing: any = await Position.findOne({ userId, symbol: upper });
    if (existing) {
      const newQuantity = existing.quantity + Number(quantity);
      const newAvgPrice = ((existing.quantity * existing.avgPrice) + (Number(quantity) * Number(avgPrice))) / newQuantity;
      existing.quantity = newQuantity;
      existing.avgPrice = newAvgPrice;
      await existing.save();
      return res.json({ position: existing });
    }
    const position = await Position.create({ userId, symbol: upper, quantity: Number(quantity), avgPrice: Number(avgPrice) });
    res.json({ position });
  } catch (error) {
    console.error('Add position error:', error);
    res.status(500).json({ error: 'Failed to add position' });
  }
});

router.delete('/portfolio/positions/:symbol', authenticate, async (req: any, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await Position.deleteOne({ userId, symbol: String(symbol).toUpperCase() });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

// News (live financial news)
router.get('/news', async (req, res) => {
  try {
    const news = await fetchFinancialNews();
    res.json({ news, timestamp: new Date().toISOString(), count: news.length });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});
router.get('/news/stock/:symbol', getNewsByStock);

// Smart Money
router.get('/smart-money/trades', getSmartMoneyTrades);
router.get('/smart-money/leaderboard', getLeaderboard);

// Watchlist
router.get('/watchlist', authenticate, getWatchlist);
router.post('/watchlist', authenticate, addToWatchlist);
router.delete('/watchlist/:symbol', authenticate, removeFromWatchlist);

// Analysis
router.post('/analysis/screen', screenStocks);
router.get('/analysis/signals', getAISignals);
router.get('/analysis/technical/:symbol', getTechnicalIndicators);

// Prices
router.get('/prices/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quotes = await marketDataProvider.fetchQuotes([symbol.toUpperCase()]);
    if (!quotes || quotes.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json(quotes[0]);
  } catch (error) {
    console.error('Quote fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

router.post('/prices/quotes', async (req, res) => {
  try {
    const { symbols } = req.body || {};
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ error: 'Invalid symbols array' });
    }
    const quotes = await marketDataProvider.fetchQuotes(symbols);
    res.json(quotes);
  } catch (error) {
    console.error('Batch quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

export default router;

