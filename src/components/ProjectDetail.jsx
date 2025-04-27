import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function ProjectDetail({ project, onClose, uniqueKey, isDarkMode }) {
  if (!project) return null;

  useEffect(() => {
    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Enhanced with gradient backgrounds based on project type
  const getGradientClass = (tag) => {
    switch(tag) {
      case 'Web App':
        return 'from-blue-900/20 to-purple-900/30';
      case 'Mobile':
        return 'from-green-900/20 to-teal-900/30';
      case 'AI':
        return 'from-red-900/20 to-orange-900/30';
      case 'Website':
      default:
        return 'from-gray-900/20 to-blue-900/30';
    }
  };

  return (
    <motion.div
      key={`modal-${uniqueKey}`}
      layoutId={`project-${project.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/40 dark:bg-black/70"
      style={{ overflowY: 'auto' }}
      role="dialog"
      aria-labelledby={`modal-title-${project.title}`}
      aria-describedby={`modal-desc-${project.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 0.85, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        onClick={onClose}
        className={`absolute inset-0 ${isDarkMode ? 'bg-background/90' : 'bg-gray-800/90'}`}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      />
      
      <motion.div
        className={`rounded-2xl overflow-hidden w-full max-w-5xl relative z-10 shadow-2xl border ${
          isDarkMode ? 'border-gold/30' : 'border-gray-300'
        } max-h-[90vh] flex flex-col md:flex-row bg-gradient-to-br ${
          isDarkMode ? getGradientClass(project.tag) : 'from-white to-gray-100'
        }`}
        initial={{ scale: 1, opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ scale: 0.93, opacity: 0, y: 40, filter: 'blur(8px)' }}
        transition={{ duration: 0.32, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gold"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-gold/90 text-background p-2 rounded-full hover:bg-gold transition-all focus:outline-none focus:ring-2 focus:ring-gold"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        
        <motion.div
          className={`md:w-1/3 p-6 border-r ${
            isDarkMode ? 'border-gold/30 bg-neutral-900/80' : 'border-gray-300/50 bg-white/90'
          } hidden md:block`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gold' : 'text-gray-800'}`}>
            Détails
          </h3>
          
          <div className="mb-6">
            <motion.span
              className={`px-3 py-1 ${
                isDarkMode ? 'bg-gold text-neutral-900' : 'bg-gray-800 text-white'
              } rounded-full text-sm font-semibold`}
              whileHover={{ scale: 1.05 }}
            >
              {project.tag}
            </motion.span>
          </div>
          
          <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Outils Utilisés
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tools.map(tool => (
              <motion.span
                key={tool}
                className={`text-xs px-2 py-1 rounded-md ${
                  isDarkMode 
                    ? 'bg-neutral-800/90 text-gray-200 border border-neutral-700' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                } flex items-center gap-1`}
                whileHover={{ scale: 1.05 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3 w-3 ${isDarkMode ? 'text-gold' : 'text-gray-500'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {tool}
              </motion.span>
            ))}
          </div>
          
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex px-4 py-2 ${
              isDarkMode ? 'bg-gold text-neutral-900' : 'bg-gray-800 text-white'
            } rounded-md font-medium items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold`}
            whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Visiter le projet
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
          
          <div className="mt-6">
            <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Date de réalisation
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              2024
            </p>
          </div>
          
          <motion.div 
            className="mt-6 pt-4 border-t border-neutral-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
          </motion.div>
        </motion.div>
        
        <div className={`md:w-2/3 p-6 flex flex-col overflow-y-auto ${
          isDarkMode ? 'bg-neutral-900 text-gray-100' : 'bg-white text-gray-900'
        } rounded-2xl shadow-xl border ${
          isDarkMode ? 'border-gold/30' : 'border-neutral-200'
        } transition-colors transition-shadow duration-300`}>
          <div className="w-full h-48 sm:h-64 md:h-80 overflow-hidden relative rounded-lg mb-6">
            <motion.img
              src={project.image || '/api/placeholder/800/450'}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover"
              layoutId={`image-${project.title}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent`} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              id={`modal-title-${project.title}`}
              className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? 'text-gold' : 'text-gray-800'}`}
            >
              {project.title}
            </h2>
            
            <p
              id={`modal-desc-${project.title}`}
              className={`mb-4 text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {project.description}
            </p>
            
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gold' : 'text-gray-800'}`}>
              Aperçu
            </h3>
            
            <p className={`mb-6 text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {project.longDesc || 
                `Ce projet ${project.title} est une application ${project.tag} développée avec ${project.tools.join(', ')}. 
                 Il offre une interface moderne et intuitive pour une expérience utilisateur optimale. 
                 Les fonctionnalités principales incluent une navigation fluide, une conception responsive, 
                 et une architecture évolutive permettant des extensions futures.`
              }
            </p>
            
            <div className="md:hidden mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Projet réalisé en 2024
                </span>
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex px-4 py-2 ${
                    isDarkMode ? 'bg-gold text-neutral-900' : 'bg-gray-800 text-white'
                  } rounded-md font-medium items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Visiter le projet
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProjectDetail;