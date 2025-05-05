import React from 'react';
import { motion } from 'framer-motion';

function SkillCard({ skill, isDarkMode, index }) {
  // Animation variants for entry
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      key={`${skill.name}-${skill.category}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl p-5 text-customyellow border relative h-full flex flex-col
        ${isDarkMode 
          ? 'bg-neutral-900 text-gray-100 border-customyellow hover:border-customyellow/60' 
          : 'bg-white text-gray-800 border-customyellow hover:border-customyellow'
        } transition-colors duration-200`}
      role="article"
      aria-label={`${skill.name} skill card - ${skill.proficiency}% proficiency`}
      tabIndex={0}
    >

      {/* Logo Container */}
      <div
        className="w-20 h-20 mx-auto mb-4 rounded-lg flex items-center justify-center"
        style={{
          background: isDarkMode
            ? 'rgba(38, 38, 38, 0.8)'
            : 'rgba(245, 245, 245, 0.8)'
        }}
      >
        <img
          src={skill.logo}
          alt={skill.name}
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Skill name */}
      <h3 className={`text-xl mb-3 font-semibold line-clamp-2 h-14 flex items-center justify-center ${!isDarkMode ? 'text-black' : ''}`}>
        {skill.name}
      </h3>
      {/* Progress indicator */}
      <div className="w-full mt-3">
        <div className={`flex justify-between text-xs mb-1 ${!isDarkMode ? 'text-black' : ''}`}>
          <span className="opacity-70">Proficiency</span>
          <span>{skill.proficiency}%</span>
        </div>
        <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-customyellow"
            initial={{ width: 0 }}
            animate={{ width: `${skill.proficiency}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(SkillCard);