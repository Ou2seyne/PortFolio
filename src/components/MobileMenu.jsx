import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from './DarkModeToggle';

// Advanced menu animations
const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1],
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const menuItemVariants = {
  closed: { opacity: 0, x: -20, filter: "blur(10px)" },
  open: i => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { 
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  })
};

// Hamburger button animations
const Path = props => (
  <motion.path
    fill="transparent"
    strokeLinecap="round"
    strokeWidth="2.5"
    {...props}
  />
);

const MenuToggle = ({ toggle, isOpen, isDarkMode }) => (
  <motion.button
    onClick={toggle}
    className={`flex justify-center items-center rounded-full w-12 h-12 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
      isDarkMode 
        ? isOpen ? 'bg-gold text-black' : 'bg-zinc-800/80 text-gold' 
        : isOpen ? 'bg-gold text-black' : 'bg-amber-50 text-gold'
    } transition-colors duration-300`}
    whileTap={{ scale: 0.9 }}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        stroke={isOpen ? "#000" : isDarkMode ? "#f5f5f5" : "#000"}
      />
      <Path
        d="M 2 9.5 L 20 9.5"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.2 }}
        stroke={isOpen ? "#000" : isDarkMode ? "#f5f5f5" : "#000"}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.5 L 20 16.5" },
          open: { d: "M 3 2.5 L 17 16.5" }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        stroke={isOpen ? "#000" : isDarkMode ? "#f5f5f5" : "#000"}
      />
    </svg>
  </motion.button>
);

function MobileMenu({ menuOpen, setMenuOpen, isDarkMode, navItems, activeSection, shouldReduceMotion, scrolled }) {
  return (
    <div className="md:hidden">
      <MenuToggle toggle={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} isDarkMode={isDarkMode} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className={`absolute top-full left-0 right-0 ${
              isDarkMode 
                ? scrolled ? 'bg-zinc-900/95' : 'bg-zinc-800/95' 
                : scrolled ? 'bg-white/95' : 'bg-amber-50/95'
            } backdrop-blur-xl border-t ${
              isDarkMode ? 'border-gold/20' : 'border-amber-200/50'
            } flex flex-col items-stretch py-6 z-50 overflow-hidden`}
            style={{
              boxShadow: isDarkMode 
                ? '0 25px 50px -12px rgba(0,0,0,0.4)' 
                : '0 25px 50px -12px rgba(251,191,36,0.25)'
            }}
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="px-6 mb-6">
              <motion.div 
                className={`w-16 h-1 rounded-full mx-auto ${isDarkMode ? 'bg-gold/40' : 'bg-gold/60'}`}
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
            
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                className="overflow-hidden"
                custom={i}
                variants={menuItemVariants}
              >
                <motion.a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-4 px-8 relative overflow-hidden ${
                    activeSection === item.name.toLowerCase()
                      ? isDarkMode ? 'text-black' : 'text-black'
                      : isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  } font-medium text-xl`}
                  whileHover={{
                    x: 10,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  role="menuitem"
                  aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
                >
                  {/* Background for active item */}
                  {activeSection === item.name.toLowerCase() && (
                    <motion.div 
                      className="absolute inset-0 bg-gold -z-10"
                      layoutId="mobileActiveBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                  
                  <div className="flex items-center">
                    <span className="mr-3 text-gold">0{i+1}</span>
                    <span className="relative">
                      {item.name}
                      
                      {/* Underline on hover */}
                      <motion.span 
                        className={`absolute left-0 right-full h-0.5 bottom-0 ${
                          activeSection === item.name.toLowerCase() 
                            ? 'bg-black' 
                            : 'bg-gold'
                        }`}
                        initial={{ right: "100%" }}
                        whileHover={{ right: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </div>
                </motion.a>
              </motion.div>
            ))}
            
            {/* Social icons with floating animation */}
            <EnhancedMobileSocialIcons isDarkMode={isDarkMode} shouldReduceMotion={shouldReduceMotion} />
            
            {/* Bottom decorative elements */}
            <motion.div 
              className="mt-6 px-8 pt-6 border-t border-dashed border-gold/30 flex justify-between items-center"
              variants={menuItemVariants}
              custom={navItems.length + 1}
            >
              {/* Decorative element */}
              <motion.div 
                className="relative w-24 h-24"
                animate={{ 
                  rotate: 360
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <div className={`absolute inset-0 rounded-full border-2 border-dashed ${isDarkMode ? 'border-gold/20' : 'border-gold/30'}`} />
                <motion.div 
                  className={`absolute w-3 h-3 rounded-full bg-gold`}
                  style={{ top: 0, left: '50%', marginLeft: '-6px' }}
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(251,191,36,0.3)',
                      '0 0 0 10px rgba(251,191,36,0)',
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeOut" 
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EnhancedMobileSocialIcons({ isDarkMode, shouldReduceMotion }) {
  // Floating animation for social icons
  const floatingAnimation = {
    y: shouldReduceMotion ? 0 : [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }
  };

  const iconContainerVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.15,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 8 
      }
    }
  };

  const glowVariants = {
    rest: { opacity: 0, scale: 1 },
    hover: { 
      opacity: 0.8, 
      scale: 1.4,
      transition: { duration: 0.3 }
    }
  };

  const socialIcons = [
    {
      href: 'https://github.com/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.01-2-3.2.7-3.88-1.39-3.88-1.39-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.71 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.74.11 3.03.74.8 1.19 1.83 1.19 3.09 0 4.44-2.68 5.42-5.24 5.71.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
        </svg>
      ),
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.225.792 24 1.77 24h20.46C23.208 24 24 23.225 24 22.271V1.729C24 .774 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.633c-1.14 0-2.06-.926-2.06-2.066 0-1.14.92-2.066 2.06-2.066 1.14 0 2.06.926 2.06 2.066 0 1.14-.92 2.066-2.06 2.066zM20.452 20.452h-3.551V15.18c0-1.257-.023-2.874-1.751-2.874-1.751 0-2.019 1.368-2.019 2.78v5.366h-3.551V9h3.411v1.561h.049c.476-.899 1.637-1.849 3.372-1.849 3.605 0 4.271 2.372 4.271 5.456v6.284z" />
        </svg>
      ),
      label: 'LinkedIn',
    },
    {
      href: 'https://twitter.com/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      label: 'Twitter',
    },
  ];

  return (
    <motion.div
      className="flex justify-center gap-10 mt-8 px-8"
      variants={menuItemVariants}
      custom={socialIcons.length}
    >
      {socialIcons.map((social, index) => (
        <motion.a
          key={social.href}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gold relative`}
          animate={floatingAnimation}
          custom={index} // Used to stagger the animation
          variants={iconContainerVariants}
          initial="rest"
          whileHover="hover"
          aria-label={social.label}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          {/* Glow effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gold rounded-full blur-xl"
            variants={glowVariants}
          />
          
          {/* Icon with circle background */}
          <motion.div 
            className={`relative z-10 p-4 rounded-full ${
              isDarkMode ? 'bg-zinc-800' : 'bg-amber-50'
            } border ${
              isDarkMode ? 'border-gold/30' : 'border-gold/50'
            }`}
          >
            {social.icon}
          </motion.div>
        </motion.a>
      ))}
    </motion.div>
  );
}

export default MobileMenu;