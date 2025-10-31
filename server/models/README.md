# Database Models

This directory contains Mongoose schemas and models for the BrokerAI application.

## Models

- **Stock**: Stock market data including prices, changes, market cap, volume, and price history
- **Index**: Market indices (S&P 500, Dow, Nasdaq) with values and historical data
- **Portfolio**: User portfolios with holdings and performance metrics
- **News**: Financial news articles with sentiment analysis and ticker associations
- **SmartMoneyTrade**: Trades made by Congress, Hedge Funds, and Insiders
- **MarketData**: Sector performance, global markets, commodities, and crypto data
- **Watchlist**: User watchlists containing stock symbols

## Usage

```typescript
import { Stock, Portfolio, News } from './models';

// Create a new stock
const stock = new Stock({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.00,
  // ... other fields
});
```

