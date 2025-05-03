import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

function SkillCard({ skill, isDarkMode, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const cardRef = useRef(null);
  const sparkleCount = 12; // Increased number of sparkles

  // Create more varied sparks
  const sparks = Array.from({ length: sparkleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 0.8,
    duration: Math.random() * 1 + 0.5,
    color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fcd34d' : '#f59e0b' // Mix of colors
  }));

  useEffect(() => {
    if (isHovered || isFocused) {
      // Enhanced hover effect with mouse position-based rotation
      const rotateX = mousePosition.y * 10 - 5; // -5 to 5 degrees
      const rotateY = (mousePosition.x * 10 - 5) * -1; // -5 to 5 degrees (inverted)
      
      controls.start({
        scale: 1.05,
        rotateX,
        rotateY,
        boxShadow: isDarkMode 
          ? "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(234, 179, 8, 0.3)" 
          : "0 20px 40px rgba(0,0,0,0.25), 0 0 20px rgba(234, 179, 8, 0.2)",
        borderColor: "rgba(234, 179, 8, 0.8)",
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    } else {
      controls.start({
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        boxShadow: isDarkMode 
          ? "0 10px 20px rgba(0,0,0,0.2)" 
          : "0 10px 20px rgba(0,0,0,0.1)",
        borderColor: isDarkMode ? "rgba(234, 179, 8, 0.5)" : "rgba(0, 0, 0, 0.1)",
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    }
  }, [isHovered, isFocused, isDarkMode, controls, mousePosition]);

  // Animation variants for entry and exit
  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: { opacity: 0, y: -20, rotateX: -15 }
  };

  return (
    <motion.div
      ref={cardRef}
      key={`${skill.name}-${skill.category}`}
      variants={cardVariants}
      initial="hidden"
      exit="exit"
      className={`rounded-3xl px-8 py-6 text-center font-semibold shadow-lg border relative group
        bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-gray-900 dark:text-gray-50
        transition-all duration-300 overflow-hidden isolate
        ${isDarkMode ? 'border-gold/30' : 'border-neutral-300'}`}
      animate='visible'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => { setIsHovered(true); setIsFocused(true); }}
      onBlur={() => { setIsHovered(false); setIsFocused(false); }}
      role="article"
      aria-label={`${skill.name} skill card - ${skill.proficiency}% proficiency`}
      tabIndex={0}
      style={{ 
        perspective: '1000px', 
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Frosted glass effect background */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isDarkMode ? 0.05 : 0.1,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)' 
            : 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)'
        }}
      />

      {/* Golden halo effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: (isHovered || isFocused) ? (isDarkMode ? 0.4 : 0.3) : 0,
          boxShadow: (isHovered || isFocused) ? 
            isDarkMode ? '0 0 50px 15px rgba(234, 179, 8, 0.5)' : '0 0 40px 10px rgba(234, 179, 8, 0.4)' 
            : 'none'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ 
          border: '2px solid transparent',
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude'
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: (isHovered || isFocused) ? 1 : 0,
          background: (isHovered || isFocused) ? 
            'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b, #f59e0b) border-box' : 
            'linear-gradient(90deg, transparent, transparent) border-box',
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Sparkling particles */}
      <AnimatePresence>
        {(isHovered || isFocused) && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {sparks.map(spark => (
              <motion.div
                key={spark.id}
                className="absolute rounded-full"
                style={{ background: spark.color }}
                initial={{
                  opacity: 0,
                  x: `${spark.x}%`,
                  y: `${spark.y}%`,
                  width: 0,
                  height: 0
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  x: `${spark.x + (Math.random() * 30 - 15)}%`,
                  y: `${spark.y + (Math.random() * 30 - 15)}%`,
                  filter: "blur(0.5px)"
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: spark.delay,
                  duration: spark.duration,
                  repeat: Infinity,
                  repeatType: 'mirror'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Animated skill circle */}
      <div className="absolute top-3 right-3 w-12 h-12 -rotate-90">
        <svg className="w-full h-full">
          {/* Background track */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className={isDarkMode ? "text-gold/20" : "text-gray-300"}
          />
        </svg>
      </div>

      {/* Enhanced 3D logo container */}
      <motion.div
        className="w-20 h-20 mx-auto mb-4 p-3 rounded-full flex items-center justify-center relative"
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(63,63,70,0.8) 0%, rgba(24,24,27,0.8) 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(229,229,229,0.9) 100%)',
          boxShadow: isDarkMode
            ? 'inset 0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.2)'
            : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)'
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: isDarkMode
            ? 'inset 0 2px 8px rgba(234,179,8,0.3), 0 6px 12px rgba(234,179,8,0.2)'
            : 'inset 0 2px 8px rgba(234,179,8,0.2), 0 6px 12px rgba(234,179,8,0.1)'
        }}
      >

        {/* Logo with enhanced animations */}
        <motion.img
          src={skill.logo}
          alt={skill.name}
          className="w-12 h-12 object-contain"
          animate={{
            rotate: isHovered ? [0, 5, -5, 0] : 0,
            scale: isHovered ? 1.15 : 1,
            y: isHovered ? [0, -5, 0] : 0,
            filter: isHovered ? "drop-shadow(0 0 8px rgba(234,179,8,0.5))" : "none"
          }}
          transition={{
            duration: 0.6,
            type: 'spring',
            stiffness: 300
          }}
        />
        
        {/* Enhanced reflection effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, transparent 70%)',
            mixBlendMode: 'overlay'
          }}
          animate={{ 
            opacity: isHovered ? 0.7 : 0.3,
            x: mousePosition.x * 5 - 2.5,
            y: mousePosition.y * 5 - 2.5
          }}
        />
      </motion.div>

      {/* Skill name with animated gradient */}
      <motion.h3
        className="text-xl mb-2 font-bold line-clamp-2 overflow-hidden h-12"
        style={{
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          backgroundImage: isDarkMode
            ? 'linear-gradient(45deg, #fbbf24, #f59e0b, #eab308, #f59e0b)'
            : 'linear-gradient(45deg, #d97706, #f59e0b, #fbbf24, #d97706)',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%'
        }}
        transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
      >
        {skill.name}
      </motion.h3>

      {/* Enhanced progress bar with animated glow */}
      <div className="relative w-full mt-4">
        <motion.div
          className="w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
            initial={{ width: 0 }}
            animate={{ width: `${skill.proficiency}%` }}
            transition={{ duration: 1.5, delay: 0.8, type: 'spring' }}
          />
        </motion.div>
        
        {/* Glow effect for progress bar */}
        <AnimatePresence>
          {(isHovered || isFocused) && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}z
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="h-full rounded-full bg-amber-400"
                style={{ 
                  width: `${skill.proficiency}%`,
                  filter: "blur(4px)"
                }}
                animate={{ 
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity 
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skill category tag */}
      {skill.category && (
        <motion.div
          className={`mt-3 text-xs px-2 py-1 rounded-full inline-block
            ${isDarkMode ? 'bg-gray-800 text-gold' : 'bg-amber-100 text-amber-800'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            background: isHovered ? 
              (isDarkMode ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.2)') : 
              (isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(254, 243, 199, 0.8)')
          }}
          transition={{ delay: 1 }}
        >
          {skill.category}
        </motion.div>
      )}

      {/* Light effect overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent"
          animate={{
            x: mousePosition.x * 10 - 5,
            y: mousePosition.y * 10 - 5,
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.15)_0%,_transparent_70%)]"
          animate={{
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default React.memo(SkillCard);