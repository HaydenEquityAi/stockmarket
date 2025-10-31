import { useEffect, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface MarketData {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  timestamp: number;
}

export function useMarketData(symbol: string) {
  const [data, setData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ws: WebSocket | null = null;

    async function fetchInitialQuote() {
      try {
        const response = await fetch(`${API_URL}/prices/quote/${symbol}`);
        if (response.ok) {
          const quote = await response.json();
          setData(quote);
        }
      } catch (error) {
        console.error('Error fetching initial quote:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialQuote();

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setIsConnected(true);
      ws!.send(JSON.stringify({ type: 'subscribe', symbol: symbol.toUpperCase() }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'price_update' && message.symbol === symbol.toUpperCase()) {
          setData({
            symbol: message.symbol,
            price: message.price,
            change: message.change,
            changePercent: message.changePercent,
            volume: message.volume,
            timestamp: message.timestamp
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      try {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol.toUpperCase() }));
        }
      } catch {}
      ws?.close();
    };
  }, [symbol]);

  return { data, isConnected, isLoading };
}


