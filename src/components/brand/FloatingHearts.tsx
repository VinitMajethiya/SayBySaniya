import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Doodle } from './Doodle';

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  count = 6,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${15 + (i * 70) / count + (Math.sin(i) * 10)}%`,
      size: 14 + (i % 3) * 6,
      duration: 5 + (i % 3) * 2,
      delay: i * 0.8,
    }));
  }, [count]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-4 text-heart opacity-70"
          style={{ left: heart.left }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: [-10, -180],
            opacity: [0, 0.75, 0],
            scale: [0.6, 1, 0.8],
            x: [0, (heart.id % 2 === 0 ? 15 : -15), 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'easeInOut',
          }}
        >
          <Doodle name="heart" size={heart.size} color="var(--heart)" />
        </motion.div>
      ))}
    </div>
  );
};
