import { Request, Response } from 'express';
import Watchlist from '../models/Watchlist.js';
import { Stock } from '../models/index.js';

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    const symbols = watchlist.map(item => item.symbol);
    
    // Return symbols array for watchlist endpoint
    res.json({ symbols });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Error fetching watchlist', error });
  }
};

export const addToWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    const upperSymbol = symbol.toUpperCase();
    const existing = await Watchlist.findOne({ userId, symbol: upperSymbol });
    if (existing) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }
    await Watchlist.create({ userId, symbol: upperSymbol });
    const watchlist = await Watchlist.find({ userId });
    const symbols = watchlist.map(item => item.symbol);
    res.status(201).json({ success: true, message: `${upperSymbol} added to watchlist`, symbols });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Error adding to watchlist', error });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { symbol } = req.params;
    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }
    const watchlist = await Watchlist.find({ userId });
    const symbols = watchlist.map(item => item.symbol);
    res.json({ success: true, message: `${symbol.toUpperCase()} removed from watchlist`, symbols });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Error removing from watchlist', error });
  }
};
