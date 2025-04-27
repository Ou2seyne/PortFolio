import React from 'react';
import { motion } from 'framer-motion';

function Navigation({ navItems, activeSection, isDarkMode, shouldReduceMotion }) {
  return (
    <nav className="hidden md:flex gap-6 items-center" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => (
        <motion.a
          key={item.name}
          href={item.href}
          className={`relative font-medium text-sm transition-colors px-2 py-1 rounded-md ${
            activeSection === item.name.toLowerCase()
              ? 'text-gold bg-gold/10'
              : (isDarkMode ? 'text-foreground hover:text-gold' : 'text-gray-700 hover:text-gold')
          }`}
          whileHover={!shouldReduceMotion ? { scale: 1.05, y: -2 } : {}}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
        >
          {item.name}
          {activeSection === item.name.toLowerCase() && (
            <motion.span
              layoutId="activeSection"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </motion.a>
      ))}
    </nav>
  );
}

export default Navigation;
