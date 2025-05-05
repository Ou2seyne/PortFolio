import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useInView,
  useSpring
} from 'framer-motion';
import allProjects from './projectsData';
import ProjectDetail from './ProjectDetail';

// Optimized transitions
const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

const smoothTransition = {
  type: "tween",
  ease: [0.43, 0.13, 0.23, 0.96],
  duration: 0.6
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Reusable ProjectCard component to avoid duplication
const ProjectCard = ({ project, isDarkMode, toggleFavorite, handleOpenModal, i, cardVariants, isGridView }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      layout
      ref={cardRef}
      key={project.id || `project-${i}`}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      whileHover="hover"
      className={`relative rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 group ${
        isDarkMode
          ? 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-800'
          : 'bg-white hover:bg-gray-50'
      } ${isGridView ? '' : 'md:col-span-2 lg:col-span-3'}`}
    >
      <div className="h-full flex flex-col group cursor-pointer" onClick={() => handleOpenModal(project)}>
        <div className="relative h-40 overflow-hidden">
          <div className={`absolute inset-0 z-10 opacity-70 ${project.color}`}></div>
          <div className={`absolute top-2 right-2 z-30`}>
            <motion.button
              onClick={(e) => toggleFavorite(e, project.id || project.title)}
              className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Toggle favorite for ${project.title}`}
            >
              <motion.svg
                className={`w-4 h-4 transition-all ${
                  project.isFavorite ? 'text-[#D90429] fill-[#D90429]' : 'text-white'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={project.isFavorite ? 0 : 1.5}
                animate={project.isFavorite ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </motion.svg>
            </motion.button>
          </div>
          <motion.img
            src={project.image || `https://picsum.photos/600/400?random=${project.id || i}`}
            alt={project.title}
            className="w-full h-full object-cover object-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7 }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent z-20"></div>
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 z-20">
            <motion.span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300'
                  : 'bg-[#FFD2D6] text-[#D90429] dark:bg-[#FFD2D6]/60 dark:text-[#D90429]'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {project.status === 'completed' ? 'Terminé' : 'En cours'}
            </motion.span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <motion.h3
              className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {project.title}
            </motion.h3>
            <motion.p
              className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {project.description}
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tools?.map((tool, index) => (
              <motion.span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-neutral-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function ProjectsGallery({ isDarkMode }) {
  const [selectedTag, setSelectedTag] = useState('Tous');
  const [modalProject, setModalProject] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState(() => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('favoriteProjects') : null;
    return stored ? JSON.parse(stored) : [];
});
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    techsUsed: 0,
    totalViews: 0
  });
  const prefersReducedMotion = useReducedMotion();
  const searchInputRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);

  // Animation hooks for scroll-triggered effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Spring-based animation for smoother scroll effects
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values based on scroll position
  const galleryOpacity = useTransform(smoothScrollYProgress, [0, 0.1], [0.6, 1]);
  const galleryScale = useTransform(smoothScrollYProgress, [0, 0.1], [0.98, 1]);

  useEffect(() => {
    if (modalProject) return;
    return () => {};
  }, [modalProject]);

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

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteProjects', JSON.stringify(favoriteProjects));
    }
  }, [favoriteProjects]);

  const enhancedProjects = useMemo(() => allProjects.map(project => ({
    ...project,
    longDesc: project.longDesc || `Ce projet ${project.title} représente une solution innovante dans le domaine ${project.tag?.toLowerCase() || 'technologique'}.
      Développé avec ${project.tools?.join(', ') || 'des technologies modernes'}, il offre une expérience utilisateur fluide et intuitive.
      Les fonctionnalités principales incluent une interface responsive, des performances optimisées,
      et une architecture évolutive permettant d'ajouter facilement de nouvelles fonctionnalités.
      Chaque aspect a été méticuleusement conçu pour garantir une expérience utilisateur de qualité supérieure.`,
    color: project.tag === 'Site Web' ? 'from-gold via-yellow-300 to-yellow-200 dark:from-gold dark:via-yellow-400 dark:to-yellow-200' :
           project.tag === 'Application Web' ? 'from-emerald-400 via-teal-300 to-teal-200 dark:from-emerald-600 dark:via-teal-500 dark:to-teal-300' :
           project.tag === 'E-Commerce' ? 'from-gold via-yellow-200 to-yellow-100 dark:from-gold dark:via-yellow-300 dark:to-yellow-200' :
           'from-gray-500/30 to-gray-600/30 dark:from-gray-900/40 dark:to-gray-700/40',
    status: project.status || (Math.random() > 0.2 ? 'completed' : 'in-progress'),
    views: project.views || Math.floor(Math.random() * 500),
  })), [allProjects]);

  const tags = ['Tous', 'Site Web', 'Application Web', 'E-Commerce'];

  const toggleFavorite = useCallback((e, projectId) => {
    e.stopPropagation();
    setFavoriteProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  }, []);

  const filteredProjects = useMemo(() => enhancedProjects
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
    })), [enhancedProjects, selectedTag, searchQuery, showOnlyFavorites, favoriteProjects]);

  const handleOpenModal = useCallback((project) => {
    setModalProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalProject(null);
  }, []);

  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleCloseModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [modalProject, handleCloseModal]);

  // Card variants with staggered animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: isDarkMode ? '0 10px 30px -15px rgba(0,0,0,0.3)' : '0 10px 30px -15px rgba(0,0,0,0.2)',
      transition: { duration: 0.3 },
    },
  };

  // Animations disabled if user prefers reduced motion
  const animationSettings = prefersReducedMotion ? { animate: "visible" } : {};

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 transition-colors duration-300 relative z-10"
        style={{
          opacity: galleryOpacity,
          scale: galleryScale
        }}
      >
        <motion.div
          ref={headerRef}
          variants={staggerContainer}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-4 sm:mb-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.h2
                className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gold'
                } tracking-tight relative inline-block`}
              >
                Galerie de projets
                <motion.span
                  className={`absolute -bottom-1 left-0 h-1 rounded-full ${
                    isDarkMode ? 'bg-yellow-400' : 'bg-gold'
                  }`}
                  initial={{ width: '0%' }}
                  animate={headerInView ? { width: '100%' } : { width: '0%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </motion.h2>
              <motion.span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={headerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                {stats.totalProjects} Projets
              </motion.span>
            </div>
            <motion.p
              className={`max-w-2xl text-sm sm:text-base leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              variants={fadeInUp}
            >
              Découvrez une collection de projets modernes et sobres, représentant diverses technologies et domaines d'expertise.
            </motion.p>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-3"
            variants={fadeInUp}
          >
            <motion.button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showOnlyFavorites
                  ? isDarkMode
                    ? 'bg-customyellow/20 text-customyellow border border-customyellow/30'
                    : 'bg-customyellow/20 text-customyellow border border-customyellow hover:bg-gray-50'
                  : isDarkMode
                    ? 'bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700'
                    : 'bg-white text-gray-700 border border-customyellow hover:bg-gray-50'
              }`}
              aria-pressed={showOnlyFavorites}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className={`w-5 h-5 ${
                  showOnlyFavorites
                    ? 'text-customyellow fill-customyellow'
                    : 'text-gray-400'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={showOnlyFavorites ? 0 : 1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              <span>Favoris</span>
              {showOnlyFavorites && (
                <motion.span
                  className="absolute -top-1 -right-1 w-2 h-2 bg-customyellow rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          ref={statsRef}
          className="mb-10 flex flex-col gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div className="lg:col-span-1" variants={fadeInUp}>
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
                <motion.input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un projet... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-12 py-2 w-full rounded-full border focus:ring-2 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-neutral-800/80 border-neutral-700 focus:border-neutral-500 focus:ring-neutral-600 text-white placeholder-gray-500'
                      : 'bg-white/80 border-gray-300 focus:border-gray-400 focus:ring-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  aria-label="Rechercher un projet"
                  initial={{ width: '90%' }}
                  whileFocus={{ width: '100%', boxShadow: '0 0 0 3px rgba(156, 163, 175, 0.2)' }}
                  transition={{ duration: 0.3 }}
                />
                {searchQuery ? (
                  <motion.button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Effacer la recherche"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                ) : (
                  <span className="absolute right-3 text-xs text-gray-400 font-mono">⌘K</span>
                )}
              </div>
            </motion.div>
            <motion.div className="lg:col-span-2 flex flex-wrap gap-3 items-center" variants={fadeInUp}>
              <div className="flex items-center space-x-1 mr-6">
                <motion.button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded-l-lg ${
                    isGridView
                      ? 'bg-customyellow/20 text-customyellow border-2 border-customyellow shadow-md'
                      : isDarkMode
                        ? 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
                        : 'bg-white text-gray-500 hover:bg-gray-100'
                  } transition-colors`}
                  aria-label="Vue grille"
                  whileHover={{ scale: isGridView ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded-r-lg ${
                    !isGridView
                      ? 'bg-customyellow/20 text-customyellow border-2 border-customyellow shadow-md'
                      : isDarkMode
                        ? 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
                        : 'bg-white text-gray-500 hover:bg-gray-100'
                  } transition-colors`}
                  aria-label="Vue liste"
                  whileHover={{ scale: !isGridView ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? isDarkMode
                          ? 'bg-customyellow/20 text-customyellow border border-customyellow/30'
                          : 'bg-customyellow text-white border-2 border-customyellow shadow-md'
                        : isDarkMode
                          ? 'bg-neutral-800 text-gray-300 border border-neutral-700 hover:bg-neutral-700'
                          : 'bg-white text-gray-700 border border-customyellow hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={statsInView ? {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.1 + index * 0.1 }
                    } : {}}
                  >
                    
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          {...animationSettings}
        >
          {isLoading ? (
            Array.from({ length: 9 }, (_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                className={`rounded-xl overflow-hidden h-64 ${
                  isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="w-full h-full animate-pulse">
                  <div className={`w-full h-32 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`} />
                  <div className="p-4 space-y-3">
                    <div className={`h-4 w-2/3 rounded ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`} />
                    <div className={`h-3 w-1/2 rounded ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`} />
                    <div className="flex gap-2">
                      {[1, 2].map((_, j) => (
                        <div
                          key={j}
                          className={`h-6 w-12 rounded-full ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, i) => (
                  <ProjectCard
                    key={project.id || project.title}
                    project={project}
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    handleOpenModal={handleOpenModal}
                    i={i}
                    cardVariants={cardVariants}
                    isGridView={isGridView}
                  />
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Aucun projet trouvé
                  </motion.h3>
                  <motion.p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Essayez de modifier vos filtres ou votre recherche.
                  </motion.p>
                  {/* Reset Filters Button for empty favorites */}
                  {showOnlyFavorites && favoriteProjects.length === 0 && (
  <button
    className="mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/40 flex items-center gap-2 transition-all duration-200 group"
    aria-label="Réinitialiser les filtres"
    onClick={() => {
      setShowOnlyFavorites(false);
      setSelectedTag('Tous');
      setSearchQuery('');
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white opacity-80 group-hover:rotate-[-20deg] group-hover:scale-110 transition-transform duration-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M19.418 19A9 9 0 106 6.582" />
    </svg>
    Réinitialiser les filtres
  </button>
)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {modalProject && (
          <ProjectDetail
            project={modalProject}
            onClose={handleCloseModal}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default ProjectsGallery;
