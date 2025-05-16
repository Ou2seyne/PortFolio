import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  LayoutGroup
} from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import allProjects from './projectsData';
import ProjectDetail from './ProjectDetail';

const imagesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/images/*', { eager: true })).map(([path, mod]) => [path.split('/').pop(), mod.default])
);

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1
};

const smoothTransition = {
  type: "tween",
  ease: [0.43, 0.13, 0.23, 0.96],
  duration: 0.6
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.4 }
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

const floatingAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity
  }
};

const ProjectCard = ({ project, isDarkMode, toggleFavorite, handleOpenModal, i, cardVariants, isGridView }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Progressive loading animation for images
  const [imageLoaded, setImageLoaded] = useState(false);

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
      } ${isGridView ? '' : 'md:col-span-2 lg:col-span-3'} `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="h-full flex flex-col group cursor-pointer" onClick={() => handleOpenModal(project)}>
        <div className="relative h-40 overflow-hidden">
          <div className={`absolute inset-0 z-10 opacity-70 ${project.color}`}></div>
          
          {/* Favorite button with enhanced animations */}
          <div className={`absolute top-2 right-2 z-30`}>
            <motion.button
              onClick={(e) => toggleFavorite(e, project.id || project.title)}
              className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors text-white"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.8, rotate: -10 }}
              aria-label={`Toggle favorite for ${project.title}`}
            >
              <motion.svg
                className={`w-4 h-4 transition-all ${
                  project.isFavorite ? 'text-customyellow fill-customyellow' : 'text-white'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={project.isFavorite ? 0 : 1.5}
                animate={project.isFavorite ? { scale: [1, 1.3, 1], rotate: [0, 15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </motion.svg>
            </motion.button>
          </div>

          {/* Enhanced image loading with skeleton */}
          {/* Skeleton loader only when image is not loaded */}
          {!imageLoaded && (
            <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse z-10"></div>
          )}
          <motion.img
            src={
              project.image && project.image.startsWith('http')
                ? project.image
                : project.image && imagesMap[project.image.replace(/^.*[\\\/]/, '')]
                  ? imagesMap[project.image.replace(/^.*[\\\/]/, '')]
                  : `https://picsum.photos/600/400?random=${project.id || i}`
            }
            alt={project.title}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.1 }}
            animate={{ scale: isHovering ? 1.1 : 1 }}
            transition={{ duration: 0.7 }}
            style={{ zIndex: 20 }}
          />
          
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent z-20"></div>
          
          {/* Status badge with enhanced animation */}
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
                whileHover={{ scale: 1.1, backgroundColor: isDarkMode ? '#3a3a3a' : '#f3f4f6' }}
              >
                {tool}
              </motion.span>
            ))}
          </div>

          {/* View button only appears on hover */}
          <motion.button
            className={`mt-4 w-full py-2 rounded-lg font-medium text-center ${
              isDarkMode ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            Voir les détails
          </motion.button>
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
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recentlyViewedProjects') : null;
    return stored ? JSON.parse(stored) : [];
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const prefersReducedMotion = useReducedMotion();
  const searchInputRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);
  const scrollYRef = useRef(0);

  // Animation hooks for scroll-triggered effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Update scroll position for parallax effects
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      setScrollProgress(v);
      scrollYRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const filtersInView = useInView(filtersRef, { once: true, amount: 0.3 });

  // Spring-based animation for smoother scroll effects
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values based on scroll position for parallax effects
  const galleryOpacity = useTransform(smoothScrollYProgress, [0, 0.1], [0.6, 1]);
  const galleryScale = useTransform(smoothScrollYProgress, [0, 0.1], [0.98, 1]);
  const headerY = useTransform(smoothScrollYProgress, [0, 0.3], [50, 0]);
  const headerOpacity = useTransform(smoothScrollYProgress, [0, 0.2], [0.5, 1]);

  useEffect(() => {
    if (modalProject) return;
  }, [modalProject]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Search shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // ESC to close modal
      if (e.key === 'Escape' && modalProject) {
        handleCloseModal();
      }
      
      // Grid/List view toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setIsGridView(prev => !prev);
      }
      
      // Toggle favorites
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowOnlyFavorites(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGridView, showOnlyFavorites, modalProject]);

  // Load data with simulated delay for loading state
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

  // Save recently viewed to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && recentlyViewed.length) {
      localStorage.setItem('recentlyViewedProjects', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  // Enhanced project data with improved descriptions and animations
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
    lastViewed: recentlyViewed.includes(project.id || project.title) ? new Date().toISOString() : null,
  })), [allProjects, recentlyViewed]);

  const tags = ['Tous', 'Site Web', 'Application Web', 'E-Commerce'];

  const toggleFavorite = useCallback((e, projectId) => {
    e.stopPropagation();
    setFavoriteProjects(prev => {
      const newFavorites = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      
      return newFavorites;
    });
  }, []);

  // Enhanced project filtering with sorting options
  const filteredProjects = useMemo(() => {
    let projects = enhancedProjects
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
        isFavorite: favoriteProjects.includes(project.id || project.title),
        isRecent: recentlyViewed.includes(project.id || project.title)
      }));
    
    // Sort by recently viewed first, then by favorites
    projects.sort((a, b) => {
      
      // Recently viewed second
      if (a.isRecent && !b.isRecent) return -1;
      if (!a.isRecent && b.isRecent) return 1;
      
      // Favorites third
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      return 0;
    });
    
    return projects;
  }, [enhancedProjects, selectedTag, searchQuery, showOnlyFavorites, favoriteProjects, recentlyViewed]);

  const handleOpenModal = useCallback((project) => {
    setModalProject(project);
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const newRecent = [project.id || project.title, ...prev.filter(id => id !== (project.id || project.title))].slice(0, 5);
      return newRecent;
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalProject(null);
  }, []);

  // Control body scroll when modal is open
  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [modalProject]);

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

  // Enhanced empty state with animation
  const EmptyState = ({ 
    showOnlyFavorites = false, 
    favoriteProjects = [], 
    searchQuery = '', 
    setShowOnlyFavorites = () => {}, 
    setSelectedTag = () => {}, 
    setSearchQuery = () => {} 
  }) => {
    // Defensive guards for undefined/null
    const safeFavorites = Array.isArray(favoriteProjects) ? favoriteProjects : [];
    const safeSearch = typeof searchQuery === 'string' ? searchQuery : '';

    const [hoverButton, setHoverButton] = useState(false);
    
    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.12
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5
        }
      }
    };
    
    // Dynamic illustration based on filter context
    const IllustrationElement = () => {
      // Show different illustrations based on filters
      if (showOnlyFavorites && favoriteProjects.length === 0) {
        return (
          <motion.div 
            className="relative mb-8"
            animate={{ 
              rotate: [0, -3, 3, -2, 0],
              y: [0, -2, 2, -1, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-200 dark:bg-yellow-500/30 opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.svg 
                className="w-12 h-12 text-yellow-500 dark:text-yellow-400"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={1.5}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
                />
              </motion.svg>
            </div>
            
            {/* Star particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 dark:bg-yellow-300 rounded-full"
                style={{
                  top: `${30 + Math.random() * 30}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        );
      } else if (searchQuery.length > 0) {
        return (
          <motion.div 
            className="relative mb-8"
            animate={{ 
              rotate: [0, -2, 2, -1, 0],
              y: [0, -2, 2, -1, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-gold dark:bg-gold/30 opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Search className="w-12 h-12 text-gold dark:text-gold" />
            </div>
            
            {/* Search query highlight */}
            <motion.div
              className="absolute top-2 right-0 bg-gold text-white text-xs px-2 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              "{searchQuery}"
            </motion.div>
          </motion.div>
        );
      } else {
        return (
          <motion.div 
            className="relative mb-8"
            animate={{ 
              rotate: [0, -2, 2, -1, 0],
              y: [0, -3, 3, -2, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg">
              <motion.div
                className="absolute inset-0 rounded-full bg-gold dark:bg-gold/30 opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Filter className="w-12 h-12 text-gold dark:text-gold" />
            </div>
          </motion.div>
        );
      }
    };
  
    return (
      <motion.div
        className="col-span-full text-center py-16 px-4 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        <motion.div variants={itemVariants}>
          <IllustrationElement />
        </motion.div>
        
        <motion.h3 
          variants={itemVariants}
          className="text-2xl font-bold text-gray-800 dark:text-gray-200"
        >
          {showOnlyFavorites && favoriteProjects.length === 0
            ? "Aucun projet en favoris"
            : searchQuery.length > 0
              ? "Aucun résultat pour cette recherche"
              : "Aucun projet ne correspond à ce filtre"}
        </motion.h3>
        
        <motion.p 
          variants={itemVariants}
          className="mt-3 max-w-md mx-auto text-gray-500 dark:text-gray-400"
        >
          {showOnlyFavorites && favoriteProjects.length === 0
            ? "Vous n'avez pas encore ajouté de projets à vos favoris. Cliquez sur l'étoile pour en ajouter."
            : searchQuery.length > 0
              ? `Nous n'avons pas trouvé de projets contenant "${searchQuery}". Essayez d'autres termes ou vérifiez l'orthographe.`
              : "Essayez de modifier vos critères de filtrage pour trouver des projets."}
        </motion.p>
        
        {/* Interactive suggestion tags */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {searchQuery.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-sm transition-colors duration-200"
                onClick={() => setSearchQuery('')}
              >
                Effacer la recherche
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-sm transition-colors duration-200"
                onClick={() => setSelectedTag('Tous')}
              >
                Voir tous les projets
              </motion.button>
            </>
          )}
          
          {showOnlyFavorites && favoriteProjects.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-sm transition-colors duration-200"
              onClick={() => setShowOnlyFavorites(false)}
            >
              Désactiver le filtre des favoris
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    );
  };

  // Enhanced statistics blocks with animations
  const StatsBlock = ({ icon, value, label, color }) => (
    <motion.div
      variants={fadeInUp}
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${isDarkMode ? 'bg-neutral-800/80' : 'bg-white/90'} backdrop-blur-sm shadow-lg`}
    >
      <div className={`text-${color} mb-2`}>
        {icon}
      </div>
      <motion.span
        className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {value}
      </motion.span>
      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="py-8">
      {/* Animated page header */}
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity, y: prefersReducedMotion ? 0 : headerY }}
        className="text-center mb-8"
      >
        <motion.h2
          className={`text-3xl md:text-4xl font-bold mb-3 text-gold`}
          variants={fadeInUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          Mes Projets
        </motion.h2>
        <motion.p
          className={`text-md md:text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          variants={fadeInUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
        >
          Découvrez mon portfolio de réalisations en développement web et applications.
        </motion.p>
      </motion.div>

      {/* Enhanced filters with animations */}
      <motion.div
        ref={filtersRef}
        variants={staggerContainer}
        initial="hidden"
        animate={filtersInView ? "visible" : "hidden"}
        className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-4 mb-6 gap-4"
      >
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
          {tags.map((tag, i) => (
            <motion.button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag
                  ? isDarkMode
                    ? 'bg-customyellow text-neutral-900'
                    : 'bg-customyellow text-gray-900'
                  : isDarkMode
                  ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              variants={fadeInUp}
              custom={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          {/* Search box with animation */}
          <motion.div
            variants={fadeInUp}
            className="relative flex-1 md:max-w-xs"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className={`block w-full pl-10 pr-3 py-2 rounded-lg text-sm ${
                isDarkMode
                  ? 'bg-neutral-800 border-neutral-700 text-white placeholder-gray-400 focus:ring-customyellow focus:border-customyellow'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gold focus:border-gold'
              }`}
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.div>

          {/* Toggle favorite filter */}
          <motion.button
            variants={fadeInUp}
            onClick={() => {
              setShowOnlyFavorites(!showOnlyFavorites);
            }}
            className={`p-2 rounded-lg ${
              showOnlyFavorites
                ? 'bg-customyellow text-gray-900'
                : isDarkMode
                ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={showOnlyFavorites ? 'Voir tous les projets' : 'Voir les favoris uniquement'}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill={showOnlyFavorites ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={showOnlyFavorites ? 0 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </motion.button>

          {/* Toggle view mode */}
          <motion.button
            variants={fadeInUp}
            onClick={() => {
              setIsGridView(!isGridView);
            }}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isGridView ? 'Vue liste' : 'Vue grille'}
          >
            {isGridView ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Gallery with animations */}
      <motion.div
        style={{
          opacity: prefersReducedMotion ? 1 : galleryOpacity,
          scale: prefersReducedMotion ? 1 : galleryScale,
        }}
        className="max-w-6xl mx-auto px-4"
      >
        {isLoading ? (
          // Skeleton loader with enhanced animations
          <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`rounded-xl overflow-hidden shadow-md ${
                  isDarkMode ? 'bg-neutral-800' : 'bg-white'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="h-40 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                <div className="p-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-2/3" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse w-16" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse w-20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
            >
              <AnimatePresence>
                {filteredProjects.map((project, i) => (
                  <ProjectCard
                    key={project.id || `project-${i}`}
                    project={project}
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    handleOpenModal={handleOpenModal}
                    i={i}
                    cardVariants={cardVariants}
                    isGridView={isGridView}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </motion.div>

      {/* Project detail modal */}
      <AnimatePresence>
        {modalProject && (
          <ProjectDetail
            project={modalProject}
            onClose={handleCloseModal}
            isDarkMode={isDarkMode}
            isFavorite={favoriteProjects.includes(modalProject.id || modalProject.title)}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProjectsGallery;