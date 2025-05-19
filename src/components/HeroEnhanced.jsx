import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
// import Spline from '@splinetool/react-spline'; // Assuming not used if Spline component isn't in JSX
import { FaGithub, FaLinkedin, FaTwitter, FaDribbble } from 'react-icons/fa'; // Icons available if needed
import WebGLBackground from './WebGLBackground'; // Assuming this component exists
import AnimatedParagraph from './AnimatedParagraph'; // Assuming this component exists

export default function ModernHero({ isDarkMode }) {
  const theme = isDarkMode ? 'dark' : 'light';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  
  // Removed prevTheme state and useEffect as it was not directly used for animation re-triggering

  const contentVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * (shouldReduceMotion ? 0.05 : 0.15), 
        duration: shouldReduceMotion ? 0.1 : 0.8,
        ease: [0.22, 1, 0.36, 1] // Expo Out
      }
    })
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: (shouldReduceMotion ? 0.1 : 0.5) + (custom * (shouldReduceMotion ? 0.01 : 0.025)), // Slightly faster ripple
        duration: shouldReduceMotion ? 0.1 : 0.4, // Slightly faster reveal
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    if (!shouldReduceMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (!shouldReduceMotion) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [shouldReduceMotion]);

  const colors = {
    primaryGradient: theme === 'light' 
      ? 'linear-gradient(to right, var(--amber-500, #f59e0b), var(--orange-500, #f97316))' 
      : 'linear-gradient(to right, var(--gold, #eab308), var(--orange-500, #f97316))',
    secondaryColor: theme === 'light' ? 'var(--orange-600, #ea580c)' : 'var(--orange-500, #f97316)',
    text: theme === 'light' ? 'var(--gray-800, #1f2937)' : 'var(--gray-100, #f3f4f6)',
    subtleText: theme === 'light' ? 'var(--gray-600, #4b5563)' : 'var(--gray-300, #d1d5db)',
    borderColor: theme === 'light' ? 'var(--amber-500-50, rgba(245, 158, 11, 0.5))' : 'var(--gold-30, rgba(234, 179, 8, 0.3))',
    hoverBorderColor: theme === 'light' ? 'var(--amber-500-80, rgba(245, 158, 11, 0.8))' : 'var(--gold-60, rgba(234, 179, 8, 0.6))',
    bgTint: theme === 'light' ? 'var(--amber-500-5, rgba(245, 158, 11, 0.05))' : 'var(--gold-5, rgba(234, 179, 8, 0.05))',
    buttonBg: theme === 'light' ? 'var(--white-90, rgba(255, 255, 255, 0.9))' : 'var(--background-80, rgba(0, 0, 0, 0.8))',
    shimmerColor: theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
    socialIconColor: theme === 'light' ? 'var(--amber-500, #f59e0b)' : 'var(--gold, #eab308)',
    socialIconHoverColor: theme === 'light' ? 'var(--orange-600, #ea580c)' : 'var(--orange-500, #f97316)',
  };

  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const ctaGlowVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: shouldReduceMotion ? 0 : [0, 0.6, 0.6, 0],
      scale: shouldReduceMotion ? 1 : [0.95, 1.05, 0.95],
      transition: {
        delay: 2.5, 
        duration: shouldReduceMotion ? 0 : 2.5,
        ease: "easeInOut",
        times: [0, 0.4, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 3.5
      }
    },
    hover: {
      opacity: shouldReduceMotion ? 0 : 1, // Enhanced opacity
      scale: shouldReduceMotion ? 1 : 1.1, // Enhanced scale
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <section 
      key={`hero-section-${theme}`}
      ref={sectionRef} 
      className={`relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-black'}`}
      style={{
        transition: "background-color 0.7s ease, color 0.7s ease",
      }}
    >
      <WebGLBackground sectionRef={sectionRef} theme={theme} />
      
      <motion.div 
        className="absolute top-1/4 -left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: colors.bgTint, filter: "blur(60px)", transition: "background 0.5s ease" }}
        initial={{ opacity: 0, scale: 0.8, x: 0, y:0, rotate: 0 }}
        animate={isInView && !shouldReduceMotion ? {
          opacity: [0, 0.15, 0.1, 0.15], scale: [0.8, 1.2, 1.1, 1.2],
          x: [0, 20, 25, 20], y: [0, 0, -15, 0],
          rotate: [0, -10, 5, 0] // Added rotation
        } : { opacity: 0, scale: 0.8, x: 0, y:0, rotate: 0 }}
        transition={isInView && !shouldReduceMotion ? {
          duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", times: [0, 0.3, 0.65, 1] // Increased duration for smoother rotation
        } : { duration: 0.5, ease: "easeOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: colors.bgTint, filter: "blur(80px)", transition: "background 0.5s ease" }}
        initial={{ opacity: 0, scale: 0.7, x: 0, y:0, rotate: 0 }}
        animate={isInView && !shouldReduceMotion ? {
          opacity: [0, 0.1, 0.07, 0.1], scale: [0.7, 1.1, 1.0, 1.1],
          x: [0, -20, -15, -20], y: [0, 20, 25, 20],
          rotate: [0, 12, -8, 0] // Added rotation
        } : { opacity: 0, scale: 0.7, x: 0, y:0, rotate: 0 }}
        transition={isInView && !shouldReduceMotion ? {
          duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 0.5, times: [0, 0.3, 0.65, 1] // Increased duration
        } : { duration: 0.5, ease: "easeOut" }}
      />

      {!shouldReduceMotion && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10"
          animate={{ x: mousePosition.x * 10, y: mousePosition.y * 10 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }} // Changed to spring, adjusted params
        >
          <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full" 
            style={{ background: colors.primaryGradient, opacity: 0.3, filter: "blur(8px)", transition: "background 0.5s ease" }}
          />
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full" 
            style={{ background: colors.primaryGradient, opacity: 0.2, filter: "blur(6px)", transition: "background 0.5s ease" }}
          />
        </motion.div>
      )}

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center z-20">
        <div className="lg:w-1/2 flex flex-col space-y-8 text-center lg:text-left">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            variants={contentVariants}
            key={`title-container-${theme}`}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight"
                style={{ color: colors.text, transition: "color 0.5s ease" }}>
              <span className="inline-block">
                {Array.from("OU2").map((letter, i) => (
                  <motion.span
                    key={`title-1-${i}-${theme}`}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    whileHover={!shouldReduceMotion ? { 
                      y: -5, 
                      scale: 1.12, 
                      filter: 'brightness(1.2)', // Make gradient pop
                      rotate: i % 2 === 0 ? -2.5 : 2.5, // Subtle rotation
                      transition: { duration: 0.15, ease: "easeOut" }
                    } : {}}
                    style={{ 
                      display: "inline-block",
                      background: colors.primaryGradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      transition: "background 0.5s ease, filter 0.15s ease-out",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              <span className="inline-block">
                {Array.from("SEYNE.").map((letter, i) => (
                  <motion.span
                    key={`title-2-${i}-${theme}`}
                    custom={i + 3} 
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    whileHover={!shouldReduceMotion ? { 
                      y: -5, 
                      scale: 1.12, 
                      color: colors.text, // Change to main text color
                      rotate: (i + 3) % 2 === 0 ? 2.5 : -2.5, // Subtle rotation
                      transition: { duration: 0.15, ease: "easeOut" }
                    } : {}}
                    style={{ 
                      display: "inline-block",
                      color: colors.secondaryColor,
                      transition: "color 0.5s ease", // For theme change
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </h1>
            
            <motion.div 
              className="relative h-1 rounded-full mt-2 mx-auto lg:mx-0 overflow-hidden"
              style={{ background: colors.primaryGradient, width: '180px', transition: "background 0.5s ease" }}
              initial={{ scaleX: 0, originX: shouldReduceMotion ? 0.5 : 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ 
                delay: (shouldReduceMotion ? 0.1 : 0.8) + (contentVariants.visible(0).transition.delay + contentVariants.visible(0).transition.duration *0.5),
                duration: shouldReduceMotion ? 0.1 : 0.8, 
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {!shouldReduceMotion && (
                <motion.div
                  className="h-full rounded-full absolute top-0 left-0"
                  style={{ background: colors.shimmerColor, width: '35%' }}
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={isInView ? { x: ['-70%', '170%'], opacity: [0, 0.9, 0] } : { x: '-100%', opacity: 0 }}
                  transition={{
                    delay: 0.3, // Slightly earlier start
                    duration: 1, // Faster shimmer
                    ease: "circOut", repeat: Infinity, repeatDelay: 2, // More frequent
                    times: [0, 0.5, 1]
                  }}
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
            variants={contentVariants}
            key={`subheading-container-${theme}`}
          >
            <AnimatedParagraph 
              theme={theme} 
              colors={colors} 
              isInView={isInView} 
              shouldReduceMotion={shouldReduceMotion} 
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
            variants={contentVariants}
            key={`cta-${theme}`}
            onHoverStart={() => !shouldReduceMotion && setIsCtaHovered(true)}
            onHoverEnd={() => !shouldReduceMotion && setIsCtaHovered(false)}
          >
            <motion.div className="relative inline-block group">
              <motion.div
                className="absolute -inset-0.5 rounded-full pointer-events-none"
                style={{ background: colors.primaryGradient, filter: "blur(5px)", transition: "background 0.5s ease" }}
                variants={ctaGlowVariants}
                initial="initial"
                animate={isInView ? (isCtaHovered ? "hover" : "animate") : "initial"}
              />
              <motion.a
                href="#projects"
                className="relative inline-flex items-center gap-3 px-8 py-3 rounded-full shadow-md z-10"
                style={{
                  background: colors.buttonBg,
                  border: `1px solid ${colors.borderColor}`,
                  transition: `background 0.5s ease, border-color 0.5s ease, box-shadow ${shouldReduceMotion ? '0s' : '0.3s'} ease`,
                }}
                whileHover={!shouldReduceMotion ? { 
                  scale: 1.05, 
                  borderColor: colors.hoverBorderColor,
                  boxShadow: theme === 'light' ? '0 0 30px rgba(245, 158, 11, 0.5)' : '0 0 30px rgba(234, 179, 8, 0.5)', // Enhanced shadow
                  transition: { duration: 0.25, ease: "easeOut" } // Added explicit transition
                } : {}}
                whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
              >
                <motion.span
                  style={{
                    fontWeight: 500, fontSize: "1.125rem", background: colors.primaryGradient,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    transition: "background 0.5s ease, text-shadow 0.2s ease-out", // Added text-shadow transition
                    display: "inline-block" 
                  }}
                  animate={{ // Use animate prop to react to isCtaHovered for textShadow
                    textShadow: isCtaHovered && !shouldReduceMotion 
                      ? `0 0 8px ${theme === 'light' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(234, 179, 8, 0.3)' }` 
                      : 'none',
                    scale: isCtaHovered && !shouldReduceMotion ? 1.03 : 1,
                  }}
                  transition={{duration: 0.2, ease: "easeOut"}}
                >
                  Voir les Projets
                </motion.span>
                <motion.span
                  key={`cta-arrow-${theme}`}
                  animate={!shouldReduceMotion ? { x: [0, 6, 0], scale: [1, 1.15, 1] } : {}}
                  transition={!shouldReduceMotion ? { 
                    repeat: Infinity, 
                    repeatDelay: isCtaHovered ? 1.5 : 2.5, // Faster repeat on hover
                    duration: isCtaHovered ? 1.0 : 1.5, // Faster duration on hover
                    ease: "easeInOut", 
                    times: [0, 0.5, 1]
                  } : {}}
                  style={{ 
                    display: 'inline-block', // For transform
                    color: isCtaHovered && !shouldReduceMotion ? colors.text : colors.secondaryColor, 
                    transition: "color 0.3s ease" 
                  }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="lg:w-1/2 mt-12 lg:mt-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          transition={{ 
            delay: (shouldReduceMotion ? 0.05 : 0.15) * 3, 
            duration: shouldReduceMotion ? 0.1 : 1.2, 
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          <motion.div
             className="relative h-72 md:h-96 w-full flex items-center justify-center"
             animate={!shouldReduceMotion ? {
                translateX: mousePosition.x * -15,
                translateY: mousePosition.y * -15,
             } : {}}
             transition={!shouldReduceMotion ? { type: "spring", stiffness: 120, damping: 15, mass: 1.2 } : { duration: 0 }}
          >
            {!shouldReduceMotion && (
              <>
                <motion.div
                  className="absolute w-32 h-32 rounded-full pointer-events-none"
                  style={{ background: colors.primaryGradient, filter: "blur(30px)", transition: "background 0.5s ease" }}
                  animate={{
                    y: [0, -25, 5, -10, 0], x: [0, 10, -5, 10, 0],
                    scale: [1, 1.1, 0.95, 1.05, 1], opacity: [0.4, 0.6, 0.35, 0.55, 0.4],
                    rotate: [0, 5, -3, 4, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", times: [0,0.25,0.5,0.75,1] }}
                />
                <motion.div
                  className="absolute w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: colors.primaryGradient, filter: "blur(25px)", x: 40, y: 60, transition: "background 0.5s ease" }}
                  animate={{
                    translateY: [0, -20, 10, -15, 0], translateX: [0, 15, -10, 5, 0],
                    scale: [1, 1.15, 0.9, 1.1, 1], opacity: [0.3, 0.5, 0.25, 0.45, 0.3],
                    rotate: [0, -4, 2, -5, 0]
                  }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8, times: [0,0.25,0.5,0.75,1] }}
                />
                <motion.div
                  className="absolute w-16 h-16 rounded-full pointer-events-none"
                  style={{ background: colors.primaryGradient, filter: "blur(20px)", x: -60, y: -40, transition: "background 0.5s ease" }}
                  animate={{
                    translateY: [0, 20, -10, 15, 0], translateX: [0, -20, 5, -15, 0],
                    scale: [1, 1.2, 0.9, 1.15, 1], opacity: [0.25, 0.4, 0.2, 0.35, 0.25],
                    rotate: [0, 6, -4, 5, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5, times: [0,0.25,0.5,0.75,1] }}
                />
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}