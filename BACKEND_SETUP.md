# BrokerAI Backend Setup Guide

## ✅ What's Been Completed

### 1. **Backend Structure** ✅
- Complete TypeScript backend with Express
- MongoDB integration with Mongoose
- WebSocket support for real-time updates
- All API endpoints configured

### 2. **Fixed Field Name Mismatches** ✅
- `newsController.ts` - Transforms `newsId` → `id` for frontend compatibility
- `smartMoneyController.ts` - Transforms `tradeId` → `id` for frontend compatibility

### 3. **Frontend API Service Layer** ✅
- Created `src/lib/api.ts` with all API methods
- Organized by feature (stocks, market, portfolio, news, etc.)
- Error handling included
- Uses `VITE_API_URL` environment variable (defaults to `http://localhost:5000/api`)

### 4. **Data Seeding Script** ✅
- Created `server/scripts/seed.ts`
- Seeds sample data for all models (stocks, indices, news, trades, market data)

### 5. **CORS Configuration** ✅
- Updated to use `FRONTEND_URL` from `.env`
- Configured for credentials support

---

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Ensure it's running on `mongodb://localhost:27017/brokerai`

**Option B: MongoDB Atlas (Cloud)**
- Update `MONGODB_URI` in `server/.env` with your Atlas connection string

### Step 3: Seed the Database

```bash
cd server
npm run seed
```

This will populate your database with sample data.

### Step 4: Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000` (or your configured `PORT`).

---

## 📝 Environment Variables

The `server/.env` file should contain:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/brokerai
FRONTEND_URL=http://localhost:5173
```

**Important:** If you're using MongoDB Atlas or a different MongoDB instance, update `MONGODB_URI` accordingly.

---

## 🔌 Frontend Integration

### Using the API Service

The frontend API service is ready to use. Example:

```typescript
import { api } from './lib/api';

// Get all stocks
const stocks = await api.stocks.getAll();

// Get trending stocks
const trending = await api.stocks.getTrending();

// Get portfolio
const portfolio = await api.portfolio.get('default-user');

// Get news
const news = await api.news.getAll({ limit: 10 });

// Add to portfolio
await api.portfolio.add({
  userId: 'default-user',
  symbol: 'AAPL',
  shares: 100,
  avgCost: 175.50
});
```

### Environment Variable for Frontend

Create or update `.env` in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

This allows you to change the API URL without modifying code.

---

## 📊 API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/trending` - Get trending stocks
- `GET /api/stocks/search?q={query}` - Search stocks
- `GET /api/stocks/:symbol` - Get stock by symbol

### Market
- `GET /api/market/indices` - Get market indices
- `GET /api/market/status` - Get market status
- `GET /api/market/sectors` - Get sector performance
- `GET /api/market/global` - Get global markets
- `GET /api/market/commodities` - Get commodities
- `GET /api/market/crypto` - Get crypto markets
- `GET /api/market/breadth` - Get market breadth

### Portfolio
- `GET /api/portfolio?userId={userId}` - Get portfolio
- `POST /api/portfolio/add` - Add to portfolio
- `DELETE /api/portfolio/:symbol?userId={userId}` - Remove from portfolio
- `GET /api/portfolio/history?userId={userId}` - Get portfolio history

### News
- `GET /api/news?limit={limit}&sentiment={sentiment}&ticker={ticker}` - Get news
- `GET /api/news/stock/:symbol` - Get news by stock

### Smart Money
- `GET /api/smart-money/trades?role={role}&limit={limit}` - Get trades
- `GET /api/smart-money/leaderboard` - Get leaderboard

### Watchlist
- `GET /api/watchlist?userId={userId}` - Get watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `DELETE /api/watchlist/:symbol?userId={userId}` - Remove from watchlist

### Analysis
- `POST /api/analysis/screen` - Screen stocks
- `GET /api/analysis/signals` - Get AI signals
- `GET /api/analysis/technical/:symbol` - Get technical indicators

### Dashboard
- `GET /api/dashboard/overview?userId={userId}` - Get dashboard overview

---

## 🔧 Next Steps

1. **Test the Backend:**
   - Start the server: `cd server && npm run dev`
   - Test endpoints with Postman or curl
   - Verify database connection

2. **Update Frontend to Use API:**
   - Replace `mock-data.ts` imports with `api` calls
   - Add error handling and loading states
   - Update components to fetch data from backend

3. **Optional Enhancements:**
   - Add authentication/authorization
   - Add rate limiting
   - Add request validation
   - Add API documentation (Swagger/OpenAPI)

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### CORS Issues
- Ensure `FRONTEND_URL` matches your frontend URL
- Check browser console for CORS errors

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### TypeScript Errors
- Run `npm install` in the server directory
- Check `tsconfig.json` configuration

---

## 📚 Additional Notes

- The backend uses ES modules (`type: "module"`)
- All imports use `.js` extension (required for ES modules)
- WebSocket server runs on the same port as HTTP server
- Price updates are simulated every 5 seconds via WebSocket

---

## 🎉 You're All Set!

The backend is ready to use. Start the server, seed the database, and begin integrating with your frontend!

