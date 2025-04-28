import React, { useRef, useEffect, useState, Component, useMemo } from 'react';
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

export default function HeroV2({ logoInNavbar, isDarkMode }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [showInteractHint, setShowInteractHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mouseTrail, setMouseTrail] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [animationSequence, setAnimationSequence] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredWord, setHoveredWord] = useState(null);
  const [magneticActive, setMagneticActive] = useState(false);
  const MAX_TRAIL_POINTS = 12;
  const ctaRef = useRef(null);
  const orbsRef = useRef([]);
  
  // Particle system for advanced background effects
  const [particles, setParticles] = useState([]);
  const PARTICLE_COUNT = useMemo(() => isMobile ? 30 : 60, [isMobile]);

  // Audio feedback for interactions
  const playSound = (type) => {
    if (shouldReduceMotion) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    switch(type) {
      case 'hover':
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gain.gain.value = 0.1;
        break;
      case 'click':
        oscillator.type = 'triangle';
        oscillator.frequency.value = 660;
        gain.gain.value = 0.15;
        break;
      default:
        oscillator.type = 'sine';
        oscillator.frequency.value = 220;
        gain.gain.value = 0.05;
    }
    
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Initialize particles
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const newParticles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        color: [
          `rgba(234, 179, 8, ${Math.random() * 0.5 + 0.2})`,
          `rgba(255, 85, 0, ${Math.random() * 0.4 + 0.1})`,
          `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        ][Math.floor(Math.random() * 3)],
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        life: Math.random() * 100
      });
    }
    setParticles(newParticles);
    
    // Create dynamic orbs
    if (sectionRef.current) {
      const orbs = [];
      for (let i = 0; i < 3; i++) {
        const orb = document.createElement('div');
        orb.className = 'absolute rounded-full filter blur-xl';
        orb.style.width = `${Math.random() * 300 + 200}px`;
        orb.style.height = `${Math.random() * 300 + 200}px`;
        orb.style.background = i === 0 ? 
          'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(234,179,8,0) 70%)' : 
          i === 1 ? 
          'radial-gradient(circle, rgba(255,85,0,0.2) 0%, rgba(255,85,0,0) 70%)' :
          'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)';
        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 100}%`;
        orb.style.opacity = isDarkMode ? '0.4' : '0.6';
        orb.style.transform = 'translate(-50%, -50%)';
        orb.style.zIndex = '-5';
        sectionRef.current.appendChild(orb);
        orbsRef.current.push(orb);
        
        // Animate orbs
        const animateOrb = () => {
          const targetX = Math.random() * 100;
          const targetY = Math.random() * 100;
          
          orb.animate(
            [
              { left: `${orb.style.left}`, top: `${orb.style.top}` },
              { left: `${targetX}%`, top: `${targetY}%` }
            ],
            {
              duration: Math.random() * 15000 + 10000,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              fill: 'forwards'
            }
          ).onfinish = () => {
            orb.style.left = `${targetX}%`;
            orb.style.top = `${targetY}%`;
            animateOrb();
          };
        };
        
        animateOrb();
      }
    }
    
    return () => {
      orbsRef.current.forEach(orb => orb.remove());
      orbsRef.current = [];
    };
  }, [shouldReduceMotion, isDarkMode, PARTICLE_COUNT]);

  // Animation sequence controller
  useEffect(() => {
    if (isInView) {
      const sequence = [
        setTimeout(() => setAnimationSequence(1), 100),  // Logo
        setTimeout(() => setAnimationSequence(2), 600),  // Heading
        setTimeout(() => setAnimationSequence(3), 1100), // Subheading
        setTimeout(() => setAnimationSequence(4), 1600), // CTA
        setTimeout(() => setAnimationSequence(5), 2100)  // 3D Model & Social
      ];
      
      return () => sequence.forEach(timeout => clearTimeout(timeout));
    }
  }, [isInView]);

  // Performance detection
  const isLowPoweredDevice = () => {
    return (
      (window.navigator.hardwareConcurrency !== undefined && window.navigator.hardwareConcurrency <= 4) || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  };
  
  const effectIntensity = isLowPoweredDevice() ? 0.5 : 1;
  const optimizedShapeCount = isLowPoweredDevice() ? 
    (isMobile ? 5 : 12) : 
    (isMobile ? 10 : 25);

  const { scrollY } = useScroll();
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-12, 12]);
  const scale = useTransform(scrollY, [0, 300], shouldReduceMotion ? [1, 1] : [1, 1.1]);
  const rotateZ = useTransform(scrollY, [0, 300], shouldReduceMotion ? [0, 0] : [0, 10]);
  const floatY = useTransform(scrollY, [0, 200], shouldReduceMotion ? [0, 0] : [0, -20]);

  // Magnetic button effect
  useEffect(() => {
    if (shouldReduceMotion || !ctaRef.current) return;
    
    const handleMagneticEffect = (e) => {
      if (!magneticActive) return;
      
      const { left, top, width, height } = ctaRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = Math.max(width, height) * 1.5;
      
      if (distance < maxDistance) {
        const magneticPull = 0.4;
        const moveX = distanceX * magneticPull;
        const moveY = distanceY * magneticPull;
        
        ctaRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        ctaRef.current.style.transform = 'translate(0, 0)';
      }
    };
    
    window.addEventListener('mousemove', handleMagneticEffect);
    return () => window.removeEventListener('mousemove', handleMagneticEffect);
  }, [shouldReduceMotion, magneticActive]);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => setShowInteractHint(false), 3000);
    }
    
    // Update mouse trail with physics
    if (!shouldReduceMotion && !isMobile) {
      setMouseTrail(prev => {
        const newPoint = { 
          x: e.clientX, 
          y: e.clientY, 
          id: Date.now(),
          scale: Math.random() * 0.5 + 0.5,
          rotation: Math.random() * 360
        };
        return [newPoint, ...prev.slice(0, MAX_TRAIL_POINTS - 1)];
      });
    }
    
    // Update particles with mouse influence
    if (!shouldReduceMotion) {
      setParticles(prev => 
        prev.map(p => {
          const dx = e.clientX - p.x;
          const dy = e.clientY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.vx += dx * force * 0.02;
            p.vy += dy * force * 0.02;
          }
          
          return p;
        })
      );
    }
  };

  // Particle animation frame
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let animationId;
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(p => {
          // Apply physics
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.life -= 0.1;
          
          // Reset particles that go out of bounds or die
          if (p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight || p.life <= 0) {
            return {
              ...p,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              vx: Math.random() * 0.5 - 0.25,
              vy: Math.random() * 0.5 - 0.25,
              life: Math.random() * 100
            };
          }
          
          return p;
        })
      );
      
      animationId = requestAnimationFrame(animateParticles);
    };
    
    animationId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationId);
  }, [shouldReduceMotion]);

  // Handle touch events for mobile
  const handleTouch = (e) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const touch = e.touches[0];
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setCursorPos({ x: touch.clientX, y: touch.clientY });

    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => setShowInteractHint(false), 3000);
    }
    
    // Create ripple effect on touch
    if (!shouldReduceMotion && sectionRef.current) {
      const ripple = document.createElement('div');
      ripple.className = 'absolute rounded-full bg-gold/20 pointer-events-none z-50';
      ripple.style.left = `${touch.clientX}px`;
      ripple.style.top = `${touch.clientY}px`;
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.transform = 'translate(-50%, -50%)';
      
      document.body.appendChild(ripple);
      
      ripple.animate(
        [
          { width: '10px', height: '10px', opacity: 1 },
          { width: '300px', height: '300px', opacity: 0 }
        ],
        {
          duration: 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      ).onfinish = () => ripple.remove();
    }
  };

  useEffect(() => {
    if (isSplineLoaded && !shouldReduceMotion) {
      setTimeout(() => setShowInteractHint(true), 2000);
      setTimeout(() => !hasInteracted && setShowInteractHint(false), 8000);
    }
  }, [isSplineLoaded, shouldReduceMotion, hasInteracted]);

  // WebGL background effect
  useEffect(() => {
    if (shouldReduceMotion || !sectionRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 -z-20';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sectionRef.current.appendChild(canvas);
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    
    // WebGL setup with minimal shaders for good performance
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 center = vec2(0.5, 0.5);
        vec2 mousePos = mouse.xy / resolution;
        
        float dist = length(uv - center);
        float mouseDist = length(uv - mousePos) * 2.0;
        
        float ripple = sin(dist * 20.0 - time * 0.5) * 0.1;
        float mouseRipple = sin(mouseDist * 8.0 - time * 2.0) * 0.1;
        
        float r = 0.05 + 0.05 * sin(time * 0.3 + uv.x * 5.0 + ripple + mouseRipple);
        float g = 0.05 + 0.05 * cos(time * 0.4 + uv.y * 6.0 + ripple + mouseRipple);
        float b = 0.05 + 0.03 * sin(time * 0.5 + dist * 10.0 + ripple + mouseRipple);
        
        gl_FragColor = vec4(r, g, b, 0.3);
      }
    `;
    
    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // Set up buffers
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Get attribute locations
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');
    
    // Set resolution
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = canvas.height - e.clientY;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    let startTime = performance.now();
    let animationId;
    
    const render = () => {
      const time = (performance.now() - startTime) * 0.001;
      
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationId = requestAnimationFrame(render);
    };
    
    render();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (canvas.parentNode) canvas.remove();
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
  
  // Define social media accounts
  const socialMediaLinks = [
    { icon: "github", url: "https://github.com/username", label: "GitHub" },
    { icon: "linkedin", url: "https://linkedin.com/in/username", label: "LinkedIn" },
    { icon: "twitter", url: "https://twitter.com/username", label: "Twitter" },
    { icon: "dribbble", url: "https://dribbble.com/username", label: "Dribbble" }
  ];

  // Custom cursor
  const customCursorVariants = {
    default: {
      x: cursorPos.x - 16,
      y: cursorPos.y - 16,
      scale: 1
    },
    hover: {
      x: cursorPos.x - 30,
      y: cursorPos.y - 30,
      scale: 2.5,
      borderColor: "#EAB308",
      backgroundColor: "rgba(234, 179, 8, 0.1)",
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col md:flex-row justify-center items-center px-4 md:px-10 py-16 md:py-28 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouch}
      style={{ position: 'relative' }}
    >
      {/* Left Column */}
      <div className="relative w-full md:w-1/2 flex flex-col items-start justify-center">

      {/* WebGL particles */}
      {!shouldReduceMotion && particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            filter: 'blur(1px)',
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Custom cursor */}
      {!shouldReduceMotion && !isMobile && (
        <motion.div
          className="fixed w-8 h-8 rounded-full border-2 border-white mix-blend-difference pointer-events-none z-50"
          variants={customCursorVariants}
          animate={hoveredWord ? "hover" : "default"}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        />
      )}

      {/* Mouse trail effect */}
      {!shouldReduceMotion && !isMobile && mouseTrail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-50"
          style={{ 
            left: point.x, 
            top: point.y,
            x: "-50%",
            y: "-50%"
          }}
          initial={{ 
            opacity: 1, 
            scale: point.scale
          }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            rotate: point.rotation 
          }}
          transition={{ duration: 0.8 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path 
              d="M10 1L12.2451 6.90983H18.5106L13.1327 10.4459L15.3779 16.3557L10 12.8196L4.62215 16.3557L6.86729 10.4459L1.48944 6.90983H7.75486L10 1Z" 
              fill="rgba(234, 179, 8, 0.6)" 
              stroke="rgba(234, 179, 8, 0.8)"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      ))}

      {/* Enhanced Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: isDarkMode ? 
            `radial-gradient(circle at 60% 40%, rgba(234,179,8,0.14) 0%, transparent 60%),
             radial-gradient(circle at 20% 80%, rgba(255,85,0,0.08) 0%, transparent 50%),
             linear-gradient(120deg, rgba(251,191,36,0.07) 0%, transparent 100%)` :
            `radial-gradient(circle at 60% 40%, rgba(234,179,8,0.18) 0%, transparent 60%),
             radial-gradient(circle at 20% 80%, rgba(255,85,0,0.12) 0%, transparent 50%),
             linear-gradient(120deg, rgba(251,191,36,0.09) 0%, transparent 100%)`,
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [isDarkMode ? 0.14 : 0.18, isDarkMode ? 0.20 : 0.24, isDarkMode ? 0.14 : 0.18],
          background: isDarkMode ? [
            `radial-gradient(circle at 60% 40%, rgba(234,179,8,0.14) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255,85,0,0.08) 0%, transparent 50%),
            linear-gradient(120deg, rgba(251,191,36,0.07) 0%, transparent 100%)`,

            `radial-gradient(circle at 65% 35%, rgba(234,179,8,0.16) 0%, transparent 65%),
            radial-gradient(circle at 15% 85%, rgba(255,85,0,0.11) 0%, transparent 55%),
            linear-gradient(130deg, rgba(251,191,36,0.09) 0%, transparent 100%)`,

            `radial-gradient(circle at 60% 40%, rgba(234,179,8,0.14) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255,85,0,0.08) 0%, transparent 50%),
            linear-gradient(120deg, rgba(251,191,36,0.07) 0%, transparent 100%)`
          ] : [
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
      {/* Logo rendering - fix orphaned props by wrapping with an element */}
      {logoInNavbar && (
        <motion.img
          src="/src/assets/logo.png"
          alt="Portfolio Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 mb-6 drop-shadow-2xl"
          layoutId="main-logo"
          initial={{ opacity: 0, x: -40, rotate: -10 }}
          animate={animationSequence >= 1 ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: -40, rotate: -10 }}
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
            animate={animationSequence >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
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
            animate={animationSequence >= 2 ? { width: '70%', opacity: 1 } : { width: 0, opacity: 0 }}
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
              animate={animationSequence >= 3 ? 'visible' : 'hidden'}
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

        {/* Enhanced Call to Action with Ripple Effect and Improved Accessibility */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={animationSequence >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
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
          aria-label="Voir les projets"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
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

        {/* Enhanced Social Media Links with Hover Effects */}
        <motion.div
          className="flex gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={animationSequence >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
        </motion.div>
      </div>
      {/* End Left Column */}

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
          {/* Background glow effect for 3D model - enhanced for dark mode */}
          <motion.div
            className="absolute w-4/5 h-1/2 left-1/2 bottom-10 -translate-x-1/2 rounded-full blur-3xl bg-gold/20 dark:bg-gold/10 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [isDarkMode ? 0.12 : 0.15, isDarkMode ? 0.22 : 0.25, isDarkMode ? 0.12 : 0.15],
              background: isDarkMode ?
                ['rgba(234,179,8,0.1)', 'rgba(234,179,8,0.18)', 'rgba(234,179,8,0.1)'] :
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
              animate={hasInteracted ? { opacity: isDarkMode ? 0.2 : 0.15 } : { opacity: 0 }}
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

            {/* 3D model accessibility label for screen readers */}
            <div className="sr-only">
              Modèle 3D d'un robot interactif qui peut être pivoté en déplaçant votre souris ou en touchant l'écran.
            </div>
          </div>

          {/* Enhanced Interactive Hint with better visibility in dark mode */}
          <AnimatePresence>
            {isSplineLoaded && showInteractHint && !shouldReduceMotion && (
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-background/80 dark:bg-gray-900/80 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-gold/30"
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

      {/* Added Scroll Indicator for better UX */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      >
        <span className="text-subtle mb-2 text-sm">Découvrir plus</span>
        <motion.div 
          className="w-5 h-10 border-2 border-subtle rounded-full flex items-start justify-center p-1"
        >
          <motion.div 
            className="w-1 h-2 bg-gold rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Add Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="absolute top-0 left-0 p-3 bg-gold text-background transform -translate-y-full focus:translate-y-0 transition-transform z-50"
      >
        Passer au contenu principal
      </a>
    </section>
  );
}