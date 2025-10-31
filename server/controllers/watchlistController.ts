import { Request, Response } from 'express';
import { Watchlist, Stock } from '../models/index.js';

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    let watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      watchlist = new Watchlist({ userId, stocks: [] });
      await watchlist.save();
    }
    const stocks = await Stock.find({ symbol: { $in: watchlist.stocks } });
    
    res.json({ watchlist: watchlist.stocks, stocks });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addToWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId = 'default-user', symbol } = req.body;
    
    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, stocks: [] });
    }
    if (!watchlist.stocks.includes(symbol.toUpperCase())) {
      watchlist.stocks.push(symbol.toUpperCase());
      await watchlist.save();
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const userId = (req.query.userId as string) || 'default-user';
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    watchlist.stocks = watchlist.stocks.filter(s => s !== symbol.toUpperCase());
    await watchlist.save();
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

