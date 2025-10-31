import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiveIndexCardProps {
  symbol: string;
  name: string;
}

export function LiveIndexCard({ symbol, name }: LiveIndexCardProps) {
  const { data, isConnected, isLoading } = useMarketData(symbol);
  const isPositive = !!data && (data.change ?? 0) >= 0;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{name}</h3>
        {isConnected && (
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live" />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      ) : data ? (
        <>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{(data.changePercent ?? 0).toFixed(2)}%
            </div>
            <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{(data.change ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(Math.abs(data.changePercent || 0) * 20, 100)}%` }}
            />
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-400">No data</div>
      )}
    </div>
  );
}


