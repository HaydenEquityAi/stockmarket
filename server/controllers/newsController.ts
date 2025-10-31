import { Request, Response } from 'express';
import { News } from '../models/index.js';
import { fetchFinancialNews } from '../services/newsService.js';

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await fetchFinancialNews();
    res.json({ news, timestamp: new Date().toISOString(), count: news.length });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

export const getNewsByStock = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const news = await News.find({ tickers: symbol.toUpperCase() })
      .sort({ publishedAt: -1 })
      .limit(10);
    const transformedNews = news.map(item => {
      const newsObj = item.toObject();
      return {
        ...newsObj,
        id: newsObj.newsId || newsObj._id.toString(),
        newsId: undefined
      };
    });
    res.json(transformedNews);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

