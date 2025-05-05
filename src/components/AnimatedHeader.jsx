import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronUp, Menu, X } from 'lucide-react';
import Logo from './Logo';

function EnhancedModernHeader({ logoInNavbar, activeSection, navItems, isDarkMode, toggleDarkMode }) {
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
      backdropFilter: 'blur(10px)',
      background: isDarkMode 
        ? 'linear-gradient(90deg, rgba(18,18,24,0.98) 0%, rgba(32,24,8,0.98) 100%)'
        : 'linear-gradient(90deg, #fffbe9 0%, #fff7e1 100%)',
      boxShadow: '0 2px 12px 0 rgba(234,179,8,0.07)',
      borderBottom: isDarkMode ? '1px solid #bfa14c22' : '1px solid #eab30822',
    },
    scrolled: {
      backdropFilter: 'blur(18px)',
      background: isDarkMode 
        ? 'linear-gradient(90deg, rgba(18,18,24,0.96) 0%, rgba(40,30,10,0.96) 100%)'
        : 'linear-gradient(90deg, #fffbe9 0%, #ffe6b8 100%)',
      boxShadow: isDarkMode 
        ? '0 4px 24px 0 rgba(234,179,8,0.09), 0 2px 8px rgba(0,0,0,0.18)'
        : '0 4px 24px 0 #ffe06644, 0 2px 8px #eab30811',
      borderBottom: isDarkMode ? '1px solid #bfa14c44' : '1px solid #eab30844',
    }
  };

  // Scroll to top button variants
  const scrollTopVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  // Mobile menu variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  // Mobile menu component
  const MobileMenu = () => (
    <>
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative z-50 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {menuOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className={isDarkMode ? "text-white" : "text-gray-800"} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} className={isDarkMode ? "text-white" : "text-gray-800"} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`fixed inset-0 z-40 ${isDarkMode ? 'bg-black/60' : 'bg-gray-800/40'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className={`absolute top-0 right-0 h-screen w-2/3 max-w-sm p-6 pt-24 ${
                isDarkMode 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-white text-gray-800'
              }`}
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    variants={menuItemVariants}
                    className={`text-xl font-medium ${
                      activeSection === item.name.toLowerCase()
                        ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                        : isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'
                    } transition-colors duration-200`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Handle dark mode toggle button with a modern design
  const DarkModeButton = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          isDarkMode 
            ? 'bg-zinc-800 text-indigo-300' 
            : 'bg-gray-100 text-indigo-600'
        }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Moon size={18} />
            <motion.div 
              className="absolute inset-0 rounded-full bg-indigo-400/20" 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Sun size={18} />
            <motion.div 
              className="absolute inset-0 rounded-full bg-indigo-500/20" 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2] 
              }}
              transition={{ 
                duration: 3,
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
        className={`sticky top-0 w-full z-40 flex items-center justify-between px-5 sm:px-8 py-4 transition-all duration-300
          ${isDarkMode 
            ? 'text-white border-b border-zinc-800/30' 
            : 'text-gray-800 border-b border-gray-200/30'}`}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={headerVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      >
        {/* Logo Section with subtle animation */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="flex items-center"
        >
          <Logo logoInNavbar={logoInNavbar} shouldReduceMotion={shouldReduceMotion} isDarkMode={isDarkMode} />
        </motion.div>

        {/* Main Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <div className="flex gap-2 mr-4">
            {navItems.map((item, idx) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all
                  ${activeSection === item.name.toLowerCase() 
                    ? isDarkMode 
                      ? 'text-gold bg-gradient-to-r from-gold/20 to-orange/20 shadow-gold-glow font-bold' 
                      : 'text-orange bg-gradient-to-r from-gold/20 to-orange/10 shadow-gold-glow font-bold'
                    : isDarkMode 
                      ? 'text-zinc-300 hover:text-gold hover:bg-gold/10' 
                      : 'text-gray-700 hover:text-orange hover:bg-gold/10'
                  }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    delay: idx * 0.05,
                    duration: 0.3
                  } 
                }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
          <DarkModeButton />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <DarkModeButton />
          <MobileMenu />
        </div>
      </motion.header>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className={`fixed bottom-6 right-6 p-3 rounded-full z-30 shadow-lg
              ${isDarkMode 
                ? 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800' 
                : 'bg-white text-indigo-600 hover:bg-gray-50 shadow-indigo-100/50'
              } backdrop-blur-sm`}
            onClick={scrollToTop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={scrollTopVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default EnhancedModernHeader;