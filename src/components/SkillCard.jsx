import React from 'react';
import { motion } from 'framer-motion';

function SkillCard({ skill, isDarkMode }) {
  const getExperienceLabel = () => {
    const years = skill.years || 0;
    if (years === 0) return 'Just started';
    if (years < 1) return `${Math.round(years * 12)} mois`;
    return years === 1 ? '1 ans' : `${years} ans`;
  };

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden p-5 backdrop-blur-xl border shadow-lg transition-colors duration-300 group
        ${isDarkMode 
          ? 'bg-white/10 border-white/15 text-white' 
          : 'bg-white/60 border-white/30 text-gray-900'
        }`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
      tabIndex={0}
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(40,40,40,0.25) 0%, rgba(255,255,255,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)',
        boxShadow:
          '0 4px 30px rgba(0, 0, 0, 0.12)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.3)'
      }}
    >
      {/* Header: Logo and name */}
      <div className="flex items-center mb-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center mr-3
          ${isDarkMode ? 'bg-white/10' : 'bg-white/70'}`}>
          <img 
            src={skill.logo} 
            alt={`${skill.name} logo`} 
            className="w-6 h-6 object-contain" 
            loading="lazy" 
          />
        </div>

        <div>
          <h3 className="text-base font-medium">{skill.name}</h3>
          <p className="text-xs opacity-70">{skill.category || 'Technology'}</p>
        </div>
      </div>

      {/* Proficiency meter */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className={`text-xs font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {Math.round(skill.proficiency)}%
          </span>
        </div>

        <div className={`h-1.5 w-full rounded-full overflow-hidden 
          ${isDarkMode ? 'bg-white/20' : 'bg-gray-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out
              ${isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'}`}
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>

      {/* Experience indicator */}
      {skill.years !== undefined && (
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="opacity-70">Experience</span>
          <span className="font-medium">{getExperienceLabel()}</span>
        </div>
      )}

      {/* Percentage badge */}
      <div className="mt-4 flex justify-end">
        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-500">
          {Math.round(skill.proficiency)}%
        </div>
      </div>
      {/* Subtle glassy hover shimmer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.6 }}
        style={{
          background:
            'linear-gradient(120deg, rgba(255,255,255,0.13) 10%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.05) 100%)',
          filter: 'blur(2px)',
          transition: 'opacity 0.4s',
        }}
      />
    </motion.div>
  );
}

export default React.memo(SkillCard);
