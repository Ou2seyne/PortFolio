import React, { useState } from 'react';

function SkillCard({ skill, isDarkMode, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
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

  // Calculate a vibrant accent color based on proficiency
  const accentColor = skill.proficiency >= 80 ? 'bg-green-500' : 
                      skill.proficiency >= 60 ? 'bg-blue-500' : 
                      skill.proficiency >= 40 ? 'bg-yellow-500' : 'bg-orange-500';
  
  return (
    <div
      className={`rounded-xl p-6 relative h-full flex flex-col transform transition-all duration-300 
        ${isHovered ? 'scale-105 shadow-lg z-10' : 'scale-100'}
        ${isDarkMode 
          ? 'bg-neutral-900 text-gray-100 border-2 border-customyellow/30' 
          : 'bg-white text-gray-800 border-2 border-customyellow/20'
        }`}
      role="article"
      aria-label={`${skill.name} skill card - ${skill.proficiency}% proficiency`}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? (isDarkMode ? '0 8px 24px rgba(255, 204, 0, 0.15)' : '0 8px 24px rgba(255, 204, 0, 0.2)') : 'none'
      }}
    >

      {/* Logo Container with hover effect */}
      <div
        className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center transform transition-all duration-300 
          ${isDarkMode 
            ? 'bg-neutral-800' 
            : 'bg-gray-100'} 
          ${isHovered ? 'rotate-3 scale-110' : ''}`}
        style={{
          boxShadow: isDarkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.5)'
        }}
      >
        <img
          src={skill.logo}
          alt={skill.name}
          className="w-12 h-12 object-contain transition-transform duration-300"
        />
      </div>

      {/* Skill name with animated underline on hover */}
      <div className="relative text-center mb-4">
        <h3 className={`text-xl font-semibold line-clamp-2 h-14 flex items-center justify-center 
          ${!isDarkMode ? 'text-gray-800' : 'text-gray-100'}`}>
          {skill.name}
        </h3>
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-customyellow transition-all duration-300 rounded-full
          ${isHovered ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}></div>
      </div>

      {/* Progress indicator with animated fill */}
      <div className="w-full mt-auto">
        <div className={`flex justify-between text-sm mb-2 font-medium 
          ${!isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>
          <span>Maîtrise</span>
          <span className={`font-bold ${isHovered ? 'text-customyellow' : ''}`}>{skill.proficiency}%</span>
        </div>
        <div className="relative w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div
            className={`absolute top-0 left-0 h-full rounded-full bg-customyellow 
              ${isHovered ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${skill.proficiency}%`,
              transition: 'width 0.8s ease-in-out, background-color 0.3s'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SkillCard);