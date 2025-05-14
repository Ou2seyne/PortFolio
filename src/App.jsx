import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import AnimatedHeader from './components/AnimatedHeader';
import HeroEnhanced from './components/HeroEnhanced';
import About from './components/About';
import ProjectsGallery from './components/ProjectsGallery';
import Contact from './components/Contact';
import { AnimatePresence } from 'framer-motion';

function AppRoutes({ contactModalOpen, setContactModalOpen }) {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [logoInNavbar, setLogoInNavbar] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  const location = useLocation();

  // Dynamic navItems based on route
  const navItems =
    location.pathname === '/contact'
      ? [{ name: 'Accueil', href: '/' }]
      : [
          { name: 'A propos', href: '#about' },
          { name: 'Projets', href: '#projects' },
        ];

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  const bgElements = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 40,
    delay: Math.random() * 2,
  }));

  return (
    <>
      <AnimatedHeader
        logoInNavbar={logoInNavbar}
        activeSection={activeSection}
        navItems={navItems}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      {bgElements.map((el) => (
        <motion.div
          key={el.id}
          className="fixed rounded-full bg-gold/5 z-0"
          style={{
            width: el.size,
            height: el.size,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5 + el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div id="hero" ref={heroRef} className="w-full">
                <HeroEnhanced
                  logoInNavbar={logoInNavbar}
                  isDarkMode={isDarkMode}
                />
              </div>
              {/* Scroll indicator between sections */}
              <motion.div 
                className="relative flex justify-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.div 
                  className="absolute -top-12 flex flex-col items-center"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div 
                    className={`w-0.5 h-10 ${isDarkMode ? 'bg-gradient-to-b from-transparent to-gold/50' : 'bg-gradient-to-b from-transparent to-gold/80'}`}
                  />
                </motion.div>
              </motion.div>
              <div id="about" ref={aboutRef} className="w-full pt-8">
                <About isDarkMode={isDarkMode} onOpenContact={() => setContactModalOpen(true)} />
              </div>
              <div id="projects" ref={projectsRef} className="w-full pt-16">
                <ProjectsGallery isDarkMode={isDarkMode} />
              </div>
            </>
          }
        />
      </Routes>
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactModalOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-3xl mx-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full 
                bg-black/70 text-white hover:bg-black hover:scale-110 active:scale-95 transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-gold/30 group"
                onClick={() => setContactModalOpen(false)}
                aria-label="Fermer le formulaire de contact"
                type="button"
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              </button>
              
              {/* Modal content */}
              <motion.div 
                className="relative overflow-hidden rounded-2xl"
                initial={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                animate={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
              >
                <Contact />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  return (
    <Router>
      <div
        className={`min-h-screen flex flex-col items-center justify-between transition-colors duration-300 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100`}
      >
        <AppRoutes contactModalOpen={contactModalOpen} setContactModalOpen={setContactModalOpen} />
      </div>
    </Router>
  );
}
