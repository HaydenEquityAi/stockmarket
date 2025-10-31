import { Request, Response } from 'express';
import { Index, MarketData } from '../models/index.js';

export const getIndices = async (req: Request, res: Response) => {
  try {
    const indices = await Index.find();
    res.json(indices);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getMarketStatus = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = hour >= 9 && hour < 16;
    
    const status = {
      isOpen: isWeekday && isMarketHours,
      message: isWeekday && isMarketHours ? 'Market is open' : 'Market is closed',
      nextOpen: isWeekday && !isMarketHours
        ? 'Opens tomorrow at 9:30 AM EST'
        : 'Opens Monday at 9:30 AM EST'
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getSectors = async (req: Request, res: Response) => {
  try {
    const sectors = await MarketData.find({ type: 'sector' });
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getGlobalMarkets = async (req: Request, res: Response) => {
  try {
    const markets = await MarketData.find({ type: 'global' });
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCommodities = async (req: Request, res: Response) => {
  try {
    const commodities = await MarketData.find({ type: 'commodity' });
    res.json(commodities);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCrypto = async (req: Request, res: Response) => {
  try {
    const crypto = await MarketData.find({ type: 'crypto' });
    res.json(crypto);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getMarketBreadth = async (req: Request, res: Response) => {
  try {
    const breadth = {
      advancing: 1234,
      declining: 876,
      unchanged: 245,
      lastUpdated: new Date()
    };
    res.json(breadth);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

