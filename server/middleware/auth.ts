import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      (req as any).userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' });
  }
};


