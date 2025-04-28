import React, { useState } from 'react';
import { motion } from 'framer-motion';

function SkillCard({ skill, isDarkMode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={`${skill.name}-${skill.category}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`rounded-3xl px-8 py-6 text-center font-semibold shadow-lg border border-neutral-300 dark:border-gold/50 relative group bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-gray-900 dark:text-gray-50 transition-all duration-300 overflow-hidden`}
      whileHover={{
        scale: 1.05,
        rotateY: 10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        borderColor: "rgba(234, 179, 8, 0.8)",
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role="article"
      aria-label={`${skill.name} skill card`}
      tabIndex={0}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <svg className="absolute top-3 right-3 w-10 h-10 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-background/30"
        />
        <motion.circle
          cx="20"
          cy="20"
          r="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 16}
          strokeDashoffset={2 * Math.PI * 16 * (1 - skill.proficiency / 100)}
          className="text-gold"
          initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - skill.proficiency / 100) }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        {isHovered && (
          <motion.div
            className="absolute top-full right-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {skill.proficiency}% Proficiency
          </motion.div>
        )}
      </svg>

      <motion.div className="w-16 h-16 mx-auto mb-4 p-3 rounded-full bg-background/30 flex items-center justify-center shadow-inner">
        <motion.img
          src={skill.logo}
          alt={skill.name}
          className="w-12 h-12 transition-transform duration-300"
          animate={{ rotate: isHovered ? 10 : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        />
      </motion.div>

      <div className="block text-lg mb-2 text-gold font-bold line-clamp-2 overflow-hidden h-12">{skill.name}</div>

      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/10 to-transparent opacity-0 -z-10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default SkillCard;
