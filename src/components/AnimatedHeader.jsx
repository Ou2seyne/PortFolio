import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { FocusTrap } from '@headlessui/react'; // For focus trapping in mobile menu
import Logo from './Logo'; // Assuming Logo component is well-defined

function EnhancedModernHeader({
  logoInNavbar = true, // Default to true, meaning logo is initially prominent
  activeSection,
  navItems = [], // Provide a default empty array
  isDarkMode,
  toggleDarkMode,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility for mobile menu (Escape key)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const headerBaseStyles = `fixed top-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-3 transition-all duration-300 ease-in-out text-slate-700 dark:text-slate-200`;
  const headerScrolledStyles = `
    bg-white/80 dark:bg-black backdrop-blur-lg h-[70px]
    shadow-md
    dark:shadow-[0_2px_6px_rgba(255,255,255,0.15)]
  `;
  const headerTopStyles = `bg-transparent h-[80px]`;

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        when: 'afterChildren',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: { x: shouldReduceMotion ? 0 : 20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const MobileMenu = () => (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        ref={mobileMenuButtonRef}
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden relative z-[60] p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu-nav"
        whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
        whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {menuOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: shouldReduceMotion ? 0 : -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: shouldReduceMotion ? 0 : 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: shouldReduceMotion ? 0 : 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: shouldReduceMotion ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/50 dark:bg-black/70 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <FocusTrap active={menuOpen}>
              <motion.div
                id="mobile-menu-nav"
                role="dialog"
                aria-modal="true"
                className="absolute top-0 right-0 h-full w-4/5 max-w-xs p-6 pt-20 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex flex-col space-y-5">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      variants={menuItemVariants}
                      className={`block py-2 text-lg font-medium transition-colors duration-200
                        ${
                          activeSection === item.href
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </nav>
              </motion.div>
            </FocusTrap>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const DarkModeButton = () => (
    <motion.button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full 
                   border border-slate-300 dark:border-slate-700 
                   bg-white dark:bg-slate-800 
                   text-slate-700 dark:text-yellow-400 
                   hover:bg-slate-100 dark:hover:bg-slate-700
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
                   transition-colors duration-200`}
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.1, rotate: shouldReduceMotion ? 0 : (isDarkMode ? -15 : 15) }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDarkMode ? 'moon' : 'sun'}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : (isDarkMode ? 10 : -10) }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : (isDarkMode ? -10 : 10) }}
          transition={{ duration: 0.2 }}
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );

  return (
    <header
      ref={headerRef}
      className={`${headerBaseStyles} ${isScrolled ? headerScrolledStyles : headerTopStyles}`}
    >
      {/* Logo Section */}
      <motion.div
        className="flex-shrink-0"
        initial={{ opacity: logoInNavbar ? 1 : 0.7, scale: logoInNavbar ? 1 : 0.95 }}
        animate={{
          opacity: (logoInNavbar || isScrolled) ? 1 : 0.7,
          scale: (logoInNavbar || isScrolled) ? 1 : 0.95,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Logo
          isScrolled={isScrolled}
          shouldReduceMotion={shouldReduceMotion}
          isDarkMode={isDarkMode}
        />
      </motion.div>

      {/* Navigation and Controls */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Desktop Navigation Links */}
        <motion.nav
          className="hidden md:flex items-center space-x-1"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: "easeOut",
            staggerChildren: shouldReduceMotion ? 0 : 0.1,
          }}
        >
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                hover:text-black dark:hover:text-white
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
                ${
                  activeSection === item.href
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
            >
              {item.name}
              {activeSection === item.href && (
                <motion.div
                  layoutId="activeDesktopLinkUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </motion.a>
          ))}
        </motion.nav>

        {/* Dark Mode Toggle */}
        <DarkModeButton />

        {/* Mobile Menu Component */}
        <MobileMenu />
      </div>
    </header>
  );
}

export default EnhancedModernHeader;
