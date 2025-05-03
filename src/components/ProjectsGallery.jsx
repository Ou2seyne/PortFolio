import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import allProjects from './projectsData';

function ProjectDetail({ project, onClose, isDarkMode, isFavorite, onToggleFavorite }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={modalRef}
      className={`relative max-w-4xl w-full rounded-2xl overflow-hidden ${
        isDarkMode ? 'bg-neutral-900' : 'bg-white'
      } shadow-2xl`}
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${project.color} z-10`}></div>
        <img
          src={project.image || `https://picsum.photos/1200/600?random=${project.id}`}
          alt={project.title}
          className="w-full h-full object-cover object-center"
        />
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors duration-200"
          aria-label="Fermer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h2>
            <motion.button
              onClick={(e) => onToggleFavorite && onToggleFavorite(e)}
              className="p-2 rounded-full hover:bg-black/20 transition-colors"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className={`w-6 h-6 transition-all duration-300 ${
                  isFavorite
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-white'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isFavorite ? 0 : 1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-5 space-y-6">
            <div className="flex flex-wrap gap-2">
              <motion.span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-gold/40 text-gold' : 'bg-gold/10 text-gold'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {project.tag}
              </motion.span>
              {project.status && (
                <motion.span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'completed'
                      ? isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-800'
                      : isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-800'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    project.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'
                  }`}></span>
                  {project.status === 'completed' ? 'Terminé' : 'En cours'}
                </motion.span>
              )}
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Description
              </h3>
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project.longDesc || project.description}
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Technologies utilisées
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <motion.span
                    key={tool}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      isDarkMode
                        ? 'bg-neutral-800 text-gray-300 border border-neutral-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className={`rounded-xl p-4 ${
              isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Détails
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</dt>
                  <dd className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.date || 'Non spécifiée'}
                  </dd>
                </div>
                <div>
                  <dt className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Catégorie</dt>
                  <dd className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.tag}
                  </dd>
                </div>
                <div>
                  <dt className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statut</dt>
                  <dd className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.status === 'completed' ? 'Terminé' : 'En cours'}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="space-y-3">
              <motion.button
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-center ${
                  isDarkMode
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                } transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = project.link}
              >
                Acceder au site
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsGallery({ isDarkMode }) {
  const [selectedTag, setSelectedTag] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    techsUsed: 0,
    totalViews: 0
  });

  const searchInputRef = useRef(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const techsSet = new Set();
      allProjects.forEach(project => {
        project.tools?.forEach(tech => techsSet.add(tech));
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

  const enhancedProjects = allProjects.map(project => ({
    ...project,
    longDesc: project.longDesc || `Ce projet ${project.title} représente une solution innovante dans le domaine ${project.tag?.toLowerCase() || 'technologique'}.
      Développé avec ${project.tools?.join(', ') || 'des technologies modernes'}, il offre une expérience utilisateur fluide et intuitive.
      Les fonctionnalités principales incluent une interface responsive, des performances optimisées,
      et une architecture évolutive permettant d'ajouter facilement de nouvelles fonctionnalités.
      Chaque aspect a été méticuleusement conçu pour garantir une expérience utilisateur de qualité supérieure.`,
    color: project.tag === 'Site Web' ? 'from-blue-500/30 to-indigo-600/30 dark:from-blue-600/40 dark:to-indigo-900/40' :
           project.tag === 'Application Web' ? 'from-emerald-500/30 to-teal-600/30 dark:from-emerald-900/40 dark:to-teal-900/40' :
           project.tag === 'E-Commerce' ? 'from-red-500/30 to-orange-600/30 dark:from-red-900/40 dark:to-orange-900/40' :
           'from-gray-500/30 to-gray-600/30 dark:from-gray-900/40 dark:to-gray-700/40',
    status: project.status || (Math.random() > 0.2 ? 'completed' : 'in-progress'),
    views: project.views || Math.floor(Math.random() * 500),
  }));

  const tags = ['Tous', 'Site Web', 'Application Web', 'E-Commerce'];

  const toggleFavorite = (e, projectId) => {
    e.stopPropagation();
    setFavoriteProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const filteredProjects = enhancedProjects
    .filter(project => selectedTag === 'Tous' || project.tag === selectedTag)
    .filter(project =>
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tools?.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(project => !showOnlyFavorites || favoriteProjects.includes(project.id || project.title))
    .map(project => ({
      ...project,
      isFavorite: favoriteProjects.includes(project.id || project.title)
    }));

  const handleOpenModal = (project) => {
    setModalKey(prev => prev + 1);
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden">
      <div
        className="absolute left-1/4 top-1/3 w-72 h-72 -z-10 rounded-full blur-3xl opacity-20
                   bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500
                   dark:from-yellow-500/50 dark:via-yellow-400/30 dark:to-amber-600/20
                   animate-pulse pointer-events-none"
        style={{ animationDuration: '15s', zIndex: -9 }}
        aria-hidden="true"
      />
      <div
        className="absolute right-1/4 bottom-1/4 w-64 h-64 -z-10 rounded-full blur-3xl opacity-20
                   bg-gradient-to-l from-blue-400 via-indigo-500 to-purple-500
                   dark:from-blue-500/50 dark:via-indigo-700/30 dark:to-purple-800/20
                   animate-pulse pointer-events-none"
        style={{ animationDuration: '18s', animationDelay: '2s', zIndex: -9 }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-20 backdrop-blur-xl"
        style={{
          background:
            isDarkMode
              ? 'linear-gradient(135deg, rgba(14,14,20,0.85) 0%, rgba(30,30,35,0.75) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(246,246,250,0.85) 100%)',
          opacity: 0.97,
        }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 transition-colors duration-300 relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 sm:mb-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <h2 className={`text-3xl sm:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gold'
              } tracking-tight relative inline-block`}>
                Galerie de projets
                <motion.span
                  className={`absolute -bottom-1 left-0 h-1 rounded-full ${
                    isDarkMode ? 'bg-yellow-400' : 'bg-gold'
                  }`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {stats.totalProjects} Projets
              </span>
            </div>
            <p className={`max-w-2xl text-sm sm:text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Découvrez une collection de projets modernes et sobres, représentant diverses technologies et domaines d'expertise.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showOnlyFavorites
                  ? isDarkMode
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-600/30'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : isDarkMode
                    ? 'bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
              aria-pressed={showOnlyFavorites}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className={`w-5 h-5 ${
                  showOnlyFavorites
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-400'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={showOnlyFavorites ? 0 : 1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              <span>Favoris</span>
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          className="mb-10 flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
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
                      ? 'bg-neutral-800/80 border-neutral-700 focus:border-gold focus:ring-gold/40 text-white placeholder-gray-500'
                      : 'bg-white/80 border-gray-200 focus:border-gold focus:ring-gold/30 text-gray-900 placeholder-gray-400'
                  }`}
                  aria-label="Rechercher un projet"
                />
                {searchQuery ? (
                  <motion.button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Effacer la recherche"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                ) : (
                  <span className="absolute right-3 text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 select-none">
                    Ctrl+K
                  </span>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {/* Empty div to maintain layout */}
              </div>
              <div className="w-full flex flex-wrap gap-2 justify-center">
                {tags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-5 py-2 whitespace-nowrap rounded-lg text-base font-medium transition-all duration-300 relative overflow-hidden group
                      flex-shrink-0
                      ${selectedTag === tag
                        ? isDarkMode
                          ? 'bg-gold text-white shadow-md shadow-gold/20'
                        : 'bg-gold text-white shadow-md shadow-gold/20'
                        : isDarkMode
                          ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700/70'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200/90'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedTag === tag && (
                      <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
                    )}
                    <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                      ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`} />
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <motion.button
              onClick={() => setIsGridView(!isGridView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{isGridView ? 'Vue liste' : 'Vue grille'}</span>
              {isGridView ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.svg
              className="w-12 h-12 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H4c0 11.048 7 15 7 15h4s7-3.952 7-15m0 0h.582M4 15h.582m15.356 2A8.001 8.001 0 004.582 17m0 0H4c0 4.048 3 7 7 7h4s7-2.952 7-7m0 0h.582M4 20h.582m15.356 2A8.001 8.001 0 004.582 22m0 0H4c0 1.048 1 3 3 3h4s3-1.952 3-3m0 0h.582"
              />
            </motion.svg>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id || project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onClick={() => handleOpenModal(project)}
                  className={`relative group rounded-2xl overflow-hidden cursor-pointer ${
                    isDarkMode ? 'bg-neutral-900' : 'bg-white'
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${project.color} z-10`}></div>
                    <img
                      src={project.image || `https://picsum.photos/1200/600?random=${project.id}`}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-gold/40 text-gold' : 'bg-gold/10 text-gold'
                      }`}>
                        {project.tag}
                      </span>
                      <motion.button
                        onClick={(e) => toggleFavorite(e, project.id || project.title)}
                        className="p-2 rounded-full hover:bg-black/20 transition-colors"
                        aria-label={project.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className={`w-6 h-6 transition-all duration-300 ${
                            project.isFavorite
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-white'
                          }`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={project.isFavorite ? 0 : 1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </motion.button>
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.title}
                    </h3>
                    <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      {selectedProject && (
        <AnimatePresence>
          <motion.div
            key={modalKey}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseModal}
          >
            <ProjectDetail
              project={selectedProject}
              onClose={handleCloseModal}
              isDarkMode={isDarkMode}
              isFavorite={favoriteProjects.includes(selectedProject.id || selectedProject.title)}
              onToggleFavorite={(e) => toggleFavorite(e, selectedProject.id || selectedProject.title)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}

export default ProjectsGallery;
