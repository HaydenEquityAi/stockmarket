import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const WS_URL = 'wss://backend.brokerai.ai:8088';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);
    return () => ws.close();
  }, []);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
      isConnected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
      {isConnected ? 'LIVE' : 'DISCONNECTED'}
    </div>
  );
}


