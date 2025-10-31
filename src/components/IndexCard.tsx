import { motion } from 'motion/react';
import { Index } from '../lib/mock-data';
import { MiniChart } from './MiniChart';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface IndexCardProps {
  index: Index;
}

export function IndexCard({ index }: IndexCardProps) {
  const isPositive = index.change >= 0;

  return (
    <motion.div
      className="bg-white rounded-xl p-6 border border-e2e8f0 hover:border-[#2563eb]/20 transition-all duration-300 shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[#1e293b] mb-1">{index.name}</div>
          <div className="font-mono text-black">{index.value.toLocaleString()}</div>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="font-mono">
            {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      <MiniChart data={index.data} />
      <div className={`mt-3 font-mono ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
        {isPositive ? '+' : ''}{index.change.toFixed(2)}
      </div>
    </motion.div>
  );
}
