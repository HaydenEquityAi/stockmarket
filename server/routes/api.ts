import express from 'express';
import {
  getStocks,
  getStockBySymbol,
  searchStocks,
  getTrendingStocks
} from '../controllers/stockController.js';
import {
  getIndices,
  getMarketStatus,
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
import { Index, Stock, News, Portfolio } from '../models/index.js';
import { marketDataProvider } from '../services/marketDataProvider.js';
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
router.get('/market/status', getMarketStatus);
router.get('/market/sectors', getSectors);
router.get('/market/global', getGlobalMarkets);
router.get('/market/commodities', getCommodities);
router.get('/market/crypto', getCrypto);
router.get('/market/breadth', getMarketBreadth);

// Portfolio
router.get('/portfolio', getPortfolio);
router.post('/portfolio/add', addToPortfolio);
router.delete('/portfolio/:symbol', removeFromPortfolio);
router.get('/portfolio/history', getPortfolioHistory);

// News
router.get('/news', getNews);
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

export default router;

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

