import { Request, Response } from 'express';
import { SmartMoneyTrade } from '../models/index.js';

export const getSmartMoneyTrades = async (req: Request, res: Response) => {
  try {
    const { role, limit = '20' } = req.query;
    
    const query: any = {};
    if (role) query.role = role;
    
    const trades = await SmartMoneyTrade.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit as string));
    
    // Transform tradeId to id for frontend compatibility
    const transformedTrades = trades.map(item => {
      const tradeObj = item.toObject();
      return {
        ...tradeObj,
        id: tradeObj.tradeId,
        tradeId: undefined
      };
    });
    
    res.json(transformedTrades);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = [
      { rank: 1, name: 'Nancy Pelosi', trades: 47, success: 92.3, gain: '+$45.2M' },
      { rank: 2, name: 'Berkshire Hathaway', trades: 156, success: 87.5, gain: '+$2.4B' },
      { rank: 3, name: 'Elon Musk', trades: 23, success: 78.2, gain: '+$156M' },
      { rank: 4, name: 'Michael Burry', trades: 34, success: 85.1, gain: '+$234M' },
      { rank: 5, name: 'Josh Hawley', trades: 28, success: 76.8, gain: '+$12.5M' }
    ];
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

