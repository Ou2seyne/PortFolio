import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// TypeScript interface for the component props
interface EnhancedHeroProps {
  isDarkMode: boolean;
}

// Lazy loaded background animation to improve performance
const BackgroundAnimation = React.lazy(() => import('./BackgroundAnimation'));

export default function EnhancedHero({ isDarkMode }: EnhancedHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Spring-based scroll progress for smoother animations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(smoothProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.9]);
  
  // Typewriter effect words
  const headlineWords = ["Creative.", "Innovative.", "Professional."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");
  
  // Handle typewriter effect
  useEffect(() => {
    // Return early during SSR
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    const currentWord = headlineWords[currentWordIndex];
    
    if (isTyping) {
      if (displayText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(true);
        setCurrentWordIndex((currentWordIndex + 1) % headlineWords.length);
      }
    }
  }, [displayText, isTyping, currentWordIndex, headlineWords]);

  // Animated background blobs
  const blobs = [
    { x: "5%", y: "20%", size: "30rem", delay: 0, color: "primary" },
    { x: "70%", y: "60%", size: "25rem", delay: 2, color: "secondary" },
    { x: "80%", y: "15%", size: "20rem", delay: 1, color: "accent" },
  ];
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  // Handle scroll to content function
  const scrollToContent = () => {
    const contentSection = document.getElementById('about');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className={`relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden pb-8 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}
      style={{
        opacity,
        y: shouldReduceMotion ? 0 : yOffset,
        scale: shouldReduceMotion ? 1 : scale,
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Animated background blobs - only render on client side for performance */}
      {isClient && (
        <React.Suspense fallback={null}>
          {blobs.map((blob, index) => (
            <motion.div
              key={`blob-${index}`}
              className={`absolute rounded-full opacity-10 ${
                blob.color === 'primary'
                  ? isDarkMode ? 'bg-indigo-500' : 'bg-indigo-400'
                  : blob.color === 'secondary'
                  ? isDarkMode ? 'bg-purple-500' : 'bg-purple-400'
                  : isDarkMode ? 'bg-pink-500' : 'bg-pink-400'
              }`}
              style={{
                width: blob.size,
                height: blob.size,
                left: blob.x,
                top: blob.y,
                filter: 'blur(80px)',
              }}
              animate={{
                x: [0, 20, 0, -20, 0],
                y: [0, -20, 0, 20, 0],
                scale: [1, 1.05, 1, 0.95, 1],
              }}
              transition={{
                duration: 15 + blob.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: blob.delay,
              }}
            />
          ))}
        </React.Suspense>
      )}

      {/* Floating particles */}
      {isClient && !shouldReduceMotion && (
        <React.Suspense fallback={null}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className={`absolute w-1 h-1 rounded-full ${
                isDarkMode ? 'bg-white' : 'bg-gray-800'
              }`}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                y: [0, -Math.random() * 100 - 50],
                opacity: [0.1, 0.5, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{ scale: Math.random() * 0.5 + 0.5 }}
            />
          ))}
        </React.Suspense>
      )}

      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center max-w-5xl">
        {/* Main heading with animated gradient */}
        <motion.h1
          className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight ${
            isDarkMode 
              ? 'text-white' 
              : 'text-gray-900'
          }`}
          variants={childVariants}
        >
          <span className="block mb-2">Modern & Engaging</span>
          <div className="relative h-20 flex items-center justify-center overflow-hidden">
            <span 
              className={`bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-indigo-500 via-purple-500 to-pink-500'
                  : 'from-indigo-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent inline-block`}
            >
              {displayText}
              <span className="animate-blink">|</span>
            </span>
          </div>
        </motion.h1>

        {/* Subtitle with staggered animation */}
        <motion.p
          className={`text-xl max-w-2xl mb-12 ${
            isDarkMode 
              ? 'text-gray-300' 
              : 'text-gray-700'
          }`}
          variants={childVariants}
        >
          {["Create", "stunning", "and", "interactive", "user", "experiences", "with", "our", "comprehensive", "design", "system."].map((word, i) => (
            <motion.span
              key={`word-${i}`}
              className="inline-block mr-1"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                delay: 0.8 + (i * 0.05),
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* CTA Button with interactive animations */}
        <motion.div variants={childVariants}>
          <motion.button
            className={`relative overflow-hidden rounded-full px-8 py-4 text-lg font-medium transition-all ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            }`}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {/* Your action here */}}
          >
            <motion.span
              className="absolute inset-0 rounded-full opacity-25"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ 
                scale: [0, 1.5],
                opacity: [0.5, 0],
                transition: { duration: 0.5 }
              }}
            />
            Get Started
            <motion.span
              className="ml-2 inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1,
                repeat: Infinity, 
                repeatType: "reverse",
                repeatDelay: 1
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          onClick={scrollToContent}
          variants={childVariants}
        >
          <div className="flex flex-col items-center">
            <span className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Scroll Down
            </span>
            <ChevronDown 
              className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
} 