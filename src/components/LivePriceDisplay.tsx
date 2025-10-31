import { useMarketData } from '../hooks/useMarketData';

interface LivePriceDisplayProps {
  symbol: string;
  className?: string;
}

export function LivePriceDisplay({ symbol, className = '' }: LivePriceDisplayProps) {
  const { data, isLoading } = useMarketData(symbol);

  if (isLoading) {
    return <span className={`animate-pulse ${className}`}>--</span>;
  }

  if (!data) {
    return <span className={className}>--</span>;
  }

  return (
    <span className={className}>
      ${data.price.toFixed(2)}
    </span>
  );
}


