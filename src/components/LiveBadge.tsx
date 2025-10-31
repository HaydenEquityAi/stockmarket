import { motion } from 'motion/react';

export function LiveBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <motion.div
          className="absolute w-2 h-2 bg-[#16a34a] rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="w-2 h-2 bg-[#16a34a] rounded-full relative z-10" />
      </div>
      <span className="text-[#16a34a] uppercase tracking-wide">Live</span>
    </div>
  );
}
