'use client';

import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  audioLevel: number;
  isActive: boolean;
}

export function AudioVisualizer({ audioLevel, isActive }: AudioVisualizerProps) {
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-32">
      {bars.map((i) => {
        const height = isActive
          ? Math.max(10, (audioLevel / 100) * 100 * (0.5 + Math.random() * 0.5))
          : 10;

        return (
          <motion.div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
            animate={{
              height: `${height}%`,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}
