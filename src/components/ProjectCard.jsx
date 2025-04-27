import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = forwardRef(({ project, isSelected, onClick, priority = 0, isDarkMode }, ref) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      layoutId={`project-${project.title}`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.7,
        delay: priority * 0.06,
        layout: { duration: 0.5, type: 'spring', stiffness: 100 },
      }}
      className={`relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group
        ${isDarkMode
          ? 'border-neutral-700 bg-transparent hover:border-gold/70 hover:shadow-[0_4px_32px_0_rgba(234,179,8,0.18)]'
          : 'border-gray-200 bg-transparent hover:border-blue-400 hover:shadow-[0_4px_32px_0_rgba(37,99,235,0.13)]'
        }
        hover:scale-[1.03]`}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={`Voir les détails pour ${project.title}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video overflow-hidden relative bg-transparent">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-700 animate-pulse flex items-center justify-center">
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
          alt={`Image of project ${project.title}: ${project.description}`} // More descriptive alt text
          loading={priority < 3 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-all duration-500 ease-out"
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transform: isHovered ? 'scale(1.02)' : 'scale(1)', // Reduced scale
            willChange: 'transform', // Optimized for performance
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity duration-300"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: isHovered ? 0.7 : 0.5 }}
        />
      </div>

      <motion.div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-10 ${
          isDarkMode 
            ? 'bg-neutral-900/80 text-gold border border-gold/30' 
            : 'bg-white/90 text-gray-800 border border-gray-300'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        {project.tag}
      </motion.div>

      <div className="p-5 relative z-10">
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {project.title}
        </h3>
        <p className={`mb-4 line-clamp-2 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tools.map(tool => (
            <motion.span
              key={tool}
              className={`text-xs px-2 py-1 rounded-md ${
                isDarkMode 
                  ? 'bg-neutral-700 text-gray-200 border-neutral-600' 
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              } border flex items-center`}
              whileHover={{ scale: 1.05 }}
            >
              <span className={`w-2 h-2 rounded-full mr-1 ${isDarkMode ? 'bg-gold' : 'bg-gray-500'}`}></span>
              {tool}
            </motion.span>
          ))}
        </div>
        
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={onClick}
            className={`text-xs font-medium flex items-center gap-1 ${
              isDarkMode ? 'text-gold hover:text-gold/80' : 'text-gray-700 hover:text-gray-900'
            } transition-colors`}
            whileHover={{ scale: 1.05, x: 3 }}
          >
            Voir détails
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
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
                ? 'bg-gold text-gray-900 hover:bg-gold/90' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => e.stopPropagation()}
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
      
      <motion.div 
        className={`absolute bottom-0 left-0 h-1 bg-gold origin-left`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

export default ProjectCard;