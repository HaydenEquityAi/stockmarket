import { useMarketData } from '../hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiveStockCardProps {
  symbol: string;
  name: string;
  showChart?: boolean;
}

export function LiveStockCard({ symbol, name, showChart = true }: LiveStockCardProps) {
  const { data, isConnected, isLoading } = useMarketData(symbol);

  const isPositive = !!data && (data.change ?? 0) >= 0;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{symbol}</h3>
            {isConnected && (
              <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{name}</p>
        </div>
        {data && (
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{(data.changePercent ?? 0).toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      ) : data ? (
        <>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${data.price.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{(data.change ?? 0).toFixed(2)}
          </div>
          {showChart && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(data.changePercent || 0) * 10, 100)}%` }}
              />
            </div>
          )}
          {typeof data.volume === 'number' && (
            <div className="mt-2 text-xs text-gray-500">Vol: {data.volume.toLocaleString()}</div>
          )}
        </>
      ) : (
        <div className="text-gray-400">No data available</div>
      )}
    </div>
  );
}


