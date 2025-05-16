import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { FaGithub, FaLinkedin, FaTwitter, FaDribbble } from 'react-icons/fa';
import WebGLBackground from './WebGLBackground';
import AnimatedParagraph from './AnimatedParagraph';

export default function ModernHero({ isDarkMode }) {
  const theme = isDarkMode ? 'dark' : 'light';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [prevTheme, setPrevTheme] = useState(theme);
  
  // Track theme changes to trigger animations
  useEffect(() => {
    if (prevTheme !== theme) {
      setPrevTheme(theme);
    }
  }, [theme, prevTheme]);

  // Content animation sequence - enhanced for smoother transitions
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.15, 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + (custom * 0.03),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  // Mouse parallax effect for enhanced interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  

  // Enhanced ambient light animations
  const ambientLight1Animation = {
    opacity: isInView ? 0.15 : 0,
    scale: isInView ? 1.2 : 0.8,
    x: isInView ? 20 : 0
  };

  const ambientLight2Animation = {
    opacity: isInView ? 0.1 : 0,
    scale: isInView ? 1.1 : 0.7,
    x: isInView ? -20 : 0,
    y: isInView ? 20 : 0
  };

  // Define color values as CSS variables
  const cssVars = {
    '--amber-500': '#f59e0b',
    '--amber-500-50': 'rgba(245, 158, 11, 0.5)',
    '--amber-500-80': 'rgba(245, 158, 11, 0.8)',
    '--amber-500-5': 'rgba(245, 158, 11, 0.05)',
    '--orange-500': '#f97316',
    '--orange-600': '#ea580c',
    '--orange': '#f97316',
    '--gold': '#eab308',
    '--gold-30': 'rgba(234, 179, 8, 0.3)',
    '--gold-60': 'rgba(234, 179, 8, 0.6)',
    '--gold-5': 'rgba(234, 179, 8, 0.05)',
    '--gray-100': '#f3f4f6',
    '--gray-300': '#d1d5db',
    '--gray-600': '#4b5563',
    '--gray-800': '#1f2937',
    '--white': '#ffffff',
    '--white-90': 'rgba(255, 255, 255, 0.9)',
    '--background': '#000000',
    '--background-80': 'rgba(0, 0, 0, 0.8)',
  };

  // Color values using variable references
  const colors = {
    primaryGradient: theme === 'light' 
      ? 'linear-gradient(to right, #f59e0b, #f97316)' 
      : 'linear-gradient(to right, #eab308, #f97316)',
    secondaryColor: theme === 'light' ? '#ea580c' : '#f97316',
    text: theme === 'light' ? '#1f2937' : '#f3f4f6',
    subtleText: theme === 'light' ? '#4b5563' : '#d1d5db',
    borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(234, 179, 8, 0.3)',
    hoverBorderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(234, 179, 8, 0.6)',
    bgTint: theme === 'light' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(234, 179, 8, 0.05)',
    buttonBg: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
    socialIconColor: theme === 'light' ? '#f59e0b' : '#eab308',
    socialIconHoverColor: theme === 'light' ? '#ea580c' : '#f97316',
  };

  return (
    <section 
      key={theme}
      ref={sectionRef} 
      className={`relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-black'}`}
      style={{
        transition: "background-color 0.5s ease, color 0.5s ease",
      }}
    >
      {/* Subtle WebGL background */}
      <WebGLBackground sectionRef={sectionRef} theme={theme} />
      
      {/* Enhanced ambient light effects */}
      <motion.div 
        className="absolute top-1/4 -left-20 w-64 h-64 rounded-full"
        style={{
          background: colors.bgTint,
          filter: "blur(60px)",
          transition: "background 0.5s ease"
        }}
        animate={ambientLight1Animation}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-20 w-96 h-96 rounded-full"
        style={{
          background: colors.bgTint,
          filter: "blur(80px)",
          transition: "background 0.5s ease"
        }}
        animate={ambientLight2Animation}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      />

      {/* Mouse parallax layer */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 0)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full" 
          style={{ 
            background: colors.primaryGradient,
            opacity: 0.3,
            filter: "blur(8px)",
            transition: "background 0.5s ease"
          }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full" 
          style={{ 
            background: colors.primaryGradient,
            opacity: 0.2,
            filter: "blur(6px)",
            transition: "background 0.5s ease"
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center z-20">
        {/* Left: Content area */}
        <div className="lg:w-1/2 flex flex-col space-y-8 text-center lg:text-left">
          {/* Title with enhanced gradient */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            variants={contentVariants}
            key={`title-container-${theme}`} // Force re-render on theme change
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight overflow-hidden"
                style={{ color: colors.text, transition: "color 0.5s ease" }}>
              {/* Animated text with letter animations */}
              <div className="inline-block">
                {Array.from("OU2").map((letter, i) => (
                  <motion.span
                    key={`title-1-${i}-${theme}`}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    style={{ 
                      display: "inline-block",
                      background: colors.primaryGradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      transition: "background 0.5s ease",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>{''}
              <div className="inline-block">
                {Array.from("SEYNE.").map((letter, i) => (
                  <motion.span
                    key={`title-2-${i}-${theme}`}
                    custom={i + 12}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    style={{ 
                      display: "inline-block",
                      color: colors.secondaryColor,
                      transition: "color 0.5s ease",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </h1>
            
            {/* Refined underline with pulse effect */}
            <motion.div 
              className="h-1 rounded-full mt-2 mx-auto lg:mx-0"
              style={{
                background: colors.primaryGradient,
                transition: "background 0.5s ease",
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? [
                { width: '0px', opacity: 0 },
                { width: '180px', opacity: 1 }
              ] : { width: 0, opacity: 0 }}
              transition={{ 
                delay: 1.2,
                duration: 0.8, 
                ease: "easeOut" 
              }}
            />
            
            {/* Animated pulse effect on underline */}
            <motion.div 
              className="h-1 rounded-full absolute mt-2 mx-auto lg:mx-0"
              style={{
                background: colors.primaryGradient,
                filter: "blur(1px)",
                transition: "background 0.5s ease",
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { 
                width: '60px', 
                opacity: [0, 0.8, 0],
                x: [0, 60, 120]
              } : { width: 0, opacity: 0 }}
              transition={{ 
                delay: 2,
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          </motion.div>

          {/* Subheading with enhanced word-by-word reveal */}
          <motion.p
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
            variants={contentVariants}
            className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
            style={{ 
              color: colors.subtleText,
              transition: "color 0.5s ease"
            }}
            key={`subheading-${theme}`} // Force re-render on theme change
          >
            <AnimatedParagraph theme={theme} colors={colors} />
          </motion.p>

          {/* CTA Button with enhanced animated border */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
            variants={contentVariants}
            key={`cta-${theme}`} // Force re-render on theme change
          >
            <motion.div className="relative inline-block">
              {/* Animated gradient border */}
              <motion.div
                className="absolute -inset-0.5 rounded-full"
                style={{
                  background: colors.primaryGradient,
                  transition: "background 0.5s ease",
                  filter: "blur(4px)",
                }}
                animate={isInView ? { 
                  opacity: [0, 0.5, 0],
                  scale: [0.98, 1.02, 0.98],
                } : { opacity: 0 }}
                transition={{ 
                  delay: 2.5,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              />
              <motion.a
                href="#projects"
                className="relative inline-flex items-center gap-3 px-8 py-3 rounded-full shadow-md transition-all duration-300 group z-10"
                style={{
                  background: colors.buttonBg,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.borderColor,
                  transition: "background 0.5s ease, border-color 0.5s ease",
                }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: theme === 'light' ? '0 0 25px rgba(245, 158, 11, 0.3)' : '0 0 25px rgba(234, 179, 8, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  background: colors.primaryGradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  transition: "background 0.5s ease",
                }}>
                  Voir les Projets
                </span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatDelay: 3, 
                    duration: 1.2,
                    ease: "easeInOut"
                  }}
                  style={{
                    color: colors.secondaryColor,
                    transition: "color 0.5s ease",
                  }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Right: 3D Visual Space - Add enhanced visual elements */}
        <motion.div 
          className="lg:w-1/2 mt-12 lg:mt-0"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * -15}px, 0)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* We could add 3D visual elements here if needed */}
          <div className="relative h-72 md:h-96 w-full flex items-center justify-center">
            {/* Add floating gradient circles with parallax effect */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: colors.primaryGradient,
                filter: "blur(30px)",
                opacity: 0.4,
                transition: "background 0.5s ease",
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute w-24 h-24 rounded-full"
              style={{
                background: colors.primaryGradient,
                filter: "blur(25px)",
                opacity: 0.3,
                transition: "background 0.5s ease",
                x: 40,
                y: 60,
              }}
              animate={{
                y: [60, 40, 60],
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            
            <motion.div
              className="absolute w-16 h-16 rounded-full"
              style={{
                background: colors.primaryGradient,
                filter: "blur(20px)",
                opacity: 0.25,
                transition: "background 0.5s ease",
                x: -60,
                y: -40,
              }}
              animate={{
                y: [-40, -60, -40],
                x: [-60, -80, -60],
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}