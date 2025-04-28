import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectsGallery from './ProjectsGallery';

export default function Projects() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const timer = setTimeout(() => setIsLoading(false), 800);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-neutral-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
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
                isDarkMode ? 'border-gold' : 'border-blue-600'
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 sm:px-6 py-8"
          >
            <header className="mb-8">
              <div className="flex justify-between items-center">
                <motion.h1 
                  className={`text-3xl sm:text-4xl font-bold ${
                    isDarkMode ? 'text-gold' : 'text-blue-700'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Mes Projets
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <button
                    onClick={toggleTheme}
                    className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      isDarkMode 
                        ? 'bg-neutral-800 text-gold hover:bg-neutral-700' 
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
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                className={`h-px w-full mt-4 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
              
              <motion.p 
                className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Découvrez une sélection de mes réalisations récentes
              </motion.p>
            </header>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ProjectsGallery isDarkMode={isDarkMode} />
            </motion.div>
            
            <motion.footer 
              className={`mt-16 py-6 text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm">&copy; {new Date().getFullYear()} - Portfolio de projets</p>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}