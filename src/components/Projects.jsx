import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useAnimationControls } from 'framer-motion';
import ProjectsGallery from './ProjectsGallery';

export default function Projects() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  
  // Refs for scroll animations
  const headerRef = useRef(null);
  const descriptionRef = useRef(null);
  const galleryRef = useRef(null);
  const footerRef = useRef(null);
  
  // Animation controls for staggered animations
  const controls = useAnimationControls();
  
  // Check if elements are in view
  const headerInView = useInView(headerRef, { once: true, amount: 0.2 });
  const descriptionInView = useInView(descriptionRef, { once: true, amount: 0.2 });
  const galleryInView = useInView(galleryRef, { once: true, amount: 0.1 });
  const footerInView = useInView(footerRef, { once: true });
  
  // Scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);
  
  useEffect(() => {
    // Theme detection and initialization
    const savedMode = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode) {
      setIsDarkMode(savedMode === 'dark');
    } else {
      setIsDarkMode(prefersDark);
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', savedMode === 'dark' || prefersDark);
    
    // Add listener for OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start staggered animations after loading
      controls.start(i => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 * i, duration: 0.5, ease: "easeOut" }
      }));
    }, 800);
    
    // Scroll listener for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [controls]);
  
  // React to elements coming into view
  useEffect(() => {
    if (headerInView) {
      controls.start("visible");
    }
  }, [headerInView, controls]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  // Custom hover animation for buttons
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: isDarkMode ? "0px 5px 15px rgba(255, 215, 0, 0.2)" : "0px 5px 15px rgba(37, 99, 235, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  // Parallax effect calculation
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div 
      style={{ opacity, scale }}
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-neutral-900 text-gray-100' 
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div 
              className={`w-16 h-16 rounded-full border-4 border-t-transparent ${
                isDarkMode ? 'border-yellow-400' : 'border-blue-600'
              }`}
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="container mx-auto px-4 sm:px-6 py-8 overflow-hidden"
          >
            {/* Floating background elements */}
            <motion.div 
              className="fixed inset-0 z-0 pointer-events-none opacity-30"
              style={{ y: parallaxY }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full ${
                    isDarkMode ? 'bg-blue-900' : 'bg-blue-200'
                  }`}
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    opacity: 0.3,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{ 
                    width: `${Math.random() * 300 + 50}px`,
                    height: `${Math.random() * 300 + 50}px`,
                    filter: 'blur(40px)'
                  }}
                />
              ))}
            </motion.div>

            <header className="mb-8 relative z-10" ref={headerRef}>
              <motion.div 
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <motion.h1 
                  className={`text-3xl sm:text-4xl font-bold ${
                    isDarkMode ? 'text-yellow-400' : 'text-blue-700'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ 
                    scale: 1.03,
                    textShadow: isDarkMode 
                      ? "0px 0px 8px rgba(255, 215, 0, 0.6)" 
                      : "0px 0px 8px rgba(37, 99, 235, 0.4)"
                  }}
                >
                  Mes Projets
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.button
                    onClick={toggleTheme}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      isDarkMode 
                        ? 'bg-neutral-800 text-yellow-400 hover:bg-neutral-700' 
                        : 'bg-white text-blue-600 hover:bg-gray-100 shadow-md'
                    }`}
                    aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                  >
                    <motion.span
                      animate={{ rotate: isDarkMode ? 180 : 0 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </motion.span>
                    <span className="text-sm font-medium">
                      {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className={`h-px w-full mt-4 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                whileInView={{ 
                  backgroundImage: isDarkMode 
                    ? "linear-gradient(90deg, #4a5568, #ecc94b, #4a5568)" 
                    : "linear-gradient(90deg, #e2e8f0, #3182ce, #e2e8f0)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: ["100% 0%", "0% 0%"],
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                  backgroundPosition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
                }}
              />
              
              <motion.p 
                ref={descriptionRef}
                className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
              >
                Découvrez une sélection de mes réalisations récentes
              </motion.p>
            </header>

            {/* Scroll indicator */}
            <motion.div 
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
              initial={{ opacity: 1, y: 0 }}
              animate={{ 
                opacity: [1, 0.5, 1],
                y: [0, 10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
              style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            >
              <motion.div 
                className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
                  isDarkMode ? 'border-yellow-400' : 'border-blue-600'
                }`}
              >
                <motion.div 
                  className={`w-1 h-2 rounded-full ${
                    isDarkMode ? 'bg-yellow-400' : 'bg-blue-600'
                  }`}
                  animate={{ 
                    y: [0, 4, 0],
                    opacity: [0.5, 1, 0.5] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              ref={galleryRef}
              initial={{ opacity: 0 }}
              animate={galleryInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <ProjectsGallery isDarkMode={isDarkMode} />
            </motion.div>
            
            <motion.footer 
              ref={footerRef}
              className={`mt-16 py-6 text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.p 
                className="text-sm"
                whileHover={{ 
                  scale: 1.05,
                  color: isDarkMode ? "#ecc94b" : "#3182ce",
                  transition: { duration: 0.2 }
                }}
              >
                &copy; {new Date().getFullYear()} - Portfolio de projets
              </motion.p>
              
              <motion.div 
                className="mt-4 flex justify-center space-x-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
              >
                {["LinkedIn", "GitHub", "Twitter", "Instagram"].map((social, index) => (
                  <motion.a
                    key={social}
                    href="#"
                    className={`text-sm px-3 py-1 rounded-full ${
                      isDarkMode 
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-yellow-400' 
                        : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-blue-600 shadow-sm'
                    }`}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ 
                      scale: 1.1,
                      y: -2,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </motion.div>
            </motion.footer>
            
            {/* Back to top button */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`fixed bottom-6 right-6 p-3 rounded-full z-20 ${
                isDarkMode 
                  ? 'bg-neutral-800 text-yellow-400 hover:bg-neutral-700' 
                  : 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                scale: useTransform(scrollYProgress, [0, 0.1], [0.8, 1]),
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: isDarkMode 
                  ? "0px 0px 12px rgba(255, 215, 0, 0.3)" 
                  : "0px 0px 12px rgba(37, 99, 235, 0.3)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}