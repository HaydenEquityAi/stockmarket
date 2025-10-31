import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import { connectDB } from './db/connection.js';
import apiRoutes from './routes/api.js';

dotenv.config({ path: './server/.env' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// WebSocket
wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'subscribe') {
        console.log(`📊 Client subscribed to ${data.symbol}`);
        (ws as any).symbol = data.symbol;
      }
      
      if (data.type === 'unsubscribe') {
        console.log(`❌ Client unsubscribed from ${data.symbol}`);
        (ws as any).symbol = null;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 Client disconnected');
  });
  
  const heartbeat = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'heartbeat', timestamp: new Date() }));
    } else {
      clearInterval(heartbeat);
    }
  }, 30000);
});

// Simulate price updates
setInterval(() => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META'];
  
  symbols.forEach(symbol => {
    const priceChange = (Math.random() - 0.5) * 2;
    
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN && (client as any).symbol === symbol) {
        client.send(JSON.stringify({
          type: 'price_update',
          symbol,
          priceChange,
          timestamp: new Date()
        }));
      }
    });
  });
}, 5000);

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

