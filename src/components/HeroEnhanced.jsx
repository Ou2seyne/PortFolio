import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { FaGithub, FaLinkedin, FaTwitter, FaDribbble } from 'react-icons/fa';
import WebGLBackground from './WebGLBackground';
import { useSpring, animated } from 'react-spring';

// Error Boundary for Spline Component
const SplineErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-subtle text-lg">Échec du chargement du modèle 3D</p>
        <img src="/src/assets/fallback-robot.png" alt="Fallback Robot" className="w-1/2 opacity-30" />
      </div>
    );
  }
  
  return (
    <div onError={() => setHasError(true)}>
      {children}
    </div>
  );
};

export default function ModernHero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  // Content animation sequence - more subtle and refined
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.15, 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  // Text animation for titles
  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + (custom * 0.03),
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  // Subtle floating animation for 3D model
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  // Social links with refined design
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/username', label: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/in/username', label: 'LinkedIn' },
    { icon: <FaTwitter />, url: 'https://twitter.com/username', label: 'Twitter' },
    { icon: <FaDribbble />, url: 'https://dribbble.com/username', label: 'Dribbble' },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden"
    >
      {/* Subtle WebGL background */}
      <WebGLBackground sectionRef={sectionRef} />
      
      {/* Ambient light effect */}
      <motion.div 
        className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-gold/5 opacity-0"
        animate={isInView ? { 
          opacity: [0, 0.15, 0.1],
          x: [0, 20, 0],
          scale: [0.8, 1.2, 1]
        } : { opacity: 0 }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{ filter: "blur(60px)" }}
      />

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center z-20">
        {/* Left: Content area */}
        <div className="lg:w-1/2 flex flex-col space-y-8 text-center lg:text-left">
          {/* Title with subtle gradient */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            variants={contentVariants}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight overflow-hidden">
              {/* Animated text with letter animations */}
              <div className="inline-block">
                {Array.from("Minimaliste.").map((letter, i) => (
                  <motion.span
                    key={`title-1-${i}`}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="inline-block bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>{' '}
              <div className="inline-block">
                {Array.from("Animé.").map((letter, i) => (
                  <motion.span
                    key={`title-2-${i}`}
                    custom={i + 12}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="inline-block text-orange"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </h1>
            {/* Refined underline with pulse effect */}
            <motion.div 
              className="h-1 bg-gradient-to-r from-gold/70 to-orange-500/70 rounded-full mt-2 mx-auto lg:mx-0"
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
            <motion.div 
              className="h-1 bg-gradient-to-r from-gold to-orange-500 rounded-full absolute mt-2 mx-auto lg:mx-0"
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { width: '60px', opacity: [0, 0.8, 0] } : { width: 0, opacity: 0 }}
              transition={{ 
                delay: 2,
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
              style={{ filter: "blur(1px)" }}
            />
          </motion.div>

          {/* Subheading with subtle reveal */}
          <motion.p
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
            variants={contentVariants}
            className="text-lg md:text-xl text-subtle max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            {/* Animated text with word fade-in */}
            {["Bienvenue", "sur", "mon", "portfolio", "—", "un", "parfait", "mélange", "de", "sobriété,", "minimalisme,", "et", "animation", "impressionnante."].map((word, i) => (
              <motion.span
                key={`word-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ 
                  delay: 1.5 + (i * 0.06),
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          {/* CTA Button with animated border */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
            variants={contentVariants}
          >
            <motion.div className="relative inline-block">
              {/* Animated gradient border */}
              <motion.div
                className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gold to-orange-500 opacity-0"
                animate={isInView ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
                transition={{ 
                  delay: 2.5,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
                style={{ filter: "blur(4px)" }}
              />
              <motion.a
                href="#projects"
                className="relative inline-flex items-center gap-3 px-8 py-3 bg-background/80 border border-gold/50 rounded-full shadow-md transition-all duration-300 group z-10"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)',
                  borderColor: 'rgba(234, 179, 8, 0.8)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium text-lg bg-gradient-to-r from-gold to-orange-500 bg-clip-text text-transparent">
                  Voir les Projets
                </span>
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.2 }}
                  className="text-orange"
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Social Links with staggered animation */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={3}
            variants={contentVariants}
            className="flex gap-4 justify-center lg:justify-start"
          >
            {socialLinks.map((link, idx) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background/50 border border-gold/30 text-gold hover:text-orange-500 hover:border-gold/60 transition-all duration-300 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ 
                  delay: 2.5 + (idx * 0.1),
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.15, 
                  y: -3,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Subtle pulse on hover */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gold opacity-0"
                  whileHover={{ 
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.35, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D Model area with subtle floating animation */}
        <motion.div 
          className="lg:w-1/2 mt-12 lg:mt-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Decorative circles */}
          <motion.div 
            className="absolute w-32 h-32 rounded-full bg-gold/5 z-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { 
              scale: [0, 2.5],
              opacity: [0, 0.2, 0]
            } : { scale: 0, opacity: 0 }}
            transition={{ delay: 2, duration: 3, ease: "easeOut" }}
          />
          
          {/* 3D Model container with floating animation */}
          <motion.div 
            className="w-full h-[400px] md:h-[500px] relative z-10"
            animate={isInView && !shouldReduceMotion ? floatingAnimation : {}}
          >
            {/* Spotlight effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-radial from-gold/10 to-transparent rounded-full opacity-0"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: [0, 0.4, 0.1] } : { opacity: 0 }}
              transition={{ delay: 1, duration: 2 }}
              style={{ 
                background: "radial-gradient(circle, rgba(234,179,8,0.08) 0%, rgba(0,0,0,0) 70%)",
                transform: "translateY(-20%)"
              }}
            />
            
            <SplineErrorBoundary>
              <Spline
                scene="https://prod.spline.design/6dMrMpdClICXKoRI/scene.splinecode"
                onLoad={() => setIsSplineLoaded(true)}
                onError={() => setIsSplineLoaded(false)}
              />
            </SplineErrorBoundary>
            
            {/* Fallback illustration with animation */}
            {!isSplineLoaded && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={isInView && !shouldReduceMotion ? floatingAnimation : {}}
              >
                <img
                  src="/src/assets/fallback-robot.png"
                  alt="Robot en attente"
                  className="w-3/4 opacity-50 drop-shadow-xl"
                />
              </motion.div>
            )}
          </motion.div>
          
          {/* Animated particles */}
          <AnimatePresence>
            {isInView && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-gold"
                    initial={{ 
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                      opacity: 0
                    }}
                    animate={{ 
                      y: [0, -100 - (Math.random() * 100)],
                      opacity: [0, 0.8, 0],
                      scale: [0.5, 1.5, 0.8]
                    }}
                    transition={{
                      duration: 4 + (Math.random() * 3),
                      repeat: Infinity,
                      repeatDelay: Math.random() * 5,
                      delay: Math.random() * 2
                    }}
                    style={{
                      filter: "blur(0.5px)",
                      left: `${40 + (Math.random() * 20)}%`,
                      top: `${50 + (Math.random() * 20)}%`
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}