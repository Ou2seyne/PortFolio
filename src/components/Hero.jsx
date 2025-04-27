import React, { useRef, useEffect, useState, Component } from 'react';
import { motion, useSpring, useTransform, useInView, useScroll, useReducedMotion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

// Error Boundary for Spline Component
class SplineErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="text-subtle text-lg">Échec du chargement du modèle 3D</p>
          <img
            src="/src/assets/fallback-robot.png"
            alt="Fallback Robot"
            className="w-1/2 opacity-30"
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Hero({ logoInNavbar, isDarkMode }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [showInteractHint, setShowInteractHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { scrollY } = useScroll();
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-12, 12]);
  const scale = useTransform(scrollY, [0, 300], shouldReduceMotion ? [1, 1] : [1, 1.1]);
  const rotateZ = useTransform(scrollY, [0, 300], shouldReduceMotion ? [0, 0] : [0, 10]);
  const floatY = useTransform(scrollY, [0, 200], shouldReduceMotion ? [0, 0] : [0, -20]);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);

    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => setShowInteractHint(false), 3000);
    }
  };

  useEffect(() => {
    if (isSplineLoaded && !shouldReduceMotion) {
      setTimeout(() => setShowInteractHint(true), 2000);
      setTimeout(() => !hasInteracted && setShowInteractHint(false), 8000);
    }
  }, [isSplineLoaded, shouldReduceMotion, hasInteracted]);

  // Enhanced background effect with more dynamic elements
  useEffect(() => {
    if (!sectionRef.current || shouldReduceMotion) return;

    const container = document.createElement('div');
    container.className = 'absolute inset-0 pointer-events-none -z-10 overflow-hidden';
    sectionRef.current.appendChild(container);

    // Create floating shapes with enhanced variety
    const shapeCount = window.innerWidth < 768 ? 10 : 25;
    const shapes = [];

    const shapeTypes = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'dot'];
    const shapeColors = [
      'rgba(234, 179, 8, 0.2)', // gold
      'rgba(255, 85, 0, 0.15)', // orange
      'rgba(255, 255, 255, 0.1)', // white
      'rgba(255, 226, 89, 0.12)', // lighter gold
      'rgba(255, 150, 50, 0.1)', // lighter orange
    ];

    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 120 + 40;
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
      const blurAmount = Math.random() * 8 + 2;

      shape.style.position = 'absolute';
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      shape.style.transform = `rotate(${Math.random() * 360}deg)`;
      shape.style.filter = `blur(${blurAmount}px)`;
      shape.style.backdropFilter = 'blur(1px)';
      shape.style.transition = 'all 0.3s ease';
      shape.style.zIndex = Math.floor(Math.random() * 5) - 10;

      // Different shape types with more variety
      if (type === 'circle') {
        shape.style.borderRadius = '50%';
        shape.style.background = color;
      } else if (type === 'square') {
        shape.style.background = color;
        shape.style.borderRadius = `${Math.random() * 10}px`;
      } else if (type === 'triangle') {
        shape.style.width = '0';
        shape.style.height = '0';
        shape.style.borderLeft = `${size/2}px solid transparent`;
        shape.style.borderRight = `${size/2}px solid transparent`;
        shape.style.borderBottom = `${size}px solid ${color}`;
        shape.style.background = 'transparent';
      } else if (type === 'diamond') {
        shape.style.transform = `rotate(45deg) scale(${Math.random() * 0.5 + 0.5})`;
        shape.style.background = color;
      } else if (type === 'hexagon') {
        shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        shape.style.background = color;
      } else if (type === 'dot') {
        shape.style.borderRadius = '50%';
        shape.style.background = color;
        shape.style.width = `${Math.random() * 10 + 5}px`;
        shape.style.height = `${Math.random() * 10 + 5}px`;
        shape.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      }

      // Enhanced floating animation with more natural movement
      const duration = Math.random() * 25 + 15;
      const xDistance = Math.random() * 60 - 30;
      const yDistance = Math.random() * 60 - 30;
      const rotationAmount = Math.random() * 180 - 90;
      const scaleChange = Math.random() * 0.4 + 0.8;

      // Apply animation with improved keyframes
      shape.animate(
        [
          { transform: `translate(0, 0) rotate(0deg) scale(1)` },
          { transform: `translate(${xDistance/2}px, ${yDistance/2}px) rotate(${rotationAmount/2}deg) scale(${scaleChange})` },
          { transform: `translate(${xDistance}px, ${yDistance}px) rotate(${rotationAmount}deg) scale(1)` },
          { transform: `translate(${xDistance/2}px, ${-yDistance/2}px) rotate(${-rotationAmount/2}deg) scale(${scaleChange})` },
          { transform: `translate(0, 0) rotate(0deg) scale(1)` },
        ],
        {
          duration: duration * 1000,
          iterations: Infinity,
          easing: 'ease-in-out',
        }
      );

      container.appendChild(shape);
      shapes.push(shape);
    }

    // Enhanced parallax effect on mouse move with depth perception
    const handleBackgroundParallax = (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      shapes.forEach((shape, index) => {
        // More pronounced depth effect based on shape size
        const shapeSize = parseFloat(shape.style.width) || 50;
        const depth = (1 - (shapeSize / 150)) * 0.3 + 0.05; // Smaller shapes move more
        const moveX = (mouseX - 0.5) * depth * 100;
        const moveY = (mouseY - 0.5) * depth * 100;

        shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index * 5}deg)`;
      });
    };

    window.addEventListener('mousemove', handleBackgroundParallax);

    return () => {
      window.removeEventListener('mousemove', handleBackgroundParallax);
      if (container.parentNode) container.remove();
    };
  }, [shouldReduceMotion]);

  // Enhanced staggered subheading animation
  const subheadingWords = "Bienvenue sur mon portfolio — un parfait mélange de sobriété, minimalisme, et animation impressionnante.".split(' ');
  const subheadingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.075,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // Custom ease curve for smoother animation
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col md:flex-row justify-center items-center px-4 md:px-10 py-16 md:py-28 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      {/* Enhanced Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(circle at 60% 40%, rgba(234,179,8,0.18) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255,85,0,0.12) 0%, transparent 50%),
            linear-gradient(120deg, rgba(251,191,36,0.09) 0%, transparent 100%)
          `,
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.18, 0.24, 0.18],
          background: [
            `radial-gradient(circle at 60% 40%, rgba(234,179,8,0.18) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255,85,0,0.12) 0%, transparent 50%),
            linear-gradient(120deg, rgba(251,191,36,0.09) 0%, transparent 100%)`,

            `radial-gradient(circle at 65% 35%, rgba(234,179,8,0.2) 0%, transparent 65%),
            radial-gradient(circle at 15% 85%, rgba(255,85,0,0.15) 0%, transparent 55%),
            linear-gradient(130deg, rgba(251,191,36,0.11) 0%, transparent 100%)`,

            `radial-gradient(circle at 60% 40%, rgba(234,179,8,0.18) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255,85,0,0.12) 0%, transparent 50%),
            linear-gradient(120deg, rgba(251,191,36,0.09) 0%, transparent 100%)`
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Enhanced Floating Gold Accent Shapes */}
      <motion.div
        className="absolute left-1/3 top-1/3 w-72 h-40 -translate-x-1/2 -z-10 rounded-full blur-3xl opacity-40 bg-gradient-to-r from-gold to-yellow-300 dark:from-gold/70 dark:to-yellow-400/40"
        animate={{
          y: [0, 18, 0],
          x: [0, -15, 0],
          opacity: [0.32, 0.20, 0.32],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute right-1/4 bottom-1/3 w-64 h-32 -z-10 rounded-full blur-3xl opacity-30 bg-gradient-to-r from-orange/60 to-gold/40"
        animate={{
          y: [0, -12, 0],
          x: [0, 10, 0],
          opacity: [0.25, 0.15, 0.25],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 14, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Left Column */}
      <div className="relative z-10 flex flex-col items-start justify-center gap-6 max-w-xl w-full md:w-1/2 h-full py-12 sm:py-16 md:pr-8 md:items-start md:text-left">
        {/* Logo with enhanced animation */}
        {!logoInNavbar && (
          <motion.img
            src="/src/assets/Logo.svg"
            alt="Portfolio Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 mb-6 drop-shadow-2xl"
            layoutId="main-logo"
            initial={{ opacity: 0, x: -40, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              scale: 1.15,
              rotate: 5,
              filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.8))'
            }}
            whileTap={{ scale: 0.95, rotate: 0 }}
            role="img"
            aria-label="Portfolio Logo"
          />
        )}

        {/* Enhanced Heading with Glitch Effect */}
        <div className="overflow-hidden relative">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gold text-left max-w-lg mb-4 leading-tight drop-shadow-lg relative"
          >
            <motion.span
              className="inline-block"
              whileHover={{
                scale: 0.9,
                textShadow: "0 0 15px rgba(234, 179, 8, 0.7)"
              }}
            >
              Minimaliste.
            </motion.span>{" "}
            <motion.span
              className="inline-block relative text-orange overflow-hidden"
              whileHover={() => !shouldReduceMotion && {
                scale: 1.05,
                textShadow: "0 0 15px rgba(255, 85, 0, 0.7)"
              }}
              onMouseEnter={() => {
                if (shouldReduceMotion) return;
                const el = document.getElementById("animated-text");
                if (el) {
                  el.animate([
                    { clipPath: 'inset(0 0 0 0)' },
                    { clipPath: 'inset(30% 0 30% 0)' },
                    { clipPath: 'inset(0 0 0 0)' }
                  ], {
                    duration: 150,
                    iterations: 1,
                    easing: 'steps(2)'
                  });
                }
              }}
            >
              <span id="animated-text">Animé.</span>
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              whileHover={{
                textShadow: "0 0 15px rgba(234, 179, 8, 0.7)"
              }}
            >
              Impressionnant.
            </motion.span>
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            className="absolute bottom-2 left-0 h-1 bg-gold/50 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={isInView ? { width: '70%', opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Subheading with Enhanced Staggered Words */}
        <div className="text-lg sm:text-xl md:text-2xl text-subtle text-left max-w-lg leading-relaxed opacity-90">
          {subheadingWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={subheadingVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="inline-block mr-1"
              whileHover={{
                color: i % 3 === 0 ? '#EAB308' : i % 4 === 0 ? '#FF5500' : '',
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Enhanced Call to Action with Ripple Effect */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block px-6 py-3 sm:px-8 sm:py-4 border border-gold rounded-full text-gold hover:bg-gold hover:text-background hover:shadow-lg transition-all duration-300 font-semibold text-base sm:text-lg tracking-wide mt-8 overflow-hidden group"
          whileHover={{
            scale: 1.08,
            boxShadow: '0 0 30px rgba(234, 179, 8, 0.3)'
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: '0 0 30px rgba(234, 179, 8, 0.8)',
          }}
          role="button"
          aria-label="View Projects"
          onClick={(e) => {
            if (!shouldReduceMotion) {
              const btn = e.currentTarget;
              const ripple = document.createElement('span');
              ripple.className = 'absolute bg-gold/30 rounded-full';
              const diameter = Math.max(btn.clientWidth, btn.clientHeight) * 2.5;
              ripple.style.width = ripple.style.height = `${diameter}px`;
              ripple.style.left = `${e.clientX - btn.getBoundingClientRect().left - diameter / 2}px`;
              ripple.style.top = `${e.clientY - btn.getBoundingClientRect().top - diameter / 2}px`;
              ripple.style.transform = 'scale(0)';
              ripple.animate(
                { transform: 'scale(4)', opacity: 0 },
                { duration: 800, fill: 'forwards' }
              );
              btn.appendChild(ripple);
              setTimeout(() => ripple.remove(), 800);
            }
          }}
        >
          <span className="relative z-10 flex items-center">
            Voir les Projets
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 1 }}
              className="ml-2"
            >
              ↓
            </motion.span>
          </span>

          {/* Animated hover gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 bg-gradient-to-r from-gold/80 via-gold to-orange/80 -z-10 rounded-full"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>

        {/* Social Media Icons - New Addition */}
        <motion.div
          className="flex gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
        </motion.div>
      </div>

      {/* Right Column with Enhanced Robot 3D Spline */}
      <div className="relative w-full md:w-1/2 h-[320px] sm:h-[400px] md:h-[520px] lg:h-[600px] flex items-center justify-center overflow-hidden group md:pl-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isSplineLoaded ? 1 : 0,
            scale: isSplineLoaded ? 1 : 0.8,
          }}
          transition={{ delay: 1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full relative"
          style={{
            rotateX,
            rotateY,
            scale,
            rotateZ,
            y: floatY
          }}
          whileHover={!shouldReduceMotion ? {
            y: -15,
            scale: 1.05,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          } : {}}
        >
          {/* Background glow effect for 3D model */}
          <motion.div
            className="absolute w-4/5 h-1/2 left-1/2 bottom-10 -translate-x-1/2 rounded-full blur-3xl bg-gold/20 dark:bg-gold/10 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
              background: isDarkMode ?
                ['rgba(234,179,8,0.1)', 'rgba(234,179,8,0.2)', 'rgba(234,179,8,0.1)'] :
                ['rgba(234,179,8,0.2)', 'rgba(234,179,8,0.3)', 'rgba(234,179,8,0.2)']
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Enhanced Loading State */}
          <AnimatePresence>
            {!isSplineLoaded && (
              <motion.div
                className="w-full h-full flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-24 h-24 relative mb-8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full border-4 border-gold/20 border-t-gold rounded-full"></div>
                  <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-gold/50 rounded-full"
                    animate={{ rotate: [0, 180] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  ></motion.div>
                </motion.div>

                <motion.p
                  className="text-subtle text-lg"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Chargement du robot 3D...
                </motion.p>

                {/* Enhanced Fallback Image */}
                <motion.div
                  className="mt-8 relative w-1/2 opacity-30"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src="/src/assets/fallback-robot.png"
                    alt="Robot en attente"
                    className="w-full h-full object-contain"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background to-transparent"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Spline Component with Error Boundary */}
          <div
            className="w-full h-full max-w-[800px] mx-auto relative"
            style={{ visibility: isSplineLoaded ? 'visible' : 'hidden' }}
            aria-label="Modèle robot 3D interactif"
          >
            {/* Spotlight effect on hover */}
            <motion.div
              className="absolute inset-0 bg-radial-gradient opacity-0 pointer-events-none"
              animate={hasInteracted ? { opacity: 0.15 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(234,179,8,0.3) 0%, transparent 70%)',
                transform: `translate(${mouseX.get() * 100}px, ${mouseY.get() * 100}px)`
              }}
            />

            <SplineErrorBoundary>
              <Spline
                scene="https://prod.spline.design/6dMrMpdClICXKoRI/scene.splinecode"
                onLoad={() => {
                  setIsSplineLoaded(true);
                  console.log("Spline model loaded successfully");
                }}
                onError={(err) => {
                  console.error("Failed to load Spline model:", err);
                  setIsSplineLoaded(false);
                }}
              />
            </SplineErrorBoundary>
          </div>

          {/* Enhanced Interactive Hint */}
          <AnimatePresence>
            {isSplineLoaded && showInteractHint && !shouldReduceMotion && (
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-background/80 dark:bg-gray-900/80 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg"
                >
                  👆 Interagissez avec le modèle !
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
