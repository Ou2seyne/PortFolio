import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

function Navigation({ navItems, activeSection, isDarkMode, shouldReduceMotion }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [menuExpanded, setMenuExpanded] = useState(false);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  
  // Audio feedback for interactions
  const playSound = (type) => {
    if (shouldReduceMotion) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    switch(type) {
      case 'hover':
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gain.gain.value = 0.05;
        break;
      case 'click':
        oscillator.type = 'triangle';
        oscillator.frequency.value = 660;
        gain.gain.value = 0.1;
        break;
      default:
        oscillator.type = 'sine';
        oscillator.frequency.value = 220;
        gain.gain.value = 0.03;
    }
    
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
    oscillator.stop(ctx.currentTime + 0.2);
  };
  
  // Track mouse movement for hover effects
  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !navRef.current) return;
    const { clientX, clientY } = e;
    const rect = navRef.current.getBoundingClientRect();
    setMousePosition({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };
  
  // Smooth indicator animations and positioning
  const smoothX = useSpring(0, { stiffness: 300, damping: 30 });
  const smoothWidth = useSpring(0, { stiffness: 300, damping: 30 });
  
  useEffect(() => {
    // Update indicator position when active section changes
    if (indicatorRef.current && navRef.current) {
      const activeItem = navRef.current.querySelector(`[aria-current="page"]`);
      if (activeItem) {
        const { left, width } = activeItem.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        smoothX.set(left - navRect.left);
        smoothWidth.set(width);
      }
    }
  }, [activeSection, smoothX, smoothWidth]);
  
  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 }
  };
  
  // Enhanced glowing effect for active item
  const glowVariants = {
    idle: { opacity: 0.7, scale: 1 },
    hover: { opacity: 1, scale: 1.2 }
  };
  
  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className="hidden md:flex gap-6 items-center relative"
        role="navigation"
        aria-label="Main navigation"
        ref={navRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Background glow effect */}
        <motion.div 
          className="absolute w-4 h-4 rounded-full blur-xl pointer-events-none z-0"
          style={{ 
            background: isDarkMode ? 
              'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(234,179,8,0) 70%)' : 
              'radial-gradient(circle, rgba(234,179,8,0.4) 0%, rgba(234,179,8,0) 70%)',
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            scale: hoveredItem ? 4 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Shared active indicator (floats below all items) */}
        <motion.div
          ref={indicatorRef}
          className="absolute h-8 rounded-md -z-10 bg-gold/10"
          style={{
            width: smoothWidth,
            left: smoothX,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
        
        {navItems.map((item) => {
          const isActive = activeSection === item.name.toLowerCase();
          return (
            <motion.a
              key={item.name}
              href={item.href}
              className={`relative font-medium text-sm px-3 py-1.5 rounded-md z-10 ${
                isActive
                  ? 'text-gold'
                  : (isDarkMode ? 'text-foreground hover:text-gold' : 'text-gray-700 hover:text-gold')
              }`}
              onMouseEnter={() => {
                setHoveredItem(item.name);
                playSound('hover');
              }}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => playSound('click')}
              whileHover={!shouldReduceMotion ? { 
                scale: 1.05, 
                y: -2,
                transition: { type: 'spring', stiffness: 400, damping: 17 }
              } : {}}
              whileTap={{ scale: 0.95 }}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Item content with conditional glow effect */}
              <span className="relative z-10">
                {item.name}
                
                {isActive && (
                  <>
                    {/* Subtle glow behind text */}
                    <motion.div
                      className="absolute inset-0 blur-sm bg-gold/20 rounded-md -z-10"
                      variants={glowVariants}
                      initial="idle"
                      animate={hoveredItem === item.name ? "hover" : "idle"}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Active indicator line */}
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                  </>
                )}
              </span>
              
              {/* Hover effect for non-active items */}
              {!isActive && hoveredItem === item.name && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold/50 rounded-full"
                  layoutId="hoverIndicator"
                  initial={{ width: 0, left: '50%' }}
                  animate={{ width: '100%', left: '0%' }}
                  exit={{ width: 0, left: '50%' }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.a>
          );
        })}
      </motion.nav>
      
      {/* Mobile Navigation Toggle */}
      <div className="md:hidden">
        <motion.button
          className="p-2 rounded-md bg-transparent flex flex-col gap-1.5 items-center justify-center"
          onClick={() => {
            setMenuExpanded(!menuExpanded);
            playSound('click');
          }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={menuExpanded}
          aria-controls="mobile-menu"
          aria-label={menuExpanded ? "Close menu" : "Open menu"}
        >
          <motion.span 
            className={`w-6 h-0.5 rounded-full bg-current transition-colors ${menuExpanded ? 'bg-gold' : ''}`}
            animate={menuExpanded ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span 
            className={`w-6 h-0.5 rounded-full bg-current transition-colors ${menuExpanded ? 'bg-gold' : ''}`}
            animate={menuExpanded ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span 
            className={`w-6 h-0.5 rounded-full bg-current transition-colors ${menuExpanded ? 'bg-gold' : ''}`}
            animate={menuExpanded ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {menuExpanded && (
            <motion.div
              id="mobile-menu"
              className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden z-50"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="py-4 px-6 flex flex-col gap-3">
                {navItems.map((item) => {
                  const isActive = activeSection === item.name.toLowerCase();
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className={`py-2 px-3 rounded-md ${
                        isActive
                          ? 'bg-gold/10 text-gold font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      variants={itemVariants}
                      onClick={() => {
                        setMenuExpanded(false);
                        playSound('click');
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="relative">
                        {item.name}
                        {isActive && (
                          <motion.span
                            className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-gold rounded-full"
                            layoutId="mobileActiveIndicator"
                          />
                        )}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Navigation;