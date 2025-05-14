import React from 'react';
import { motion } from 'framer-motion';

function SkillCard({ skill, isDarkMode }) {
  // Calculate a subtle accent color based on proficiency
  const getAccentColor = () => {
    if (skill.proficiency >= 90) return isDarkMode ? 'bg-gold' : 'bg-gold';
    if (skill.proficiency >= 75) return isDarkMode ? 'bg-gold/90' : 'bg-gold/90';
    if (skill.proficiency >= 60) return isDarkMode ? 'bg-customyellow/90' : 'bg-customyellow/90';
    return isDarkMode ? 'bg-customyellow/80' : 'bg-customyellow/80';
  };

  // Get skill level label
  const getSkillLevel = () => {
    if (skill.proficiency >= 90) return 'Expert';
    if (skill.proficiency >= 75) return 'Advanced';
    if (skill.proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  };

  // Calculate experience in years with proper labeling
  const getExperienceLabel = () => {
    const years = skill.years || 0;
    if (years === 0) return 'Just started';
    if (years < 1) return `${Math.round(years * 12)} months`;
    return years === 1 ? '1 year' : `${years} years`;
  };

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden ${
        isDarkMode 
          ? 'bg-accent border border-subtle/40' 
          : 'bg-white border border-gold/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        y: -4,
        boxShadow: isDarkMode
          ? '0 4px 12px -2px rgba(0, 0, 0, 0.2), 0 0 4px -1px rgba(251, 191, 36, 0.1)'
          : '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 0 4px -1px rgba(251, 191, 36, 0.15)'
      }}
    >
      {/* Top accent line */}
      <div className={`h-1 w-full ${getAccentColor()}`} />
      
      <div className="p-5">
        {/* Header: Logo and name */}
        <div className="flex items-center mb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center mr-3 ${
            isDarkMode ? 'bg-subtle/70' : 'bg-gray-50'
          }`}>
            <img 
              src={skill.logo} 
              alt={`${skill.name} logo`}
              className="w-6 h-6 object-contain"
              loading="lazy"
            />
          </div>
          
          <div>
            <h3 className={`text-base font-medium ${
              isDarkMode ? 'text-foreground' : 'text-gray-800'
            }`}>
              {skill.name}
            </h3>
            
            <p className={`text-xs ${
              isDarkMode ? 'text-foreground/70' : 'text-gray-600'
            }`}>
              {skill.category || 'Technology'}
            </p>
          </div>
        </div>
        
        {/* Proficiency meter */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className={`text-xs ${
              isDarkMode ? 'text-foreground/60' : 'text-gray-500'
            }`}>
              Proficiency
            </span>
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-gold' : 'text-customyellow'
            }`}>
              {getSkillLevel()}
            </span>
          </div>
          
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${
            isDarkMode ? 'bg-background' : 'bg-gray-100'
          }`}>
            <motion.div
              className={`h-full rounded-full ${getAccentColor()}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        </div>
        
        {/* Experience indicator */}
        {skill.years !== undefined && (
          <div className="flex items-center justify-between">
            <span className={`text-xs ${
              isDarkMode ? 'text-foreground/60' : 'text-gray-500'
            }`}>
              Experience
            </span>
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-foreground' : 'text-gray-800'
            }`}>
              {getExperienceLabel()}
            </span>
          </div>
        )}
        
        {/* Percentage badge */}
        <div className="mt-4 flex justify-end">
          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            isDarkMode 
              ? 'bg-gold/10 text-gold' 
              : 'bg-gold/10 text-gold'
          }`}>
            {Math.round(skill.proficiency)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(SkillCard);