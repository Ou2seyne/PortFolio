import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ProjectDetail({ project, onClose, uniqueKey, isDarkMode }) {
  const contentRef = useRef(null);

  if (!project) return null;

  useEffect(() => {
    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Focus trap and keyboard handling
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus first focusable element
    if (contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Enhanced gradient backgrounds based on project type
  const getGradientClass = (tag) => {
    switch(tag?.toLowerCase()) {
      case 'web app':
        return isDarkMode ? 'from-blue-900/30 to-indigo-900/20' : 'from-blue-50 to-indigo-50';
      case 'mobile':
        return isDarkMode ? 'from-emerald-900/30 to-teal-900/20' : 'from-emerald-50 to-teal-50';
      case 'ai':
        return isDarkMode ? 'from-orange-900/30 to-amber-900/20' : 'from-orange-50 to-amber-50';
      case 'design':
        return isDarkMode ? 'from-pink-900/30 to-rose-900/20' : 'from-pink-50 to-rose-50';
      case 'website':
      default:
        return isDarkMode ? 'from-slate-900/30 to-blue-900/20' : 'from-slate-50 to-blue-50';
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.96,
      transition: { duration: 0.25, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      key={`modal-${uniqueKey}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.title}`}
      aria-describedby={`modal-desc-${project.title}`}
    >
      {/* Backdrop overlay */}
      <motion.div
        variants={overlayVariants}
        className={`fixed inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/70' : 'bg-gray-900/60'}`}
        onClick={onClose}
      />
      
      {/* Modal container */}
      <motion.div
        ref={contentRef}
        variants={modalVariants}
        className={`rounded-2xl overflow-hidden w-full max-w-5xl relative z-10 shadow-2xl border ${
          isDarkMode ? 'border-gold/30' : 'border-gray-200'
        } max-h-[90vh] flex flex-col md:flex-row`}
      >
        {/* Progress indicator at top */}
        <motion.div
          className={`absolute top-0 left-0 h-1 ${isDarkMode ? 'bg-gold' : 'bg-blue-600'}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        />
        
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full 
            ${isDarkMode 
              ? 'bg-neutral-800 text-gold hover:bg-neutral-700 focus:ring-gold/50' 
              : 'bg-white text-gray-700 hover:bg-gray-100 focus:ring-blue-400/50'
            } 
            shadow-lg transition-all focus:outline-none focus:ring-2`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 90 }}
          aria-label="Fermer la fenêtre"
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
        
        {/* Sidebar */}
        <motion.div
          className={`md:w-1/3 p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 border-r border-neutral-700/50' 
              : 'bg-gradient-to-br from-gray-50 to-white border-r border-gray-200'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gold' : 'text-blue-600'}`}>
            Détails du projet
          </h3>
          
          <div className="mb-6">
            <motion.span
              className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5
                ${isDarkMode 
                  ? 'bg-gold/20 text-gold border border-gold/30' 
                  : 'bg-blue-100 text-blue-600 border border-blue-200'
                }`}
              whileHover={{ scale: 1.03, y: -1 }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gold' : 'bg-blue-500'}`}></span>
              {project.tag}
            </motion.span>
          </div>
          
          <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Technologies utilisées
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <AnimatePresence>
              {project.tools.map((tool, index) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`text-xs px-2 py-1 rounded-md ${
                    isDarkMode 
                      ? 'bg-neutral-800 text-gray-300 border border-neutral-700/70' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  } flex items-center gap-1.5`}
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 ${isDarkMode ? 'text-gold' : 'text-blue-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {tool}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex px-4 py-2 rounded-md font-medium items-center gap-2 
              ${isDarkMode 
                ? 'bg-gold text-neutral-900 hover:bg-gold/90 focus:ring-gold/50' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400/50'
              } 
              shadow-md focus:outline-none focus:ring-2 transition-all duration-200`}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: isDarkMode 
                ? '0 4px 20px rgba(234, 179, 8, 0.3)' 
                : '0 4px 20px rgba(37, 99, 235, 0.25)' 
            }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
          
          <motion.div 
            className={`mt-6 pt-5 border-t ${isDarkMode ? 'border-neutral-700/50' : 'border-gray-200'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date de réalisation
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {project.date || '2024'}
            </p>
          </motion.div>
          
          {project.client && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Client
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {project.client}
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Main content */}
        <div className={`md:w-2/3 flex flex-col overflow-y-auto bg-gradient-to-br ${getGradientClass(project.tag)}`}>
          {/* Image */}
          <div className="relative overflow-hidden">
            <motion.img
              src={project.image || '/api/placeholder/800/450'}
              alt={`Capture d'écran du projet ${project.title}`}
              className="w-full h-56 sm:h-64 md:h-72 object-cover object-center transform-gpu"
              layoutId={`image-${project.title}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-t ${
                isDarkMode ? 'from-neutral-900 via-transparent to-transparent' : 'from-white/80 via-transparent to-transparent'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
          
          {/* Content */}
          <motion.div
            className="p-6 flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2
              id={`modal-title-${project.title}`}
              className={`text-2xl sm:text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-gold' : 'text-blue-800'
              }`}
            >
              {project.title}
            </h2>
            
            <p
              id={`modal-desc-${project.title}`}
              className={`mb-6 text-sm sm:text-base leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {project.description}
            </p>
            
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gold' : 'text-blue-700'}`}>
              Présentation du projet
            </h3>
            
            <div className={`mb-6 space-y-4 text-sm sm:text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>
                {project.longDesc || 
                  `Ce projet ${project.title} est une application ${project.tag} développée avec ${project.tools.join(', ')}. 
                   Il offre une interface moderne et intuitive pour une expérience utilisateur optimale.`
                }
              </p>
              <p>
                {project.additionalDesc || 
                  `Les fonctionnalités principales incluent une navigation fluide, une conception responsive, 
                   et une architecture évolutive permettant des extensions futures.`
                }
              </p>
            </div>
            
            {/* Features section */}
            {project.features && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gold' : 'text-blue-700'}`}>
                  Fonctionnalités clés
                </h3>
                <ul className={`list-disc ml-5 space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {project.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {/* Mobile view footer */}
            <div className="md:hidden mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Projet réalisé en {project.date || '2024'}
                </span>
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex px-4 py-2 rounded-md font-medium items-center gap-2 
                    ${isDarkMode 
                      ? 'bg-gold text-neutral-900 hover:bg-gold/90' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    } 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDarkMode ? 'focus:ring-gold' : 'focus:ring-blue-500'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Visiter
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