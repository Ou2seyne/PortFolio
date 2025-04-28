import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import AnimatedHeader from './components/AnimatedHeader';
import Hero from './components/Hero';
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setLogoInNavbar(true);
      else setLogoInNavbar(false);

      // Section highlighting
      const sections = [
        { id: 'hero', ref: heroRef },
        { id: 'about', ref: aboutRef },
        { id: 'projects', ref: projectsRef },
      ];
      const scrollPos = window.scrollY + 120;
      let current = 'hero';
      for (const section of sections) {
        if (section.ref.current) {
          const top = section.ref.current.offsetTop;
          if (scrollPos >= top) current = section.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                <Hero logoInNavbar={logoInNavbar} isDarkMode={isDarkMode} />
              </div>
              <div id="about" ref={aboutRef} className="w-full pt-24">
                <About isDarkMode={isDarkMode} onOpenContact={() => setContactModalOpen(true)} />
              </div>
              <div id="projects" ref={projectsRef} className="w-full pt-24">
                <ProjectsGallery isDarkMode={isDarkMode} />
              </div>
            </>
          }
        />
      </Routes>
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactModalOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-3xl mx-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-orange shadow-lg border-2 border-white/70 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gold/30 group"
                onClick={() => setContactModalOpen(false)}
                aria-label="Fermer le formulaire de contact"
                type="button"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              </button>
              <Contact />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-gold origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gold text-background p-3 rounded-full shadow-lg z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: scrollYProgress.get() > 0.1 ? 1 : 0,
          scale: scrollYProgress.get() > 0.1 ? 1 : 0.8,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
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
