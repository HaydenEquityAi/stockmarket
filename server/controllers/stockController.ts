import { Request, Response } from 'express';
import { Stock } from '../models/index.js';

export const getStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await Stock.find().sort({ volume: -1 }).limit(50);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTrendingStocks = async (req: Request, res: Response) => {
  try {
    const trending = await Stock.find().sort({ changePercent: -1 }).limit(10);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const searchStocks = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getStockBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

