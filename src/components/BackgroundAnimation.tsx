import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundAnimationProps {
  isDarkMode: boolean;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ isDarkMode }) => {
  // Create an array of circles with random positions
  const circles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 40,
    delay: Math.random() * 2,
    duration: 15 + Math.random() * 15,
    opacity: 0.05 + Math.random() * 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className={`absolute rounded-full ${
            isDarkMode ? 'bg-indigo-500' : 'bg-indigo-400'
          }`}
          style={{
            width: `${circle.size}rem`,
            height: `${circle.size}rem`,
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            opacity: circle.opacity,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.05, 1, 0.95, 1],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: circle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation; 