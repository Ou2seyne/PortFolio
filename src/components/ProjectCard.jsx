import React, { useState, forwardRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard = forwardRef(({ project, isSelected, onClick, priority = 0, isDarkMode }, ref) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);


  useEffect(() => {
    const img = new Image();
    img.src = project.image || '/api/placeholder/400/225';
    img.onload = () => setIsImageLoaded(true);
  }, [project.image]);

  const interactionState = isHovered || isFocused;

  return (
    <motion.div
      ref={ref}
      layoutId={`project-${project.title}`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: priority * 0.08,
        layout: { duration: 0.4, type: 'spring', stiffness: 120, damping: 18 },
      }}
      className={`relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer
        ${isDarkMode
          ? `border-neutral-800 bg-neutral-900/40 backdrop-blur-sm ${interactionState ? 'border-gold/70 shadow-[0_4px_32px_0_rgba(234,179,8,0.18)]' : ''}`
          : `border-gray-200 bg-white/40 backdrop-blur-sm ${interactionState ? 'border-blue-400 shadow-[0_4px_32px_0_rgba(37,99,235,0.13)]' : ''}`
        }
        transform-gpu hover:scale-[1.02] focus-within:scale-[1.02]`}
      whileTap={{ scale: 0.975 }}
      role="button"
      tabIndex={0}
      aria-label={`Voir les détails pour ${project.title}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="aspect-video overflow-hidden relative bg-transparent">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M2 12.5V6.5C2 4.01 4.01 2 6.5 2H12"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 3L22 8"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M22 3L17 8"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M22 12V17.5C22 19.99 19.99 22 17.5 22H6.5C4.01 22 2 19.99 2 17.5V17"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M2 15H22"
              />
            </svg>
          </div>
        )}
        <motion.img
          src={project.image || '/api/placeholder/400/225'}
          alt={`Aperçu du projet ${project.title}`}
          loading={priority < 3 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transform: interactionState ? 'scale(1.05)' : 'scale(1)',
            willChange: 'transform',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: interactionState ? 0.75 : 0.6 }}
        />
      </div>

      {/* Tag Badge */}
      <motion.div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-10 ${
          isDarkMode 
            ? 'bg-neutral-900/90 text-gold border border-gold/30' 
            : 'bg-white/95 text-blue-600 border border-gray-200'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: priority * 0.08 + 0.2 }}
      >
        {project.tag}
      </motion.div>

      {/* Content */}
      <div className="p-5 relative z-10">
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {project.title}
        </h3>
        <p className={`mb-4 line-clamp-2 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {project.description}
        </p>
        
        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {project.tools.map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 + priority * 0.08 }}
                className={`text-xs px-2 py-1 rounded-md ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-gray-300 border-neutral-700' 
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                } border flex items-center`}
                whileHover={{ scale: 1.08, y: -1 }}
              >
                <span className={`w-2 h-2 rounded-full mr-1 ${
                  isDarkMode ? 'bg-gold' : 'bg-blue-500'
                }`}></span>
                {tool}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Actions */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: priority * 0.08 + 0.3 }}
        >
          <motion.button
            onClick={onClick}
            className={`text-xs font-medium flex items-center gap-1 group ${
              isDarkMode ? 'text-gold hover:text-gold/80' : 'text-blue-600 hover:text-blue-700'
            } transition-colors`}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Voir les détails du projet ${project.title}`}
          >
            Voir détails
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
          
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
              isDarkMode 
                ? 'bg-gold text-neutral-900 hover:bg-gold/90' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Visiter le site du projet ${project.title}`}
          >
            Visiter
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
      
      {/* Bottom highlight line */}
      <motion.div 
        className={`absolute bottom-0 left-0 h-1 ${isDarkMode ? 'bg-gold' : 'bg-blue-500'} origin-left`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: interactionState ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Focus state highlight */}
      {isFocused && (
        <motion.div 
          className={`absolute inset-0 rounded-xl pointer-events-none ring-2 ${isDarkMode ? 'ring-gold' : 'ring-blue-500'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;