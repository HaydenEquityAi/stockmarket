import { motion } from 'motion/react';
import { Stock } from '../lib/mock-data';
import { MiniChart } from './MiniChart';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      className="bg-white rounded-xl p-4 border border-e2e8f0 hover:border-[#2563eb]/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-black mb-1">{stock.symbol}</div>
          <div className="text-[#1e293b]">{stock.name}</div>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span className="font-mono">
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="font-mono text-black mb-3">
        ${stock.price.toFixed(2)}
      </div>
      <MiniChart data={stock.data} height={30} />
      <div className={`mt-2 font-mono ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
        {isPositive ? '+' : ''}${stock.change.toFixed(2)}
      </div>
    </motion.div>
  );
}
