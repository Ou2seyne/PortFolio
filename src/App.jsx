import React, { useEffect, useRef, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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

  // Ensure the correct class is set on initial mount and when system preference changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // --- Global Blob Blur Background with scroll parallax ---
  const { scrollYProgress } = useScroll();
  // Generate static blob parameters only once
  const staticBlobs = useMemo(() => Array.from({ length: 6 }).map((_, i) => {
    return {
      id: i,
      x: Math.random() * 90,
      y: Math.random() * 90,
      size: 220 + Math.random() * 180,
      delay: Math.random() * 2,
      color: i % 2 === 0 ? 'rgba(234,179,8,0.13)' : 'rgba(249,115,22,0.11)',
      parallaxStrength: 200 + Math.random() * 200 * (i % 2 === 0 ? 1 : -1)
    };
  }), []);
  // Compute yMotion for each blob at the top level
  const bgBlobs = staticBlobs.map((blob) => ({
    ...blob,
    yMotion: useTransform(scrollYProgress, [0, 1], [0, blob.parallaxStrength])
  }));

  // --- Back to Top Button State ---
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const gold = '#eab308';
  const goldGlow = '0 0 24px 6px rgba(234,179,8,0.25)';
  const goldGlowHover = '0 0 36px 12px rgba(234,179,8,0.45)';

  return (
    <>
      {/* Global animated blurred blobs background */}
      {bgBlobs.map((blob, idx) => (
        <motion.div
          key={blob.id}
          className="fixed pointer-events-none -z-10 blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            left: `${blob.x}%`,
            top: blob.yMotion, // Parallax scroll effect
            background: blob.color,
            borderRadius: '50%',
            opacity: isDarkMode ? 0.55 : 0.12,
          }}
          animate={{
            scale: [1, 1.14, 0.98, 1],
            opacity: [0.45, 0.65, 0.45],
            y: [0, 20, -10, 0],
            x: [0, idx % 2 === 0 ? 30 : -30, 0]
          }}
          transition={{
            duration: 13 + blob.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: blob.delay
          }}
        />
      ))}
      <AnimatedHeader
        logoInNavbar={logoInNavbar}
        activeSection={activeSection}
        navItems={navItems}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
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
                    className={`w-0.5 h-10 ${isDarkMode ? 'bg-white' : 'bg-black'}`}
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
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={handleBackToTop}
            aria-label="Retour en haut"
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 group"
            style={{
              background: gold,
              color: '#fff',
              boxShadow: goldGlow,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
            whileHover={{ scale: 1.12, boxShadow: goldGlowHover, rotate: [0, -10, 10, 0], transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' } }}
            whileTap={{ scale: 0.93 }}
            tabIndex={0}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-bounce">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.button>
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
        className="min-h-screen flex flex-col items-center justify-between transition-colors duration-300 bg-background text-foreground"
      >
        <AppRoutes contactModalOpen={contactModalOpen} setContactModalOpen={setContactModalOpen} />
      </div>
    </Router>
  );
}
