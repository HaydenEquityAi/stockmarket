import { Request, Response } from 'express';
import Watchlist from '../models/Watchlist.js';
import { Stock } from '../models/index.js';

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    const symbols = watchlist.map(item => item.symbol);
    const stocks = await Stock.find({ symbol: { $in: symbols } });
    const watchlistWithPrices = watchlist.map(item => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return {
        symbol: item.symbol,
        addedAt: item.addedAt,
        currentPrice: stock?.price || 0,
        change: stock?.change || 0,
        changePercent: stock?.changePercent || 0
      };
    });
    res.json({ watchlist: watchlistWithPrices });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Error fetching watchlist', error });
  }
};

export const addToWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }
    const watchlistItem = await Watchlist.create({ userId, symbol: symbol.toUpperCase() });
    res.status(201).json({ success: true, message: `${symbol.toUpperCase()} added to watchlist`, item: watchlistItem });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Error adding to watchlist', error });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { symbol } = req.params;
    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }
    res.json({ success: true, message: `${symbol.toUpperCase()} removed from watchlist` });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Error removing from watchlist', error });
  }
};

