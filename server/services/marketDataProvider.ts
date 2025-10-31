import dotenv from 'dotenv';

dotenv.config();

const provider = (process.env.MARKET_DATA_PROVIDER || 'polygon').toLowerCase();
const pollMs = parseInt(process.env.MARKET_DATA_POLL_MS || '60000', 10);

export type Quote = {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  timestamp: number;
};

async function fetchPolygonQuotes(symbols: string[]): Promise<Quote[]> {
  const key = process.env.POLYGON_API_KEY;
  if (!key) {
    console.error('Polygon API key not found');
    return [];
  }

  const out: Quote[] = [];

  for (const symbol of symbols) {
    try {
      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/prev?adjusted=true&apiKey=${key}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Polygon API error for ${symbol}:`, res.statusText);
        continue;
      }
      const data = await res.json();
      if (data?.results?.[0]) {
        const result = data.results[0];
        out.push({
          symbol: symbol.toUpperCase(),
          price: result.c,
          change: result.c - result.o,
          changePercent: ((result.c - result.o) / result.o) * 100,
          volume: result.v,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error(`Error fetching ${symbol} from Polygon:`, error);
    }
  }

  return out;
}

async function fetchFinnhubQuotes(symbols: string[]): Promise<Quote[]> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    console.error('Finnhub API key not found');
    return [];
  }

  const out: Quote[] = [];

  for (const symbol of symbols) {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${key}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Finnhub API error for ${symbol}:`, res.statusText);
        continue;
      }
      const data = await res.json();
      if (typeof data?.c === 'number') {
        out.push({
          symbol: symbol.toUpperCase(),
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error(`Error fetching ${symbol} from Finnhub:`, error);
    }
  }

  return out;
}

export const marketDataProvider = {
  pollMs,
  async fetchQuotes(symbols: string[]): Promise<Quote[]> {
    if (!symbols.length) return [];
    console.log(`Fetching quotes for: ${symbols.join(', ')}`);
    try {
      if (provider === 'polygon') {
        return await fetchPolygonQuotes(symbols);
      } else if (provider === 'finnhub') {
        return await fetchFinnhubQuotes(symbols);
      }
    } catch (error) {
      console.error('Market data provider error:', error);
      if (provider === 'polygon') {
        console.log('Falling back to Finnhub...');
        return await fetchFinnhubQuotes(symbols);
      }
    }
    return [];
  }
};

// Named export wrapper for routes that want a function import
export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  return marketDataProvider.fetchQuotes(symbols);
}


