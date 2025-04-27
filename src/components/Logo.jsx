import React from 'react';
import { motion } from 'framer-motion';

function Logo({ logoInNavbar, scrolled, shouldReduceMotion, isDarkMode }) {
  return (
    <div className="flex items-center gap-3 min-h-[40px]">
      {logoInNavbar ? (
        <motion.div
          layoutId="main-logo"
          className="relative flex items-center"
          whileHover={!shouldReduceMotion ? { scale: 1.1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.img
            src="/src/assets/Logo.svg"
            alt="Portfolio Logo"
            className="w-10 h-10 drop-shadow-md"
            whileHover={!shouldReduceMotion ? { rotate: 15, scale: 1.2 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            role="img"
            aria-label="Portfolio Logo"
          />
          <motion.div
            className="absolute -inset-2 rounded-full bg-gold/20 -z-10"
            layoutId="logo-background"
            animate={{ opacity: scrolled ? 0.2 : 0.1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </motion.div>
      ) : (
        <motion.div className="w-10 h-10" />
      )}
      <motion.span
        className={`text-xl font-bold tracking-widest ${isDarkMode ? 'text-gold' : 'text-orange'}`}
        animate={{ opacity: scrolled ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-orange">OUSSEYNE</span> FOLIO
      </motion.span>
    </div>
  );
}

export default Logo;
