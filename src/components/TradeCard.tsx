import { Trade } from '../lib/mock-data';
import { TrendingUp, TrendingDown, Copy } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
}

export function TradeCard({ trade }: TradeCardProps) {
  const isBuy = trade.type === 'BUY';
  const isGain = trade.priceChange >= 0;

  return (
    <div
      className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-5 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-white font-bold mb-1">{trade.name}</div>
          <div className="text-slate-400 text-sm">{trade.role}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isBuy 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {trade.type}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-slate-400 mb-1 text-sm">Ticker</div>
          <div className="text-white font-mono font-bold text-lg">{trade.ticker}</div>
        </div>
        <div>
          <div className="text-slate-400 mb-1 text-sm">Amount</div>
          <div className="text-white font-mono font-bold">{trade.amount}</div>
        </div>
        <div>
          <div className="text-slate-400 mb-1 text-sm">Date</div>
          <div className="text-slate-300">{trade.date}</div>
        </div>
        <div>
          <div className="text-slate-400 mb-1 text-sm">Change Since</div>
          <div className={`flex items-center gap-1 font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
            {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-mono">{isGain ? '+' : ''}{trade.priceChange}%</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-emerald-500/30">
        <Copy className="w-4 h-4" />
        Copy Trade
      </button>
    </div>
  );
}
