import React from 'react';
import { motion } from 'framer-motion';

function DarkModeToggle({ isDarkMode, toggleDarkMode, shouldReduceMotion }) {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-full focus:outline-none focus-visible:ring-2 ring-gold ring-offset-2 transition-colors transition-shadow duration-300
        ${isDarkMode ? 'dark:bg-neutral-900 text-gold shadow-lg' : 'bg-white text-gray-900 shadow-xl'}
      `}
      whileHover={!shouldReduceMotion ? { scale: 1.15 } : {}}
      aria-label={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
      tabIndex={0}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      {/* Animated glowing ring */}
      <motion.span
        className={`absolute inset-0 rounded-full pointer-events-none z-0 transition-shadow duration-500 ${isDarkMode ? 'shadow-[0_0_0_6px_#fbbf2433,0_0_24px_8px_#fbbf24]' : 'shadow-[0_0_0_6px_#fb923c33,0_0_16px_4px_#fb923c]'}`}
        style={{ zIndex: 0 }}
      />
      {/* Animated sun/moon icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 relative z-10"
        key={isDarkMode ? 'moon' : 'sun'}
        initial={{ rotate: isDarkMode ? 90 : -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: isDarkMode ? -90 : 90, scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {isDarkMode ? (
          // Moon icon
          <motion.path
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          // Sun icon
          <>
            <motion.circle
              cx="12" cy="12" r="5"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={i}
                x1={12}
                y1={2}
                x2={12}
                y2={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.8, rotate: i * 45 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: i * 45
                }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </>
        )}
      </motion.svg>
    </motion.button>
  );
}


export default DarkModeToggle;
