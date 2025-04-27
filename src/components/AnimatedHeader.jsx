import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

function UniqueAnimatedHeader({ logoInNavbar, activeSection, navItems, isDarkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef(null);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header variants for animation
  const headerVariants = {
    top: {
      height: '88px',
      boxShadow: isDarkMode 
        ? '0 2px 10px rgba(0,0,0,0.1)' 
        : '0 2px 10px rgba(251,191,36,0.05)',
      background: isDarkMode
        ? 'linear-gradient(90deg, rgba(20,20,25,0.95) 0%, rgba(32,32,38,0.95) 100%)'
        : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(250,250,252,0.95) 100%)',
    },
    scrolled: {
      height: '64px',
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(251,191,36,0.1)' 
        : '0 8px 32px rgba(251,191,36,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      background: isDarkMode
        ? 'linear-gradient(90deg, rgba(20,20,25,0.95) 0%, rgba(32,32,38,0.95) 100%)'
        : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(250,250,252,0.95) 100%)',
    }
  };

  // Handle dark mode toggle button with an interesting glowing effect
  const DarkModeButton = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden
        ${isDarkMode 
          ? 'bg-zinc-800/80 text-amber-300 hover:bg-zinc-800' 
          : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
        } 
        transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <motion.header
      ref={headerRef}
      className={`sticky top-0 w-full z-50 flex items-center justify-between px-4 lg:px-8 py-2 transition-colors duration-300 
        ${isDarkMode ? 'border-b border-zinc-800/50 dark:border-gold/10' : 'border-b border-neutral-200'}`}
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      variants={headerVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.3 }}
    >
      {/* Logo Section with hover animation */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="flex items-center"
      >
        <Logo logoInNavbar={logoInNavbar} shouldReduceMotion={shouldReduceMotion} isDarkMode={isDarkMode} />
      </motion.div>

      {/* Main Navigation - Desktop */}
      <nav className="hidden md:flex gap-1 items-center">
        <AnimatePresence>
          {navItems.map((item, idx) => (
            <motion.a
              key={item.name}
              href={item.href}
              className={`relative font-medium text-base px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 ring-gold/70 ring-offset-1 
                ${activeSection === item.name.toLowerCase() ? 'text-gold font-semibold' : 
                isDarkMode ? 'text-zinc-200 hover:text-gold/90' : 'text-zinc-700 hover:text-gold'}`}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
            >
              {item.name}
            </motion.a>
          ))}
        </AnimatePresence>
      </nav>

      {/* Dark Mode + Mobile Menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        <DarkModeButton />
        <div className="md:hidden ml-1">
          <MobileMenu 
            menuOpen={menuOpen} 
            setMenuOpen={setMenuOpen} 
            isDarkMode={isDarkMode} 
            navItems={navItems} 
            activeSection={activeSection} 
          />
        </div>
      </div>
    </motion.header>
  );
}

export default UniqueAnimatedHeader;
