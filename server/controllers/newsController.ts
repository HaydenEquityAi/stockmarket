import { Request, Response } from 'express';
import { News } from '../models/index.js';

export const getNews = async (req: Request, res: Response) => {
  try {
    const { limit = '20', sentiment, ticker } = req.query;
    
    const query: any = {};
    if (sentiment) query.sentiment = sentiment;
    if (ticker) query.tickers = (ticker as string).toUpperCase();
    
    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit as string));
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getNewsByStock = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const news = await News.find({ 
      tickers: symbol.toUpperCase() 
    }).sort({ publishedAt: -1 }).limit(10);
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

