import express from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { connectDB } from './db/connection.js';
import apiRoutes from './routes/api.js';
import { marketDataProvider } from './services/marketDataProvider.js';
import { Stock } from './models/index.js';

dotenv.config({ path: './server/.env' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
const allowedOrigins = [
  'https://www.brokerai.ai',
  'https://brokerai.ai',
  'https://stockmarket-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Real-time WS subscriptions
type ClientWithMeta = WebSocket & { symbol?: string };
const subscriptions = new Map<ClientWithMeta, string>();

wss.on('connection', (ws) => {
  const client = ws as ClientWithMeta;
  console.log('🔌 New WebSocket client connected');

  ws.on('message', (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'subscribe' && data.symbol) {
        const symbol = String(data.symbol).toUpperCase();
        client.symbol = symbol;
        subscriptions.set(client, symbol);
        console.log(`📊 Client subscribed to ${client.symbol}`);
        ws.send(JSON.stringify({ type: 'subscribed', symbol: client.symbol, message: `Subscribed to ${client.symbol}` }));
      }

      if (data.type === 'unsubscribe') {
        const symbol = client.symbol || 'unknown';
        console.log(`❌ Client unsubscribed from ${symbol}`);
        subscriptions.delete(client);
        client.symbol = undefined;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    subscriptions.delete(client);
    console.log('🔌 Client disconnected');
  });

  const heartbeat = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'heartbeat', timestamp: new Date(), subscribedTo: client.symbol || null }));
    } else {
      clearInterval(heartbeat);
    }
  }, 30000);
});

// Poll market data and broadcast
setInterval(async () => {
  try {
    const symbols = Array.from(new Set(Array.from(subscriptions.values()).filter(Boolean)));
    if (!symbols.length) return;

    console.log(`Polling market data for ${symbols.length} symbols...`);
    const quotes = await marketDataProvider.fetchQuotes(symbols);
    if (!quotes.length) {
      console.log('No quotes received');
      return;
    }

    console.log(`Received ${quotes.length} quotes`);
    for (const quote of quotes) {
      try {
        await Stock.updateOne(
          { symbol: quote.symbol },
          { $set: { price: quote.price, change: quote.change, changePercent: quote.changePercent, volume: quote.volume, lastUpdated: new Date() } },
          { upsert: true }
        );
      } catch (dbError) {
        console.error(`Database update error for ${quote.symbol}:`, dbError);
      }

      wss.clients.forEach((client) => {
        const c = client as ClientWithMeta;
        if (client.readyState === client.OPEN && c.symbol === quote.symbol) {
          client.send(JSON.stringify({
            type: 'price_update',
            symbol: quote.symbol,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
            volume: quote.volume,
            timestamp: quote.timestamp
          }));
        }
      });
    }
  } catch (err) {
    console.error('Polling error:', err);
  }
}, marketDataProvider.pollMs);

console.log(`📊 Market data polling started (${marketDataProvider.pollMs}ms interval)`);
const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META'];
console.log(`📈 Tracking ${defaultSymbols.length} default symbols`);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

