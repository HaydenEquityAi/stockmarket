import { Request, Response } from 'express';
import { Portfolio, Stock } from '../models/index.js';

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    let portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        userId,
        holdings: [],
        totalValue: 0
      });
      await portfolio.save();
    }
    // Update current prices
    for (let holding of portfolio.holdings) {
      const stock = await Stock.findOne({ symbol: holding.symbol });
      if (stock) {
        holding.currentPrice = stock.price;
        holding.totalValue = holding.shares * stock.price;
        holding.gain = holding.totalValue - (holding.shares * holding.avgCost);
        holding.gainPercent = (holding.gain / (holding.shares * holding.avgCost)) * 100;
      }
    }
    portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addToPortfolio = async (req: Request, res: Response) => {
  try {
    const { userId = 'default-user', symbol, shares, avgCost } = req.body;
    
    if (!symbol || !shares || !avgCost) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId, holdings: [], totalValue: 0 });
    }
    const existingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol.toUpperCase());
    
    if (existingIndex >= 0) {
      const existing = portfolio.holdings[existingIndex];
      const totalShares = existing.shares + shares;
      const newAvgCost = ((existing.shares * existing.avgCost) + (shares * avgCost)) / totalShares;
      
      portfolio.holdings[existingIndex] = {
        symbol: symbol.toUpperCase(),
        name: stock.name,
        shares: totalShares,
        avgCost: newAvgCost,
        currentPrice: stock.price,
        totalValue: totalShares * stock.price,
        gain: (totalShares * stock.price) - (totalShares * newAvgCost),
        gainPercent: ((totalShares * stock.price) - (totalShares * newAvgCost)) / (totalShares * newAvgCost) * 100,
        data: stock.data
      };
    } else {
      portfolio.holdings.push({
        symbol: symbol.toUpperCase(),
        name: stock.name,
        shares,
        avgCost,
        currentPrice: stock.price,
        totalValue: shares * stock.price,
        gain: (shares * stock.price) - (shares * avgCost),
        gainPercent: ((shares * stock.price) - (shares * avgCost)) / (shares * avgCost) * 100,
        data: stock.data
      });
    }
    portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeFromPortfolio = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const userId = (req.query.userId as string) || 'default-user';
    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol.toUpperCase());
    portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
    
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getPortfolioHistory = async (req: Request, res: Response) => {
  try {
    const history = [];
    const baseValue = 250000;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomChange = (Math.random() - 0.45) * 5000;
      
      history.push({
        date: date.toLocaleDateString(),
        value: baseValue + (randomChange * (30 - i))
      });
    }
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

