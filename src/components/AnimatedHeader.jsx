import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Logo from './Logo';

function EnhancedModernHeader({ logoInNavbar, activeSection, navItems, isDarkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    top: {
      backdropFilter: 'blur(0px)',
      background: 'transparent',
      boxShadow: 'none',
      height: '80px',
    },
    scrolled: {
      backdropFilter: 'blur(18px)',
      background: isDarkMode 
      ? '#1E1E1E'
      : '#F5F5F5',
      boxShadow: 'none',
      height: '80px',
    }
  };

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
                    } transition-all duration-200`}
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
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          isDarkMode 
            ? 'bg-black text-white border border-white/20' 
            : 'bg-white text-black border border-black/20'
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed top-0 w-full z-40 flex items-center justify-between px-5 sm:px-8 py-4 transition-all duration-200
          ${isDarkMode 
            ? 'text-white' 
            : 'text-black'}`}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={headerVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      >
        {/* Logo Section */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: isScrolled ? 1 : logoInNavbar ? 1 : 0.6,
            scale: isScrolled ? 1 : 0.95
          }}
          transition={{ duration: 0.4 }}
        >
          <Logo logoInNavbar={logoInNavbar || isScrolled} shouldReduceMotion={shouldReduceMotion} isDarkMode={isDarkMode} />
        </motion.div>

        {/* Main Navigation - Desktop */}
        <div className="flex items-center space-x-4">
          {/* Nav Links - Desktop */}
          <motion.nav 
            className="hidden md:flex items-center gap-2 mr-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isScrolled ? 1 : 0,
              x: isScrolled ? 0 : 20,
              pointerEvents: isScrolled ? 'auto' : 'none'
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1
            }}
          >
            {navItems.map((item, idx) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${isDarkMode ? 'border border-white/20 ' : 'border border-black/20'} 
                  ${activeSection === item.name.toLowerCase() 
                    ? isDarkMode 
                      ? 'text-white bg-black/20 shadow-gold-glow font-bold' 
                      : 'text-black bg-white/20 shadow-gold-glow font-bold'
                    : isDarkMode 
                      ? 'text-white hover:bg-white hover:text-black' 
                      : 'text-black hover:bg-black hover:text-white'
                  }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1,
                  y: 0
                }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.1 + (idx * 0.05)
                }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.nav>

          {/* Dark Mode Toggle - Always Visible */}
          <DarkModeButton />

          {/* Mobile Menu Trigger - Only Visible When Scrolled on Mobile */}
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isScrolled ? 1 : 0,
              pointerEvents: isScrolled ? 'auto' : 'none'
            }}
            transition={{ duration: 0.3 }}
          >
            <MobileMenu />
          </motion.div>
        </div>
      </motion.header>
    </>
  );
}
export default EnhancedModernHeader;