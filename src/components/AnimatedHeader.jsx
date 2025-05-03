import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronUp, Settings } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

function EnhancedAnimatedHeader({ logoInNavbar, activeSection, navItems, isDarkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Header variants for animation
  const headerVariants = {
    top: {
      height: '88px',
      boxShadow: isDarkMode 
        ? '0 2px 10px rgba(0,0,0,0.1)' 
        : '0 2px 10px rgba(251,191,36,0.05)',
      background: isDarkMode
        ? 'linear-gradient(90deg, rgba(20,20,25,0.98) 0%, rgba(32,32,38,0.98) 100%)'
        : 'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(250,250,252,0.98) 100%)',
    },
    scrolled: {
      height: '64px',
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(251,191,36,0.1)' 
        : '0 8px 32px rgba(251,191,36,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      background: isDarkMode
        ? 'linear-gradient(90deg, rgba(20,20,25,0.98) 0%, rgba(32,32,38,0.98) 100%)'
        : 'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(250,250,252,0.98) 100%)',
    }
  };

  // Settings panel animation variants
  const settingsPanelVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  // Scroll to top button variants
  const scrollTopVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Handle dark mode toggle button with an interesting glowing effect
  const DarkModeButton = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden
        ${isDarkMode 
          ? 'bg-zinc-800 text-amber-300 hover:bg-zinc-700 hover:text-amber-200' 
          : 'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700'
        } 
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2`}
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
            className="relative"
          >
            <Moon size={18} />
            <motion.div 
              className="absolute inset-0 rounded-full bg-amber-300/20" 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Sun size={18} />
            <motion.div 
              className="absolute inset-0 rounded-full bg-amber-500/20" 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`sticky top-0 w-full z-50 flex items-center justify-between px-4 lg:px-8 py-2 transition-colors duration-300 backdrop-blur-sm
          ${isDarkMode 
            ? 'border-b border-zinc-800/50 text-zinc-200' 
            : 'border-b border-neutral-200 text-zinc-800'}`}
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
                className={`relative font-medium text-base px-4 py-2 rounded-md transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
                  ${activeSection === item.name.toLowerCase() 
                    ? 'text-amber-500 font-semibold' 
                    : isDarkMode 
                      ? 'text-zinc-300 hover:text-amber-400' 
                      : 'text-zinc-700 hover:text-amber-500'
                  }`}
                whileHover={{ 
                  scale: 1.07, 
                  y: -2,
                  transition: { type: 'spring', stiffness: 400 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    delay: idx * 0.05,
                    type: 'spring',
                    stiffness: 400,
                    damping: 20
                  } 
                }}
              >
                {activeSection === item.name.toLowerCase() && (
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full mx-4"
                    layoutId="activeNavIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                {item.name}
              </motion.a>
            ))}
          </AnimatePresence>
        </nav>

        {/* Dark Mode + Mobile Menu */}
        <div className="flex items-center gap-2">
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

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-40
              ${isDarkMode 
                ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700' 
                : 'bg-white text-amber-600 hover:bg-gray-100'
              }`}
            onClick={scrollToTop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={scrollTopVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default EnhancedAnimatedHeader;