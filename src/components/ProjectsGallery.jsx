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
import { Filter, Search, CheckCircle, Activity, ShoppingCart, Clock, Zap, Eye, ArrowRight, Star } from 'lucide-react'; // Added more icons
import allProjects from './projectsData'; // Ensure this path is correct
import ProjectDetail from './ProjectDetail'; // Ensure this path is correct

// Helper to get image paths
const imagesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/images/*', { eager: true })).map(([path, mod]) => [path.split('/').pop(), mod.default])
);

// --- Animation Definitions ---
const springTransition = { type: "spring", stiffness: 300, damping: 25, mass: 0.7 };
const gentleSpring = { type: "spring", stiffness: 180, damping: 20 };
const smoothTransition = { type: "tween", ease: [0.45, 0, 0.55, 1], duration: 0.5 }; // Eased cubic bezier

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { ...smoothTransition, duration: 0.45 } },
  exit: { opacity: 0, y: 25, transition: { duration: 0.35 } }
};

const staggerContainer = (staggerChildren = 0.07, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } }
});

const floatingAnimationSlight = {
  y: [0, -6, 0, 6, 0],
  transition: { duration: 6, ease: "easeInOut", repeat: Infinity }
};

const shimmerAnimation = {
  backgroundPosition: ["-200% 0%", "200% 0%"],
  transition: { duration: 1.8, ease: "linear", repeat: Infinity },
};

const ProjectCard = ({ project, isDarkMode, toggleFavorite, handleOpenModal, i, cardVariants, isGridView }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const imageUrl = useMemo(() => {
    if (project.image && project.image.startsWith('http')) return project.image;
    if (project.image) {
      const imageName = project.image.replace(/^.*[\\\/]/, '');
      if (imagesMap[imageName]) return imagesMap[imageName];
    }
    return `https://picsum.photos/seed/${project.id || project.title}/600/400`;
  }, [project.image, project.id, project.title]);

  const overlayAnimation = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      backgroundColor: isHovering ? "rgba(234,179,8,0.2)" : "rgba(0,0,0,0)",
    },
    transition: {
      duration: isHovering ? 4 : 0,
      ease: "linear",
      repeat: Infinity,
    },
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      key={project.id || `project-${i}-${project.title}`}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      whileHover={prefersReducedMotion ? {} : "hover"}
      className={`relative rounded-xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 group ${
        isDarkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-gray-200/80'
      } ${isGridView ? '' : 'md:col-span-2 lg:col-span-3'}
      ${project.isRecent ? (isDarkMode ? 'ring-2 ring-offset-2 ring-offset-neutral-900 ring-gold/60' : 'ring-2 ring-offset-2 ring-offset-white ring-gold/50') : ''}
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => handleOpenModal(project)} // Make entire card clickable
    >
      <div className="h-full flex flex-col group cursor-pointer"> {/* Inner div for structure, onClick moved to parent */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <motion.div
            className={`absolute inset-0 z-10 bg-gradient-to-r ${project.color}`}
            style={{ backgroundSize: "200% 200%"}}
            animate={isHovering && !prefersReducedMotion ? overlayAnimation.animate : { backgroundPosition: "50% 50%", backgroundColor: "rgba(0,0,0,0)" }}
            transition={{
              ...overlayAnimation.transition,
              opacity: { duration: 0.7, delay: 0.15 + i * 0.02 }
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: isDarkMode ? 0.55 : 0.65 }}
            viewport={{ once: true }}
          />
          
          <div className="absolute top-3 right-3 z-30">
            <motion.button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(e, project.id || project.title); }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-customyellow"
              whileHover={{ scale: 1.25, rotate: 7 }}
              whileTap={{ scale: 0.9, rotate: -18 }}
              aria-label={project.isFavorite ? `Retirer ${project.title} des favoris` : `Ajouter ${project.title} aux favoris`}
              title={project.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Star
                className={`w-5 h-5 transition-all duration-200 ease-in-out ${
                  project.isFavorite ? 'text-customyellow fill-customyellow' : 'text-white'
                }`}
                strokeWidth={1.5}
              />
            </motion.button>
          </div>

          {!imageLoaded && (
            <motion.div 
              className="absolute inset-0 w-full h-full z-10"
              style={{
                background: `linear-gradient(90deg, ${isDarkMode ? 'rgba(50,50,50,0.8)' : 'rgba(220,220,220,0.8)'} 25%, ${isDarkMode ? 'rgba(70,70,70,0.7)' : 'rgba(200,200,200,0.7)'} 50%, ${isDarkMode ? 'rgba(50,50,50,0.8)' : 'rgba(220,220,220,0.8)'} 75%)`,
                backgroundSize: "400% 100%",
              }}
              animate={shimmerAnimation}
            />
          )}
          <motion.img
            src={imageUrl}
            alt={project.title}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? (isHovering && !prefersReducedMotion ? 1.1 : 1) : 1.2,
              opacity: imageLoaded ? 1 : 0
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 5 }}
          />
          
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/50 to-transparent z-20"></div>
          
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-20">
            <motion.span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-500/30 dark:text-green-200 border border-green-500/50'
                  : 'bg-red-100 text-red-800 dark:bg-red-500/30 dark:text-red-200 border border-red-500/50'
              }`}
              initial={{ opacity: 0, x: -15 }}
              animate={ isInView ? { opacity: 1, x: 0, scale: [1, 1.08, 1] } : {} }
              transition={{ delay: 0.45 + i * 0.02, duration: 0.6, type: 'spring', stiffness: 180, damping: 12 }}
            >
              {project.status === 'completed' ? 'Terminé' : 'En cours'}
            </motion.span>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <motion.h3
              className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: -12 }}
              animate={ isInView ? { opacity: 1, y: 0 } : {} }
              transition={{ delay: 0.35 + i * 0.02, ...smoothTransition }}
            >
              {project.title}
            </motion.h3>
            <motion.p
              className={`mt-1 text-sm line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: -12 }}
              animate={ isInView ? { opacity: 1, y: 0 } : {} }
              transition={{ delay: 0.4 + i * 0.02, ...smoothTransition }}
            >
              {project.description}
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tools?.slice(0, 4).map((tool, index) => (
              <motion.span
                key={`${tool}-${index}`}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-neutral-700/80 text-gray-300 border border-neutral-600/70' : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={ isInView ? { opacity: 1, y: 0 } : {} }
                transition={{ delay: 0.45 + (index * 0.06) + (i * 0.02), ...gentleSpring }}
                whileHover={ prefersReducedMotion ? {} : { scale: 1.12, rotate: Math.random() > 0.5 ? 3 : -3, backgroundColor: isDarkMode ? '#525252' : '#e0e0e0', transition: {type: "spring", stiffness: 350, damping: 10} }}
              >
                {tool}
              </motion.span>
            ))}
          </div>

          <motion.div
            className={`mt-5 w-full py-2.5 rounded-lg font-medium text-sm text-center flex items-center justify-center gap-2 ${
              isDarkMode ? 'bg-neutral-800 text-white group-hover:bg-neutral-700/90' : 'bg-gray-100 text-gray-800 group-hover:bg-gray-200/90'
            } transition-colors`}
            initial={{ opacity: 0, y: 10 }}
            animate={ isInView && !prefersReducedMotion ? { opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 10 } : { opacity: 0 }}
            transition={{ duration: 0.25, ease: "circOut" }} // Changed ease
            aria-hidden="true"
          >
            Voir les détails
            <motion.div initial={{ x: -3 }} animate={{ x: isHovering ? 0 : -3 }} transition={{ type: 'spring', stiffness: 300, damping: 15}}>
              <ArrowRight size={16} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// --- ProjectsGallery Main Component ---
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

  const [stats, setStats] = useState({ totalProjects: 0, completedProjects: 0, techsUsed: 0, totalViews: 0 });
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recentlyViewedProjects') : null;
    return stored ? JSON.parse(stored) : [];
  });
  
  const prefersReducedMotion = useReducedMotion();
  const searchInputRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smoothScrollYProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 }); // Softer spring

  const headerInView = useInView(headerRef, { once: true, amount: 0.25 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.25 });
  const filtersInView = useInView(filtersRef, { once: true, amount: 0.2 });

  const galleryOpacity = useTransform(smoothScrollYProgress, [0, 0.12], [0.4, 1]);
  const galleryScale = useTransform(smoothScrollYProgress, [0, 0.12], [0.96, 1]);
  const headerY = useTransform(smoothScrollYProgress, [0, 0.25], [prefersReducedMotion ? 0 : 50, 0]);
  const headerOpacity = useTransform(smoothScrollYProgress, [0, 0.18], [0.3, 1]);

  const handleCloseModal = useCallback(() => setModalProject(null), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'Escape' && modalProject) { handleCloseModal(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); setIsGridView(prev => !prev); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setShowOnlyFavorites(prev => !prev); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalProject, handleCloseModal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const techsSet = new Set();
      allProjects.forEach(project => project.tools?.forEach(tech => techsSet.add(tech)));
      setStats({
        totalProjects: allProjects.length,
        completedProjects: allProjects.filter(p => p.status === 'completed').length || Math.floor(allProjects.length * 0.75),
        techsUsed: techsSet.size,
        totalViews: allProjects.reduce((sum, p) => sum + (p.views || Math.floor(Math.random() * 600) + 100), 0)
      });
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('favoriteProjects', JSON.stringify(favoriteProjects)); }, [favoriteProjects]);
  useEffect(() => { if (typeof window !== 'undefined' && recentlyViewed.length) localStorage.setItem('recentlyViewedProjects', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const enhancedProjects = useMemo(() => allProjects.map(project => ({
    ...project,
    longDesc: project.longDesc || `Ce projet ${project.title} illustre une application concrète des technologies ${project.tools?.slice(0,2).join(' et ') || 'modernes'} pour résoudre des défis dans le domaine ${project.tag?.toLowerCase() || 'numérique'}. L'accent a été mis sur une conception centrée utilisateur et une architecture robuste.`,
    color: project.tag === 'Site Web' ? 'from-gold/70 via-yellow-400/70 to-yellow-300/70 dark:from-gold/60 dark:via-yellow-500/60 dark:to-yellow-400/60' :
           project.tag === 'Application Web' ? 'from-emerald-500/70 via-teal-400/70 to-teal-300/70 dark:from-emerald-600/60 dark:via-teal-500/60 dark:to-teal-400/60' :
           project.tag === 'E-Commerce' ? 'from-sky-500/70 via-blue-400/70 to-blue-300/70 dark:from-sky-600/60 dark:via-blue-500/60 dark:to-blue-400/60' :
           'from-slate-500/40 to-slate-600/40 dark:from-neutral-800/50 dark:to-neutral-700/50',
    status: project.status || (Math.random() > 0.25 ? 'completed' : 'in-progress'),
    views: project.views || Math.floor(Math.random() * 600) + 100,
  })), []);

  const tags = useMemo(() => ['Tous', ...new Set(allProjects.map(p => p.tag).filter(Boolean))], []);

  const toggleFavorite = useCallback((e, projectId) => {
    e.stopPropagation(); // Already present, good.
    setFavoriteProjects(prev => {
        const newFavorites = prev.includes(projectId)
          ? prev.filter(id => id !== projectId)
          : [...prev, projectId];
        // Animate something here if needed, e.g. a toast notification
        return newFavorites;
    });
  }, []);

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
    
    projects.sort((a, b) => (b.isRecent - a.isRecent) || (b.isFavorite - a.isFavorite) || 0);
    return projects;
  }, [enhancedProjects, selectedTag, searchQuery, showOnlyFavorites, favoriteProjects, recentlyViewed]);

  const handleOpenModal = useCallback((project) => {
    setModalProject(project);
    setRecentlyViewed(prev => [project.id || project.title, ...prev.filter(id => id !== (project.id || project.title))].slice(0, 5));
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalProject]);

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 60, scale: prefersReducedMotion ? 1: 0.9, rotateX: prefersReducedMotion ? 0 : -20, transformOrigin: 'bottom center' },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: { delay: i * 0.07, ...gentleSpring, stiffness: 170, damping: 22 },
    }),
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : 40, scale: prefersReducedMotion ? 1 : 0.95, rotateX: prefersReducedMotion ? 0 : 10, transition: { duration: 0.35, ease:"easeOut" } },
    hover: {
      y: prefersReducedMotion ? 0 : -10, scale: prefersReducedMotion ? 1 : 1.04,
      boxShadow: isDarkMode ? '0 15px 40px -12px rgba(0,0,0,0.5)' : '0 15px 40px -12px rgba(0,0,0,0.25)',
      transition: { type: "spring", stiffness:280, damping:12 },
    },
  };
  
  // --- EmptyState Component --- (Incorporating enhancements directly for brevity)
  const EmptyState = ({ showOnlyFavorites, favoriteProjects, searchQuery, setShowOnlyFavorites, setSelectedTag, setSearchQuery }) => {
    const itemVariants = {
      hidden: { opacity: 0, y: 25, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { ...gentleSpring, duration: 0.5, damping: 15 } }
    };
    const containerVariants = staggerContainer(0.12, 0);

    const IllustrationElement = () => {
      let icon;
      if (showOnlyFavorites && favoriteProjects.length === 0) icon = <Star size={48} className="text-yellow-500 dark:text-yellow-400" />;
      else if (searchQuery.length > 0) icon = <Search size={48} className="text-gold dark:text-gold" />;
      else icon = <Filter size={48} className="text-sky-500 dark:text-sky-400" />;

      return (
        <motion.div 
          className="relative mb-8 inline-block"
          animate={prefersReducedMotion ? {} : floatingAnimationSlight}
        >
          <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 rounded-full flex items-center justify-center shadow-xl">
            <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{...gentleSpring, delay:0.2}}>
             {icon}
            </motion.div>
          </div>
        </motion.div>
      );
    };
    return (
      <motion.div className="col-span-full text-center py-20 px-4" variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
        <motion.div variants={itemVariants}><IllustrationElement /></motion.div>
        <motion.h3 variants={itemVariants} className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {showOnlyFavorites && favoriteProjects.length === 0 ? "Aucun projet en favoris pour le moment." : searchQuery.length > 0 ? "Aucun résultat trouvé." : "Aucun projet ne correspond à ces filtres."}
        </motion.h3>
        <motion.p variants={itemVariants} className="mt-2 max-w-md mx-auto text-gray-500 dark:text-gray-400 mb-6">
          {showOnlyFavorites && favoriteProjects.length === 0 ? "Cliquez sur l'étoile d'un projet pour l'ajouter ici !" : searchQuery.length > 0 ? `Essayez de modifier votre recherche "${searchQuery}" ou d'explorer d'autres catégories.` : "Modifiez vos filtres ou explorez toutes les catégories pour découvrir plus de projets."}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-6 flex flex-wrap justify-center gap-3">
          { (searchQuery.length > 0 || (showOnlyFavorites && favoriteProjects.length === 0)) &&
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => { setSearchQuery(''); setSelectedTag('Tous'); setShowOnlyFavorites(false); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 ${isDarkMode ? 'bg-neutral-700 text-gray-200 hover:bg-neutral-600 focus-visible:ring-customyellow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:ring-gold'}`}>
              Réinitialiser les filtres
            </motion.button>
          }
        </motion.div>
      </motion.div>
    );
  };

  // --- StatsBlock Component ---
  const AnimatedStatNumber = ({ value, isInView }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (isInView) {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60fps
        const increment = value / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
          currentStep++;
          setDisplayValue(Math.min(Math.round(increment * currentStep), value));
          
          if (currentStep >= steps) {
            clearInterval(interval);
          }
        }, duration / steps);
        
        return () => clearInterval(interval);
      }
    }, [value, isInView]);
    
    return <motion.span>{displayValue}</motion.span>;
  };
  
  const StatsBlock = ({ icon, value, label, color, isInView }) => (
    <motion.div
      variants={fadeInUp}
      whileHover={prefersReducedMotion ? {} : { y: -7, scale: 1.035, transition: {type:"spring", stiffness:320, damping:10} }}
      className={`relative flex flex-col items-center justify-center p-5 rounded-xl shadow-lg min-w-[130px] overflow-hidden ${isDarkMode ? 'bg-neutral-800/80 border border-neutral-700/60' : 'bg-white/90 border border-gray-200/80'} backdrop-blur-sm`}
    >
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${color}33 0%, transparent 70%)`
        }}
        animate={isHoveringStat => isHoveringStat ? { scale: 3, opacity: 0.15 } : { scale: 1, opacity: 0 }}
      />
      <motion.div 
        className={`mb-2.5 ${color}`}
        initial={{scale:0.4, opacity:0, rotate: -20}}
        animate={isInView ? {scale:1, opacity:1, rotate:0} : {}}
        transition={{delay:0.15, type:"spring", stiffness:220, damping: 10}}
      >
        {icon}
      </motion.div>
      <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <AnimatedStatNumber value={value} isInView={isInView} />
      </span>
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{label}</span>
    </motion.div>
  );

  const headerTitle = "Mes Projets";

  return (
    <motion.section 
      ref={sectionRef} 
      className="py-12 md:py-16 relative overflow-x-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "circOut" }}
    >
      {!prefersReducedMotion && <>
        <motion.div
          className={`absolute top-[8%] left-[3%] w-32 h-32 rounded-full -z-10 ${isDarkMode ? 'bg-gold/15' : 'bg-gold/10'} blur-3xl opacity-80`}
          style={{ y: useTransform(smoothScrollYProgress, [0, 1], [-100, 100]), x: useTransform(smoothScrollYProgress, [0, 1], [-30, 30]) }}
          animate={floatingAnimationSlight}
        />
        <motion.div
          className={`absolute top-[65%] right-[5%] w-40 h-40 -z-10 ${isDarkMode ? 'bg-sky-500/15' : 'bg-sky-500/10'} blur-3xl opacity-70 rounded-lg`}
          style={{ y: useTransform(smoothScrollYProgress, [0, 1], [120, -120]), x: useTransform(smoothScrollYProgress, [0, 1], [10, 50]), rotate: useTransform(smoothScrollYProgress, [0,1], [15, -30])}}
          animate={{...floatingAnimationSlight, y: [0, 8, 0, -8, 0], duration: 7}}
        />
      </>}

      <motion.div ref={headerRef} style={{ opacity: headerOpacity, y: headerY }} className="text-center mb-10 md:mb-14 px-4">
        <motion.h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${isDarkMode ? 'text-gold' : 'text-gold'}`}
          initial="hidden" animate={headerInView ? "visible" : "hidden"} variants={staggerContainer(0.05,0)}
        >
          {headerTitle.split("").map((char, index) => (
            <motion.span key={index} className="inline-block" variants={{hidden: {opacity:0, y:25, rotateY:-20}, visible: {opacity:1, y:0, rotateY:0, transition:{type:"spring", damping:10, stiffness:120, delay: index*0.045}}}}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>
        <motion.p className={`text-md md:text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          variants={fadeInUp} initial="hidden" animate={headerInView ? "visible" : "hidden"} transition={{ delay: headerTitle.length * 0.045 + 0.15, duration:0.5 }}
        >
          Explorez mon portfolio de réalisations, des sites web dynamiques aux applications web complexes, conçus avec passion et précision.
        </motion.p>
      </motion.div>

      <motion.div ref={filtersRef} variants={fadeInUp} initial="hidden" animate={filtersInView ? "visible" : "hidden"}
        className="sticky top-0 z-40 py-4 backdrop-blur-lg mb-8 md:mb-10 shadow-md
                   ${isDarkMode ? 'bg-neutral-900/85 border-b border-neutral-700/50' : 'bg-white/85 border-b border-gray-200/70'}"
      >
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-4 gap-4">
          <LayoutGroup id="filter-tags-layout-v3">
            <motion.div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start" variants={staggerContainer(0.06, 0.2)}>
              {tags.map((tag) => (
                <motion.button
                  key={tag} onClick={() => setSelectedTag(tag)}
                  variants={fadeInUp}
                  className={`relative px-4 py-2 rounded-full text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 ${
                    selectedTag !== tag && (isDarkMode ? 'text-gray-300 hover:bg-neutral-700/70 hover:text-gray-100' : 'text-gray-600 hover:bg-gray-200/80 hover:text-gray-800')
                  } ${isDarkMode ? 'focus-visible:ring-customyellow' : 'focus-visible:ring-gold'}`}
                  whileHover={prefersReducedMotion || selectedTag === tag ? {} : { scale: 1.06, y: -1 }} whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                >
                  {selectedTag === tag && (
                    <motion.div
                      className={`absolute inset-0 rounded-full -z-10 ${isDarkMode ? 'bg-customyellow' : 'bg-gold-500'}`}
                      layoutId="active-tag-indicator-v3"
                      transition={{...gentleSpring, stiffness:350, damping:25}}
                    />
                  )}
                   <span className={`${selectedTag === tag ? (isDarkMode ? 'text-neutral-900 font-semibold' : 'text-gray-900 font-semibold') : 'font-medium'}`}>{tag}</span>
                </motion.button>
              ))}
            </motion.div>
          </LayoutGroup>

          <motion.div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end" variants={staggerContainer(0.06, 0.3)}>
            <motion.div variants={fadeInUp} className="relative flex-1 md:max-w-xs w-full group" 
              whileFocusWithin={prefersReducedMotion ? {} : { y: -2 }}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gold dark:group-focus-within:text-customyellow transition-colors">
                <Search size={18} />
              </div>
              <input ref={searchInputRef} type="text"
                className={`block w-full pl-10 pr-9 py-2.5 rounded-lg text-sm border transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg ${ isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white placeholder-gray-500 focus:ring-1 focus:ring-customyellow focus:border-customyellow' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gold focus:border-gold' }`}
                placeholder="Rechercher un projet..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={() => setSearchQuery('')} aria-label="Effacer la recherche">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </motion.div>

            <motion.button variants={fadeInUp} onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`p-2.5 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 ${ showOnlyFavorites ? (isDarkMode? 'bg-customyellow text-neutral-900 shadow-md' : 'bg-gold-500 text-gray-900 shadow-md') : (isDarkMode ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700/80 focus-visible:ring-customyellow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 focus-visible:ring-gold') }`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.12, y: -1 }} whileTap={prefersReducedMotion ? {} : { scale: 0.92 }} aria-label={showOnlyFavorites ? 'Afficher tous les projets' : 'Afficher les favoris'}
              title={showOnlyFavorites ? 'Afficher tous les projets' : 'Afficher les favoris'}
            >
              <Star size={20} className={`transition-all duration-200 ${showOnlyFavorites ? (isDarkMode? 'fill-neutral-900' : 'fill-gray-900') : 'fill-transparent'}`} strokeWidth={1.5}/>
            </motion.button>

            <motion.button variants={fadeInUp} onClick={() => setIsGridView(!isGridView)}
              className={`p-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 ${isDarkMode ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700/80 focus-visible:ring-customyellow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 focus-visible:ring-gold'}`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.12, y:-1 }} whileTap={prefersReducedMotion ? {} : { scale: 0.92 }} aria-label={isGridView ? 'Afficher en mode liste' : 'Afficher en mode grille'}
              title={isGridView ? 'Afficher en mode liste' : 'Afficher en mode grille'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={isGridView ? 'grid-icon' : 'list-icon'} initial={{opacity:0, rotate: -35, scale:0.8}} animate={{opacity:1, rotate:0, scale:1}} exit={{opacity:0, rotate:35, scale:0.8}} transition={{duration:0.25, type:"spring", stiffness:250, damping:12}}>
                  {isGridView ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ opacity: galleryOpacity, scale: galleryScale }} className="max-w-6xl mx-auto px-4">
        {isLoading ? (
          <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 md:gap-8`}>
            {[...Array(isGridView ? 6 : 3)].map((_, i) => (
              <motion.div key={i} className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}
                initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, ...gentleSpring, stiffness: 180, damping: 18 }}
              >
                <motion.div 
                  className={`h-48 md:h-56`}
                  style={{
                    background: `linear-gradient(110deg, ${isDarkMode ? '#3a3a3a' : '#e0e0e0'} 8%, ${isDarkMode ? '#4f4f4f' : '#f0f0f0'} 18%, ${isDarkMode ? '#3a3a3a' : '#e0e0e0'} 33%)`,
                    backgroundSize: "200% 100%",
                  }}
                  animate={shimmerAnimation}
                />
                <div className="p-5">
                  <motion.div className={`h-6 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-300'} rounded mb-3 w-3/4`} style={{ backgroundSize: "200% 100%"}} animate={shimmerAnimation} transition={{delay:0.1, ...shimmerAnimation.transition}}/>
                  <motion.div className={`h-4 ${isDarkMode ? 'bg-neutral-600/80' : 'bg-gray-200'} rounded mb-2 w-full`} style={{ backgroundSize: "200% 100%"}} animate={shimmerAnimation} transition={{delay:0.15, ...shimmerAnimation.transition}}/>
                  <motion.div className={`h-4 ${isDarkMode ? 'bg-neutral-600/80' : 'bg-gray-200'} rounded w-2/3 mb-4`} style={{ backgroundSize: "200% 100%"}} animate={shimmerAnimation} transition={{delay:0.2, ...shimmerAnimation.transition}}/>
                  <div className="flex gap-2">
                    <motion.div className={`h-7 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'} rounded-full w-16`} style={{ backgroundSize: "200% 100%"}} animate={shimmerAnimation} transition={{delay:0.25, ...shimmerAnimation.transition}}/>
                    <motion.div className={`h-7 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'} rounded-full w-20`} style={{ backgroundSize: "200% 100%"}} animate={shimmerAnimation} transition={{delay:0.3, ...shimmerAnimation.transition}}/>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 md:gap-8`}>
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? filteredProjects.map((project, i) => (
                  <ProjectCard key={project.id || `project-${i}-${project.title}`} project={project} isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite} handleOpenModal={handleOpenModal} i={i} cardVariants={cardVariants} isGridView={isGridView}
                  />
                )) : (
                  <EmptyState 
                    showOnlyFavorites={showOnlyFavorites} favoriteProjects={favoriteProjects} searchQuery={searchQuery}
                    setShowOnlyFavorites={setShowOnlyFavorites} setSelectedTag={setSelectedTag} setSearchQuery={setSearchQuery}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </motion.div>

      <AnimatePresence>
        {modalProject && (
          <ProjectDetail project={modalProject} onClose={handleCloseModal} isDarkMode={isDarkMode}
            isFavorite={favoriteProjects.includes(modalProject.id || modalProject.title)} toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default ProjectsGallery;