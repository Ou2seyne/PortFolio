import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import allProjects from './projectsData';
import ProjectDetail from './ProjectDetail';

function ProjectsGallery({ isDarkMode }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced projects with more visually appealing color schemes
  const enhancedProjects = allProjects.map(project => ({
    ...project,
    longDesc: `Ce projet ${project.title} représente une solution innovante dans le domaine ${project.tag.toLowerCase()}. 
      Développé avec ${project.tools.join(', ')}, il offre une expérience utilisateur fluide et intuitive.
      Les fonctionnalités principales incluent une interface responsive, des performances optimisées, 
      et une architecture évolutive permettant d'ajouter facilement de nouvelles fonctionnalités.
      Chaque aspect a été méticuleusement conçu pour garantir une expérience utilisateur de qualité supérieure.`,
    color: project.tag === 'Web App' ? 'from-customyellow/30 to-indigo-600/30 dark:from-customyellow/40 dark:to-indigo-900/40' : 
           project.tag === 'Mobile' ? 'from-emerald-500/30 to-teal-600/30 dark:from-emerald-900/40 dark:to-teal-900/40' :
           project.tag === 'AI' ? 'from-red-500/30 to-orange-600/30 dark:from-red-900/40 dark:to-orange-900/40' : 
           project.tag === 'Website' ? 'from-purple-500/30 to-pink-600/30 dark:from-purple-900/40 dark:to-pink-900/40' :
           'from-gray-500/30 to-gray-600/30 dark:from-gray-900/40 dark:to-gray-700/40'
  }));
  
  const tags = ['All', ...Array.from(new Set(enhancedProjects.map(p => p.tag)))];

  // Filter by tag and search query
  const filteredProjects = enhancedProjects
    .filter(project => selectedTag === 'All' || project.tag === selectedTag)
    .filter(project => 
      searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tools.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleOpenModal = (project) => {
    setModalKey(prev => prev + 1);
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Scroll restoration when modal closes
  useEffect(() => {
    if (!selectedProject) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden">
      {/* Enhanced floating accent shapes */}
      <div
        className="absolute left-1/4 top-1/3 w-72 h-72 -z-10 rounded-full blur-3xl opacity-20 
                   bg-gradient-to-r from-gold via-yellow-300 to-amber-500 
                   dark:from-gold/50 dark:via-yellow-400/30 dark:to-amber-600/20 
                   animate-pulse pointer-events-none"
        style={{ animationDuration: '15s', zIndex: -9 }}
        aria-hidden="true"
      />
      <div
        className="absolute right-1/4 bottom-1/4 w-64 h-64 -z-10 rounded-full blur-3xl opacity-20 
                   bg-gradient-to-l from-customyellow via-indigo-500 to-purple-500 
                   dark:from-customyellow/50 dark:via-indigo-700/30 dark:to-purple-800/20 
                   animate-pulse pointer-events-none"
        style={{ animationDuration: '18s', animationDelay: '2s', zIndex: -9 }}
        aria-hidden="true"
      />
      
      {/* Enhanced translucent blurred background */}
      <div
        className="absolute inset-0 -z-20 backdrop-blur-xl"
        style={{
          background:
            isDarkMode
              ? 'linear-gradient(135deg, rgba(24,24,27,0.85) 0%, rgba(39,39,42,0.75) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(251,191,36,0.15) 100%)',
          opacity: 0.97,
        }}
        aria-hidden="true"
      />
      
       {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 transition-colors duration-300 relative z-10">        
        {/* Enhanced Header with animated underline */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mt-2 mb-4 ${
              isDarkMode ? 'text-white' : 'text-customyellow'
            } tracking-tight relative inline-block`}>
              Galerie de projets
              <motion.span
                className={`absolute -bottom-1 left-0 h-1 rounded-full ${
                  isDarkMode ? 'bg-gold' : 'bg-customyellow'
                }`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </h2>
            <p className={`max-w-2xl text-sm sm:text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Découvrez une collection de projets modernes et sobres, représentant diverses technologies et domaines d'expertise.
            </p>
          </motion.div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Search bar */}
          <div className="w-full max-w-md mx-auto sm:mx-0">
            <div className={`relative flex items-center ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <svg 
                className="w-5 h-5 absolute left-3 text-gray-400"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-full border focus:ring-2 focus:outline-none transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-neutral-800 border-neutral-700 focus:border-customyellow focus:ring-customyellow/40 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 focus:border-customyellow focus:ring-customyellow/30 text-gray-900 placeholder-gray-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Enhanced Tags with better animation */}
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none
                    ${selectedTag === tag
                      ? isDarkMode 
                        ? 'bg-gold text-neutral-900 shadow-lg shadow-gold/20' 
                        : 'bg-customyellow text-white shadow-lg shadow-customyellow/20'
                      : isDarkMode
                        ? 'bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            
            {/* Enhanced View Toggle with better styling */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
              <motion.button
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-md flex items-center justify-center ${
                  isGridView 
                    ? isDarkMode ? 'bg-gold text-neutral-900' : 'bg-customyellow text-white' 
                    : isDarkMode ? 'bg-transparent text-gray-300 hover:text-white' : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-md flex items-center justify-center ${
                  !isGridView 
                    ? isDarkMode ? 'bg-gold text-neutral-900' : 'bg-customyellow text-white' 
                    : isDarkMode ? 'bg-transparent text-gray-300 hover:text-white' : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`rounded-xl overflow-hidden ${
                  isDarkMode ? 'bg-neutral-800' : 'bg-white'
                } shadow-lg animate-pulse`}
              >
                <div className="h-40 bg-gray-300 dark:bg-neutral-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-neutral-600 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-neutral-600 rounded w-5/6 mb-4"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-gray-200 dark:bg-neutral-600 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-neutral-600 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Enhanced Project Cards */}
            <AnimatePresence mode="sync">
              {isGridView ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100 
                      }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl ${
                        isDarkMode 
                        ? 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600' 
                        : 'bg-white border border-gray-100 hover:border-gray-200'
                      } transition-all duration-300 cursor-pointer`}
                      onClick={() => handleOpenModal(project)}
                    >
                      {/* Image with gradient overlay */}
                      <div className="relative aspect-video overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-radial ${project.color} opacity-70`}></div>
                        <img 
                          src={project.image || '/api/placeholder/400/225'} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium
                          ${isDarkMode 
                            ? 'bg-neutral-900/80 text-white border border-neutral-700' 
                            : 'bg-white/90 text-gray-900 border border-gray-100'
                          }`}
                        >
                          {project.tag}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h3>
                        <p className={`mt-2 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.tools.map(tool => (
                            <span 
                              key={tool}
                              className={`text-xs px-2 py-1 rounded-md ${
                                isDarkMode ? 'bg-neutral-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 flex justify-between items-center border-t border-gray-100 dark:border-neutral-700">
                          <motion.div
                            className={`text-sm font-medium ${isDarkMode ? 'text-gold' : 'text-customyellow'} flex items-center gap-1`}
                            whileHover={{ x: 3 }}
                          >
                            Voir détails
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-3 py-1 text-sm rounded-md ${
                              isDarkMode ? 'bg-gold text-neutral-900 hover:bg-yellow-500' : 'bg-customyellow text-white hover:bg-customyellow'
                            } transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visiter
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100 
                      }}
                      className={`flex flex-col md:flex-row gap-6 p-5 rounded-xl ${
                        isDarkMode 
                          ? 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600' 
                          : 'bg-white border border-gray-100 hover:border-gray-200'
                      } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                      onClick={() => handleOpenModal(project)}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <div className="md:w-1/3 aspect-video relative rounded-lg overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-radial ${project.color} opacity-70`}></div>
                        <img 
                          src={project.image || '/api/placeholder/400/225'} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium
                          ${isDarkMode 
                            ? 'bg-neutral-900/80 text-white border border-neutral-700' 
                            : 'bg-white/90 text-gray-900 border border-gray-100'
                          }`}
                        >
                          {project.tag}
                        </div>
                      </div>
                      <div className="md:w-2/3 flex flex-col">
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h3>
                        <p className={`mt-2 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tools.map(tool => (
                            <span 
                              key={tool}
                              className={`text-xs px-2 py-1 rounded-md ${
                                isDarkMode ? 'bg-neutral-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto pt-4 flex justify-between items-center">
                          <motion.div
                            className={`text-sm font-medium ${isDarkMode ? 'text-gold' : 'text-customyellow'} flex items-center gap-1`}
                            whileHover={{ x: 3 }}
                          >
                            Voir détails
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-3 py-1 text-sm rounded-md ${
                              isDarkMode ? 'bg-gold text-neutral-900 hover:bg-yellow-500' : 'bg-customyellow text-white hover:bg-customyellow'
                            } transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visiter
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced No projects fallback */}
            {filteredProjects.length === 0 && (
              <motion.div 
                className={`text-center py-16 px-4 rounded-xl ${
                  isDarkMode ? 'bg-neutral-800 text-gray-100 border border-neutral-700' : 'bg-white text-gray-900 border border-gray-200'
                } shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg 
                  className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-neutral-700' : 'text-gray-300'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="text-2xl font-semibold mb-2">Aucun projet trouvé</h3>
                <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aucun projet ne correspond à vos critères de recherche actuels. Essayez d'ajuster vos filtres ou votre recherche.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <motion.button
                    onClick={() => {
                      setSelectedTag('All');
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isDarkMode ? 'bg-gold text-neutral-900 hover:bg-yellow-500' : 'bg-customyellow text-white hover:bg-customyellow'
                    } transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Voir tous les projets
                  </motion.button>
                  {searchQuery && (
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isDarkMode ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Effacer la recherche
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Modal Project Detail would be here */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail
              key={modalKey}
              project={selectedProject}
              onClose={handleCloseModal}
              uniqueKey={modalKey}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>
        
        {/* Enhanced pagination with better styling */}
        {filteredProjects.length > 0 && (
          <div className="py-8 flex justify-center mt-12">
            <div className={`inline-flex rounded-lg p-1 ${
              isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'
            }`}>
              <motion.button
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              {[1, 2, 3].map((page) => (
                <motion.button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    page === 1 
                      ? isDarkMode ? 'bg-gold text-neutral-900' : 'bg-customyellow text-white'
                      : isDarkMode ? 'text-gray-300 hover:bg-neutral-700' : 'text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page}
                </motion.button>
              ))}
              
              <motion.button
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}

        {/* Stats section - a new addition */}


        {/* Newsletter subscription - a new addition */}
        <motion.div 
          className={`mt-16 p-8 sm:p-10 rounded-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700' 
              : 'bg-gradient-to-br from-grandiant to-indigo-50 border border-grandiant'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${
              isDarkMode ? 'text-white' : 'text-customyellow'
            }`}>
              Restez informé de nos nouveaux projets
            </h3>
            <p className={`mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Inscrivez-vous à notre newsletter pour recevoir les mises à jour sur nos dernières réalisations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className={`px-4 py-3 rounded-lg w-full ${
                  isDarkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400 focus:ring-gold' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-customyellow'
                } border focus:outline-none focus:ring-2`}
              />
              <motion.button 
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  isDarkMode 
                    ? 'bg-gold text-neutral-900 hover:bg-yellow-500' 
                    : 'bg-customyellow text-white hover:bg-customyellow'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                S'abonner
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsGallery;