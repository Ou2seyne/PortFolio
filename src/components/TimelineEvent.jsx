import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TimelineEvent({ item, idx }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      x: idx % 2 === 0 ? -50 : 50,
      y: 20
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: idx * 0.2,
        ease: [0.6, 0.05, 0.01, 0.99]
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.3)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  const circleVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10,
        delay: idx * 0.2 + 0.3
      }
    },
    hover: {
      scale: 1.2,
      rotate: [0, 5, -5, 0],
      boxShadow: "0 0 25px rgba(234, 179, 8, 0.8)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  // Pulse animation for the timeline dot
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && !isExpanded) {
        setIsHovered(true);
        setTimeout(() => setIsHovered(false), 1000);
      }
    }, 5000 + (idx * 1000)); // Stagger the pulse animation

    return () => clearInterval(interval);
  }, [isHovered, isExpanded, idx]);

  return (
    <div className="relative group">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
      
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className={`relative flex ${idx % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start'} w-full min-h-[200px] py-10`}
      >
        {/* Timeline circle */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 w-14 h-14 
                    bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center 
                    z-10 border-4 border-white dark:border-white/50 cursor-pointer shadow-lg"
          variants={circleVariants}
          whileHover="hover"
          animate={isHovered ? "hover" : "animate"}
          tabIndex={0}
          aria-label="Expand timeline event"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click();
          }}
        >
          <motion.span 
            className="text-xl text-white"
            animate={isExpanded ? { rotateZ: 180 } : { rotateZ: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isExpanded ? "×" : item.icon}
          </motion.span>
          
          {/* Pulse effect */}
          <AnimatePresence>
            {(isHovered && !isExpanded) && (
              <motion.div
                className="absolute w-full h-full rounded-full bg-gold/40"
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Event card */}
        <motion.div
          className={`rounded-xl px-8 py-6 shadow-xl border border-neutral-200 dark:border-gold/30 text-left
                    ${idx % 2 === 0 ? 'md:mr-12' : 'md:ml-12'} mx-auto md:mx-0
                    relative md:w-[380px] cursor-pointer bg-white dark:bg-black 
                    backdrop-blur-sm text-neutral-800 dark:text-neutral-300 transition-colors duration-300
                    hover:border-gold/50`}
          onClick={() => setIsExpanded(!isExpanded)}
          variants={cardVariants}
          whileHover="hover"
          layout
        >
          {/* Year badge with gradient */}
          <div className="absolute -top-3 -left-2 bg-gradient-to-r from-gold to-yellow-500 px-4 py-1.5 
                         rounded-lg text-sm font-bold text-white dark:text-black shadow-lg transform -rotate-2">
            {item.year}
          </div>

          {/* Connection line from timeline to card */}
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${idx % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} 
                          w-12 h-0.5 bg-gradient-to-r from-gold/80 to-transparent ${idx % 2 === 0 ? '' : 'rotate-180'} hidden md:block`} />

          <div className="mt-5">
            {/* Title with gradient text */}
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500 
                          font-bold text-xl mb-3 tracking-tight">
              {item.title}
            </h3>
            
            <p className="text-neutral-700 dark:text-neutral-300 text-base leading-relaxed">
              {item.desc}
            </p>

            {/* Expanded details section */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="mt-6 pt-5 border-t border-gold/20"
                >
                  <div className="space-y-4">
                    <p className="text-black dark:text-white leading-relaxed">
                      {item.details}
                    </p>
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click indicator */}
            <motion.div
              className="mt-4 text-gold dark:text-yellow-400 flex items-center gap-1.5 text-sm font-medium"
              animate={{ 
                y: isExpanded ? 0 : [0, 5, 0], 
                opacity: isExpanded ? 0 : 1,
                transition: {
                  y: {
                    repeat: isExpanded ? 0 : Infinity,
                    repeatDelay: 1.5,
                    duration: 1
                  }
                }
              }}
            >
              {!isExpanded && (
                <>
                  <span>Voir plus de détails</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default TimelineEvent;