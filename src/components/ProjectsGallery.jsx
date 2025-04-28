import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import allProjects from './projectsData';
import ProjectDetail from './ProjectDetail';

function ProjectsGallery({ isDarkMode, toggleDarkMode }) {
  const [selectedTag, setSelectedTag] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    techsUsed: 0,
    totalViews: 0
  });
  
  const searchInputRef = useRef(null);
  
  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Calculate stats once projects are loaded
      const techsSet = new Set();
      allProjects.forEach(project => {
        project.tools.forEach(tech => techsSet.add(tech));
      });
      
      setStats({
        totalProjects: allProjects.length,
        completedProjects: allProjects.filter(p => p.status === 'completed').length || Math.floor(allProjects.length * 0.8),
        techsUsed: techsSet.size,
        totalViews: allProjects.reduce((sum, p) => sum + (p.views || Math.floor(Math.random() * 500)), 0)
      });
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
           'from-gray-500/30 to-gray-600/30 dark:from-gray-900/40 dark:to-gray-700/40',
    status: project.status || (Math.random() > 0.2 ? 'completed' : 'in-progress'),
    views: project.views || Math.floor(Math.random() * 500),
  }));
  
  const tags = ['Tous', ...Array.from(new Set(enhancedProjects.map(p => p.tag)))];

  // Sort projects based on selected option
  const sortProjects = (projects) => {
    switch (sortBy) {
      case 'newest':
        return [...projects].sort((a, b) => (b.date || b.id || 0) - (a.date || a.id || 0));
      case 'oldest':
        return [...projects].sort((a, b) => (a.date || a.id || 0) - (b.date || b.id || 0));
      case 'a-z':
        return [...projects].sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':
        return [...projects].sort((a, b) => b.title.localeCompare(a.title));
      case 'popular':
        return [...projects].sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return projects;
    }
  };

  // Filter by tag, search query
  const filteredProjects = sortProjects(enhancedProjects
    .filter(project => selectedTag === 'Tous' || project.tag === selectedTag)
    .filter(project => 
      searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tools.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(project => !showOnlyFavorites || project.isFavorite));

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

  // Handle keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key closes modal
      if (e.key === 'Escape' && selectedProject) {
        handleCloseModal();
      }
      
      // Tab navigation enhancement could be added here
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const FavoriteIcon = ({ isFavorite }) => (
    <svg 
      className={`w-5 h-5 transition-all duration-300 ${
        isFavorite 
          ? isDarkMode ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-500 fill-yellow-500' 
          : isDarkMode ? 'text-gray-400' : 'text-gray-400'
      }`} 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={isFavorite ? 0 : 1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
      />
    </svg>
  );

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
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 sm:mb-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <h2 className={`text-3xl sm:text-4xl font-bold ${
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
            </div>
            <p className={`max-w-2xl text-sm sm:text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Découvrez une collection de projets modernes et sobres, représentant diverses technologies et domaines d'expertise.
            </p>
          </motion.div>
          
          {/* Stats cards */}
          <motion.div 
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
          </motion.div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Search bar with keyboard shortcut hint */}
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
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher un projet... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-12 py-2 w-full rounded-full border focus:ring-2 focus:outline-none transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-neutral-800 border-neutral-700 focus:border-customyellow focus:ring-customyellow/40 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 focus:border-customyellow focus:ring-customyellow/30 text-gray-900 placeholder-gray-400'
                }`}
                aria-label="Rechercher un projet"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Effacer la recherche"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <span className="absolute right-3 text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 select-none">
                  Ctrl+K
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Enhanced Tags with better animation */}
            <div className="flex flex-wrap gap-2 justify-center py-2 overflow-x-auto max-w-full">
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
                  aria-pressed={selectedTag === tag}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm ${
                    isDarkMode 
                      ? 'bg-neutral-800 border-neutral-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-700'
                  } border focus:ring-1 focus:ring-customyellow focus:outline-none cursor-pointer`}
                  aria-label="Trier les projets"
                >
                  <option value="newest">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="a-z">A à Z</option>
                  <option value="z-a">Z à A</option>
                  <option value="popular">Populaires</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                  aria-label="Vue en grille"
                  aria-pressed={isGridView}
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
                  aria-label="Vue en liste"
                  aria-pressed={!isGridView}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Project count and filtering information */}
        <div className="mb-6">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} 
            {selectedTag !== 'Tous' ? ` dans la catégorie "${selectedTag}"` : ''}
            {searchQuery ? ` correspondant à "${searchQuery}"` : ''}
          </p>
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
                  <div className="h-3 bg-gray-200 dark:bg-neutral-600 rounded w-5/6 mb-4"></div><div className="flex gap-2 mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-neutral-600 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          // Empty state with illustration
          <motion.div 
            className={`p-12 rounded-xl ${
              isDarkMode ? 'bg-neutral-800/70' : 'bg-white/80'
            } text-center flex flex-col items-center justify-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg 
              className={`w-24 h-24 mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Aucun projet trouvé
            </h3>
            <div className="mt-6 flex gap-3">
              <motion.button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('Tous');
                  setShowOnlyFavorites(false);
                }}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gold hover:bg-gold/90 text-neutral-900' 
                    : 'bg-customyellow hover:bg-customyellow/90 text-white'
                } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customyellow transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir tous les projets
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Grid View */}
            {isGridView ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id || project.title}
                    className={`rounded-xl overflow-hidden ${
                      isDarkMode ? 'bg-neutral-800/80' : 'bg-white/80'
                    } backdrop-blur-sm shadow-lg group hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => handleOpenModal(project)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenModal(project);
                      }
                    }}
                    aria-label={`Projet ${project.title}`}
                  >
                    {/* Project image with gradient overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${project.color} z-10`}></div>
                      <img 
                        src={project.image || `https://picsum.photos/600/400?random=${index}`} 
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      
                      {/* Tag and status indicator */}
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-neutral-900/80' : 'bg-white/80'
                        } backdrop-blur-sm border ${
                          isDarkMode ? 'border-neutral-700 text-gray-300' : 'border-gray-200 text-gray-700'
                        }`}>
                          {project.tag}
                        </span>
                        {project.status && (
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed' 
                              ? isDarkMode ? 'bg-green-900/70 text-green-300' : 'bg-green-100 text-green-800'
                              : isDarkMode ? 'bg-amber-900/70 text-amber-300' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              project.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'
                            }`}></span>
                            {project.status === 'completed' ? 'Terminé' : 'En cours'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Project content */}
                    <div className="p-5">
                      <h3 className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.title}
                      </h3>
                      <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.slice(0, 3).map((tool) => (
                          <span 
                            key={tool}
                            className={`px-2 py-1 rounded-full text-xs ${
                              isDarkMode 
                                ? 'bg-neutral-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tool}
                          </span>
                        ))}
                        {project.tools.length > 3 && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            isDarkMode 
                              ? 'bg-neutral-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            +{project.tools.length - 3}
                          </span>
                        )}
                      </div>
                      
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // List View
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id || project.title}
                    className={`p-4 sm:p-6 rounded-xl ${
                      isDarkMode ? 'bg-neutral-800/80' : 'bg-white/80'
                    } backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => handleOpenModal(project)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenModal(project);
                      }
                    }}
                    aria-label={`Projet ${project.title}`}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Project image with gradient overlay */}
                      <div className="relative h-48 md:h-32 md:w-52 overflow-hidden rounded-lg flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-r ${project.color} z-10`}></div>
                        <img 
                          src={project.image || `https://picsum.photos/600/400?random=${index}`} 
                          alt={project.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out"
                        />
                      </div>
                      
                      {/* Project content */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-wrap justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isDarkMode ? 'bg-neutral-900/80' : 'bg-white/80'
                            } backdrop-blur-sm border ${
                              isDarkMode ? 'border-neutral-700 text-gray-300' : 'border-gray-200 text-gray-700'
                            }`}>
                              {project.tag}
                            </span>
                            {project.status && (
                              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'completed' 
                                  ? isDarkMode ? 'bg-green-900/70 text-green-300' : 'bg-green-100 text-green-800'
                                  : isDarkMode ? 'bg-amber-900/70 text-amber-300' : 'bg-amber-100 text-amber-800'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  project.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'
                                }`}></span>
                                {project.status === 'completed' ? 'Terminé' : 'En cours'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <h3 className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h3>
                        <p className={`mb-4 text-sm flex-grow ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between mt-auto">
                          <div className="flex flex-wrap gap-2">
                            {project.tools.slice(0, 5).map((tool) => (
                              <span 
                                key={tool}
                                className={`px-2 py-1 rounded-full text-xs ${
                                  isDarkMode 
                                    ? 'bg-neutral-700 text-gray-300' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {tool}
                              </span>
                            ))}
                            {project.tools.length > 5 && (
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                isDarkMode 
                                  ? 'bg-neutral-700 text-gray-300' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                +{project.tools.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
      
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key={modalKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <ProjectDetail 
              project={selectedProject} 
              onClose={handleCloseModal} 
              isDarkMode={isDarkMode} 
              isFavorite={selectedProject.isFavorite}
              onToggleFavorite={(e) => toggleFavorite(e, selectedProject.id || selectedProject.title)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProjectsGallery;