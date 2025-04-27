import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import AnimatedHeader from './components/AnimatedHeader';
import Hero from './components/Hero';
import About from './components/About';
import ProjectsGallery from './components/ProjectsGallery';

export default function App() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const [logoInNavbar, setLogoInNavbar] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme');
      if (savedMode) return savedMode === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { scrollYProgress } = useScroll();

  const navItems = [
    { name: 'A propos', href: '#about' },
    { name: 'Projets', href: '#projects' },
  ];

  useEffect(() => {
    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'about', ref: aboutRef },
      { id: 'projects', ref: projectsRef },
    ];

    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setLogoInNavbar(rect.bottom <= 60);
      }

      const currentSection = sections
        .filter((section) => section.ref.current)
        .find((section) => {
          const rect = section.ref.current.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const topOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - topOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  const bgElements = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 40,
    delay: Math.random() * 2,
  }));

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between transition-colors duration-300 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100`}>
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

      <div id="hero" ref={heroRef} className="w-full">
        <Hero logoInNavbar={logoInNavbar} isDarkMode={isDarkMode} />
      </div>

      <div id="about" ref={aboutRef} className="w-full pt-24">
        <About isDarkMode={isDarkMode} />
      </div>

      <div id="projects" ref={projectsRef} className="w-full pt-24">
        <ProjectsGallery isDarkMode={isDarkMode} />
      </div>

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
    </div>
  );
}
