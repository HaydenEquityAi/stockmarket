import { ArrowUp, ArrowDown } from 'lucide-react';

interface PriceChangeWidgetProps {
  price: number;
  change: number;
  changePercent: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceChangeWidget({ price, change, changePercent, size = 'md' }: PriceChangeWidgetProps) {
  const isPositive = change >= 0;
  const sizeClasses = {
    sm: 'text-sm',
    md: '',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col gap-1">
      <div className={`font-mono ${sizeClasses[size]}`}>
        ${price.toFixed(2)}
      </div>
      <div className={`flex items-center gap-1 ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
        {isPositive ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )}
        <span className="font-mono">
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
