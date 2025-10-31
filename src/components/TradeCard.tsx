import { motion } from 'motion/react';
import { Trade } from '../lib/mock-data';
import { TrendingUp, TrendingDown, Copy } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
}

export function TradeCard({ trade }: TradeCardProps) {
  const isBuy = trade.type === 'BUY';
  const isGain = trade.priceChange >= 0;

  return (
    <motion.div
      className="bg-white rounded-xl p-5 border border-e2e8f0 hover:border-[#2563eb]/20 transition-all duration-300 shadow-sm hover:shadow-md"
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-black mb-1">{trade.name}</div>
          <div className="text-[#1e293b]">{trade.role}</div>
        </div>
        <div className={`px-3 py-1 rounded ${isBuy ? 'bg-[#16a34a]/20 text-[#16a34a]' : 'bg-[#dc2626]/20 text-[#dc2626]'}`}>
          {trade.type}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[#1e293b] mb-1">Ticker</div>
          <div className="text-black font-mono">{trade.ticker}</div>
        </div>
        <div>
          <div className="text-[#1e293b] mb-1">Amount</div>
          <div className="text-black font-mono">{trade.amount}</div>
        </div>
        <div>
          <div className="text-[#1e293b] mb-1">Date</div>
          <div className="text-[#1e293b]">{trade.date}</div>
        </div>
        <div>
          <div className="text-[#1e293b] mb-1">Change Since</div>
          <div className={`flex items-center gap-1 ${isGain ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-mono">{isGain ? '+' : ''}{trade.priceChange}%</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
        <Copy className="w-4 h-4" />
        Copy Trade
      </button>
    </motion.div>
  );
}
