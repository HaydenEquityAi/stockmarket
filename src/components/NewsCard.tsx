import { NewsItem } from '../lib/mock-data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const sentimentConfig = {
    bullish: { icon: TrendingUp, color: 'text-[#16a34a]', bg: 'bg-[#16a34a]/10', label: 'Bullish' },
    bearish: { icon: TrendingDown, color: 'text-[#dc2626]', bg: 'bg-[#dc2626]/10', label: 'Bearish' },
    neutral: { icon: Minus, color: 'text-[#1e293b]', bg: 'bg-[#e2e8f0]', label: 'Neutral' }
  };

  const config = sentimentConfig[news.sentiment];
  const Icon = config.icon;

  return (
    <div
      className="bg-white rounded-lg p-4 border border-e2e8f0 hover:border-[#2563eb]/20 transition-all duration-200 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h4 className="text-black mb-2 leading-snug">{news.title}</h4>
          <div className="flex items-center gap-2 text-[#1e293b]">
            <span>{news.source}</span>
            <span>•</span>
            <span>{news.time}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded ${config.bg} ${config.color}`}>
          <Icon className="w-3 h-3" />
          <span>{config.label}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {news.tickers.map((ticker) => (
          <span key={ticker} className="px-2 py-1 bg-[#f1f5f9] rounded text-[#1e293b] border border-e2e8f0">
            {ticker}
          </span>
        ))}
      </div>
    </div>
  );
}
