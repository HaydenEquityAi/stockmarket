import { Request, Response } from 'express';
import { Stock } from '../models/index.js';

export const screenStocks = async (req: Request, res: Response) => {
  try {
    const { marketCap, priceChange, volume, sector } = req.body;
    
    const query: any = {};
    
    if (priceChange) {
      if (priceChange === 'up>1') query.changePercent = { $gt: 1 };
      if (priceChange === 'up>5') query.changePercent = { $gt: 5 };
      if (priceChange === 'down>1') query.changePercent = { $lt: -1 };
    }
    
    if (sector && sector !== 'All') {
      query.sector = sector;
    }
    
    const stocks = await Stock.find(query).limit(50);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAISignals = async (req: Request, res: Response) => {
  try {
    const signals = [
      {
        ticker: 'NVDA',
        signal: 'Strong Buy',
        confidence: 92,
        reason: 'Momentum breakout with high volume',
        type: 'bullish'
      },
      {
        ticker: 'AAPL',
        signal: 'Buy',
        confidence: 78,
        reason: 'Oversold RSI with positive divergence',
        type: 'bullish'
      },
      {
        ticker: 'MSFT',
        signal: 'Hold',
        confidence: 65,
        reason: 'Trading in neutral range',
        type: 'neutral'
      },
      {
        ticker: 'TSLA',
        signal: 'Strong Buy',
        confidence: 85,
        reason: 'Golden cross pattern forming',
        type: 'bullish'
      }
    ];
    
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTechnicalIndicators = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    const indicators = {
      rsi: 67.5,
      macd: 'Bullish',
      movingAverage: 'Above 50-day',
      support: 850.00,
      resistance: 900.00,
      momentum: 'Bullish',
      trend: 'Strong Uptrend',
      volume: 'Above Average'
    };
    
    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

