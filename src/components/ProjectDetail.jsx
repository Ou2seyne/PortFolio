import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring, useMotionValue, useWillChange } from 'framer-motion';
import { X, ExternalLink, CheckCircle, Tag as TagIcon, CalendarDays, UserCircle, ListChecks, ArrowRight, Zap, Code2, Layers, Star, Share2, Calendar, Clock, Info, ChevronLeft, Github, Server, Cloud, Database, FileText } from 'lucide-react';

// Animation Definitions
const staggerContainer = (staggerChildren = 0.07, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } }
});

const RMF = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const uberSpring = { type: "spring", stiffness: 320, damping: 28, mass: 1 };
const snappySpring = { type: "spring", stiffness: 450, damping: 25 };
const fluidEase = [0.35, 0.17, 0.15, 0.98];

const contentChildVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { 
      ...snappySpring, 
      duration: 0.6, 
      damping: 20, 
      delay: delay 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 15, 
    filter: "blur(3px)", 
    transition: { duration: 0.25 } 
  }
});

const sectionTitleVariants = {
  hidden: { opacity: 0, y: 20, skewX: -8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    skewX: 0, 
    transition: { 
      ...snappySpring, 
      damping: 18, 
      delay: 0.15 
    } 
  }
};

const toolBadgeVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -20 },
  visible: i => ({ 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 380, 
      damping: 12, 
      delay: 0.1 + i * 0.045 
    }
  }),
  hover: { 
    scale: 1.12, 
    y: -4, 
    rotate: Math.random() > 0.5 ? 2.5 : -2.5,
    boxShadow: `0 6px 18px rgba(234,179,8,0.25)`,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 8 
    }
  }
};

const ultraSpring = { type: "spring", stiffness: 350, damping: 30, mass: 1.1 };
const hyperSpring = { type: "spring", stiffness: 500, damping: 28, mass: 0.9 };

// --- AnimatedText Component ---
const AnimatedText = ({ text, type = "char", variant = "default", stagger = 0.025, charClassName = "", wordClassName = "", delay = 0, isVisible = true }) => {
  const letters = useMemo(() => Array.from(text), [text]);
  const words = useMemo(() => text.split(" "), [text]);
  const willChange = useWillChange();

  const containerVariants = {
    hidden: { opacity: RMF() ? 1 : 0 },
    visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const charVariants = {
    default: {
      hidden: { opacity: RMF() ? 1 : 0, y: RMF() ? 0 : '0.5em', x: RMF() ? 0 : '-0.2em', scale: RMF() ? 1 : 0.8, rotateX: RMF() ? 0 : -45, filter: RMF() ? 'blur(0px)' : 'blur(2px)' },
      visible: { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 12, stiffness: 180, mass: 0.8 } },
    },
    title: {
      hidden: { opacity: RMF() ? 1 : 0, y: RMF() ? 0 : '0.6em', x: RMF() ? 0 : -10, skewY: RMF() ? 0 : 5, scale: RMF() ? 1 : 0.7, filter: RMF() ? 'blur(0px)' : 'blur(3px)'},
      visible: { opacity: 1, y: 0, x: 0, skewY: 0, scale: 1, filter: 'blur(0px)', transition: { type: "spring", damping: 10, stiffness: 130, mass:1, delayChildren:0.01 } }
    },
    scanline: { 
      hidden: { opacity: RMF() ? 1 : 0, y: RMF() ? 0 : '0.3em', width: RMF() ? 'auto' : 0 },
      visible: { opacity: 1, y: 0, width: 'auto', transition: { duration: 0.05, ease: 'linear' } },
    }
  };
  const selectedVariant = charVariants[variant] || charVariants.default;

  if (!isVisible && !RMF()) return <span aria-label={text} className="opacity-0">{text}</span>;

  const items = type === "word" ? words : letters;

  return (
    <motion.span variants={containerVariants} initial="hidden" animate={isVisible || RMF() ? "visible" : "hidden"} aria-label={text} style={{willChange}}>
      {items.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          variants={selectedVariant}
          className={`inline-block ${type === "word" ? wordClassName : charClassName}`}
          style={type === "word" ? { marginRight: '0.3em' } : {}}
        >
          {item === " " && type === "char" ? "\u00A0" : item}
        </motion.span>
      ))}
    </motion.span>
  );
};

// --- Dynamic Background Component ---
const DynamicAbstractBackground = ({ isDarkMode, patternType = 'grid', particleCount = 20 }) => {
  if (RMF()) return null;
  const willChange = useWillChange();
  return (
    <motion.div 
      className="absolute inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.04] overflow-hidden pointer-events-none"
      style={{willChange}}
    >
      {patternType === 'grid' && [...Array(10)].map((_, i) => (
        <motion.div key={`grid-h-${i}`} className="absolute h-px w-full bg-current top-0"
          initial={{y: `${i * 10}%`, x: '-100%'}} animate={{x: '100%'}}
          transition={{duration: 2 + i*0.5, delay:0.1 + i*0.1, repeat:Infinity, repeatType:'loop', ease:'linear'}}
        />
      ))}
      {patternType === 'grid' && [...Array(5)].map((_, i) => (
         <motion.div key={`grid-v-${i}`} className="absolute w-px h-full bg-current left-0"
          initial={{x: `${(i + 1) * 18}%`, y: '-100%'}} animate={{y: '100%'}}
          transition={{duration: 1.8 + i*0.4, delay:0.3 + i*0.15, repeat:Infinity, repeatType:'loop', ease:'linear'}}
        />
      ))}
      {patternType === 'particles' && [...Array(particleCount)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute rounded-full ${isDarkMode ? 'bg-gold/50' : 'bg-customyellow-600/50'}`}
          style={{
            width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity:0, scale:0}}
          animate={{
            x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80,
            opacity: [0, 1, 0], scale: [0,1,0.5,0]
          }}
          transition={{
            duration: Math.random() * 5 + 3, delay: Math.random() * 2,
            repeat: Infinity, ease: "linear"
          }}
        />
      ))}
    </motion.div>
  );
};

// --- Animated Border Component ---
const AnimatedHyperBorder = ({ isDarkMode, mouseX, mouseY }) => {
  if (RMF()) return <div className={`absolute -inset-px rounded-[17px] md:rounded-[19px] z-0 pointer-events-none border-2 ${isDarkMode ? 'border-gold/30' : 'border-customyellow-600/30'}`}/>;
  const willChange = useWillChange();
  return (
    <motion.div 
      className="absolute -inset-px rounded-[17px] md:rounded-[19px] z-0 pointer-events-none overflow-hidden"
      style={{willChange}}
    >
      <div className={`absolute inset-0 rounded-[15px] md:rounded-[17px] border-2 ${isDarkMode ? 'border-neutral-700/30' : 'border-gray-300/30'}`} />
      <motion.div
        className="absolute inset-0 rounded-[15px] md:rounded-[17px]"
        style={{
          border: "2px solid transparent",
          backgroundImage: `radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, ${isDarkMode ? 'rgba(234,179,8,0.6)' : 'rgba(200,150,0,0.6)'} 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 100%),
                           linear-gradient(170deg, ${isDarkMode ? 'rgba(234,179,8,0.35)' : 'rgba(200,150,0,0.35)'} 0%, ${isDarkMode ? 'rgba(163,0,26,0.25)' : 'rgba(120,50,0,0.25)'} 50%, ${isDarkMode ? 'rgba(234,179,8,0.35)' : 'rgba(200,150,0,0.35)'} 100%)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          backgroundSize: "200% 200%",
          animation: "borderPulse 6s ease-in-out infinite, borderSpinAngle 10s linear infinite",
        }}
        animate={{ backgroundPosition: ['0% 0%', '200% 200%', '0% 0%']}}
        transition={{duration: 12, repeat:Infinity, ease:'linear'}}
      />
      <motion.div
        className="absolute inset-px rounded-[14px] md:rounded-[16px] opacity-50"
        style={{
            boxShadow: `inset 0 0 10px ${isDarkMode ? 'rgba(234,179,8,0.3)' : 'rgba(200,150,0,0.3)'}`,
            animation: "innerGlowPulse 3s ease-in-out infinite alternate"
        }}
      />
    </motion.div>
  );
};

// Progress Indicator component for gallery navigation
const GalleryProgressIndicator = ({ currentIndex, totalImages, isDarkMode, onClick }) => {
  return (
    <div className="flex space-x-2 items-center justify-center mt-4">
      {[...Array(totalImages)].map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onClick(i)}
          className={`w-2 h-2 rounded-full transition-all ${
            currentIndex === i 
              ? isDarkMode ? 'bg-gold w-6' : 'bg-customyellow-600 w-6' 
              : isDarkMode ? 'bg-neutral-600' : 'bg-gray-300'
          }`}
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
    </div>
  );
};

// Helper function to get Lucide icon component by name
const getIconComponent = (iconName, isDarkMode) => {
  const IconComponent = {
    Code2: Code2,
    Zap: Zap,
    Calendar: Calendar,
    Info: Info,
    Server: Server,
    Cloud: Cloud,
    Database: Database,
    FileText: FileText,
    // Add other icons you might use here
  }[iconName];

  if (!IconComponent) return null; // Or a default icon

  return <IconComponent size={18} className={isDarkMode ? 'text-gold' : 'text-customyellow-600'} />;
};

// --- Main ProjectDetail Component ---
function ProjectDetail({ project, onClose, uniqueKey, isDarkMode }) {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const [reduceMotionPref, setReduceMotionPref] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // New state variables for enhanced features
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShowingGallery, setIsShowingGallery] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const willChange = useWillChange();

  // Mock multiple project images
  const projectImages = useMemo(() => {
    // Use provided image as first, then add placeholders
    const images = [project.image || '/api/placeholder/1000/560'];
    // Add 2 more placeholder images for gallery demo
    for (let i = 0; i < 2; i++) {
      images.push(`/api/placeholder/${900 + i * 50}/${500 + i * 30}`);
    }
    return images;
  }, [project.image]);

  useEffect(() => {
    setReduceMotionPref(RMF());
    const timer = setTimeout(() => setIsVisible(true), RMF() ? 0 : 600);
    return () => clearTimeout(timer);
  }, []);
  
  const mainScrollAreaRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: mainScrollAreaRef });
  const { scrollYProgress: modalScrollYProgress } = useScroll({ container: contentRef });

  const smoothImageScroll = useSpring(scrollYProgress, { stiffness: 110, damping: 45, restDelta: 0.0001 });
  
  const imageScale = useTransform(smoothImageScroll, [0, 0.6, 1], [1, 1.08, 1.18]); 
  const imageOpacity = useTransform(smoothImageScroll, [0, 0.75, 1], [1, 0.9, 0.65]);
  const imageY = useTransform(smoothImageScroll, [0, 1], [0, reduceMotionPref ? 0 : 50]); 

  const isImageInView = useInView(imageRef, { once: true, amount: 0.2 });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => { 
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && isShowingGallery) nextImage();
      else if (e.key === 'ArrowLeft' && isShowingGallery) prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (contentRef.current && !reduceMotionPref) {
      const focusable = contentRef.current.querySelector('button, [href]');
      if (focusable) setTimeout(() => focusable.focus(), 100);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, reduceMotionPref, isShowingGallery]);

  if (!project) return null;

  // Navigation functions for image gallery
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const getGradientClass = (tag, type = 'main') => {
    const intensity = type === 'main' ? (isDarkMode ? '950/25' : '100/90') : (isDarkMode ? '900/15' : '200/90');
    const endIntensity = type === 'main' ? (isDarkMode ? '900/15' : '200/80') : (isDarkMode ? '800/5' : '300/70');
    switch(tag?.toLowerCase()) {
      case 'web app': return `from-blue-${intensity} to-indigo-${endIntensity}`;
      case 'mobile': return `from-emerald-${intensity} to-teal-${endIntensity}`;
      case 'ai': return `from-red-${intensity} to-rose-${endIntensity}`;
      case 'design': return `from-pink-${intensity} to-purple-${endIntensity}`;
      case 'website': default: return `from-slate-${intensity} to-neutral-${endIntensity}`;
    }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0, backgroundColor: "rgba(0,0,0,0)" },
    visible: { 
      opacity: 1, 
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.9)" : "rgba(17,24,39,0.85)",
      transition: { duration: 0.5, ease: "circOut" } 
    },
    exit: { 
      opacity: 0, 
      backgroundColor: "rgba(0,0,0,0)",
      transition: { duration: 0.4, ease: "circIn" } 
    }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: reduceMotionPref ? 1 : 0.85, 
      y: reduceMotionPref ? 0 : 70, 
      filter: reduceMotionPref ? "blur(0px)" : "blur(5px)" 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { ...ultraSpring, duration: 0.9, when: "beforeChildren", staggerChildren: 0.12, delayChildren: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: reduceMotionPref ? 1 : 0.9, 
      y: reduceMotionPref ? 0 : 50, 
      filter: reduceMotionPref ? "blur(0px)" : "blur(3px)",
      transition: { duration: 0.45, ease: fluidEase, when: "afterChildren", staggerChildren: 0.07, staggerDirection: -1 }
    }
  };
  
  const listItemVariants = (i) => ({
    hidden: { opacity: RMF() ? 1 : 0, x: RMF() ? 0 : -20 },
    visible: { opacity: 1, x: 0, transition: { ...snappySpring, delay: (RMF() ? 0 : 0.3) + i * 0.07 } },
  });

  function handleMouseMoveForBorder(e) {
    if (RMF() || !contentRef.current) return;
    const rect = contentRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const willChangeModal = useWillChange();

  // Toggle full screen gallery mode
  const toggleGallery = () => {
    setIsShowingGallery(!isShowingGallery);
  };

  return (
    <motion.div
      key={`modal-hyper-wrapper-${uniqueKey}`}
      initial="hidden" animate="visible" exit="exit"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-3 md:p-4"
      role="dialog" aria-modal="true"
      aria-labelledby={`modal-title-${project.id || project.title}`}
      aria-describedby={`modal-desc-${project.id || project.title}`}
      onMouseMove={handleMouseMoveForBorder}
      style={{willChange: willChangeModal}}
    >
      <motion.div
        variants={overlayVariants}
        className="fixed inset-0"
        style={{ 
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)"
        }}
        onClick={onClose}
      >
        {!reduceMotionPref && <DynamicAbstractBackground isDarkMode={isDarkMode} patternType="particles" particleCount={isDarkMode ? 25 : 15} />}
      </motion.div>
      
      <motion.div
        ref={contentRef}
        variants={modalVariants}
        className={`relative rounded-xl md:rounded-[20px] w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl shadow-2xl
        ${isDarkMode ? 'shadow-gold/25' : 'shadow-customyellow-700/20'}
        max-h-[90vh] sm:max-h-[94vh] md:max-h-[96vh] flex flex-col
        overflow-y-auto custom-scrollbar md:overflow-hidden
        ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}
        style={{willChange: willChangeModal}}
      >
        <AnimatedHyperBorder isDarkMode={isDarkMode} mouseX={mouseX} mouseY={mouseY}/>
        
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className={`absolute top-2.5 right-2.5 z-[70] p-1 sm:p-1.5 rounded-full transition-all group/close-hyper
            ${isDarkMode ? 'bg-neutral-800/50 text-gold hover:bg-neutral-700/70 focus-visible:ring-gold/70' : 'bg-white/50 text-gray-500 hover:bg-gray-100/70 focus-visible:ring-customyellow-700/70'} 
            backdrop-blur-xl shadow-2xl focus:outline-none focus-visible:ring-2`}
          whileHover={reduceMotionPref ? {} : { scale: 1.25, transition: { ...hyperSpring, damping:10 } }}
          whileTap={{ scale: 0.9 }}
          aria-label="Fermer"
        >
          <motion.div 
            className="group-hover/close-hyper:text-red-400 dark:group-hover/close-hyper:text-red-300"
            initial={{ rotate:0 }}
            whileHover={reduceMotionPref ? {} : { rotate: [0, -15, 15, -10, 10, 0, 360], scale: [1, 1.1, 0.9, 1.05, 1], transition: { duration: 0.7, ease: fluidEase } }}
          >
            <X size={10} strokeWidth={2.5} className="sm:size-12" />
          </motion.div>
        </motion.button>
        
        {/* Main content with layout */}
        <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">
            {/* === Sidebar === */}
            <motion.aside
            className={`p-5 pt-12 sm:p-6 sm:pt-14 md:p-7 md:pt-14 flex flex-col relative 
                ${isDarkMode ? 'bg-neutral-950/70 md:border-r md:border-neutral-700/25 backdrop-blur-lg' : 'bg-white/70 md:border-r md:border-gray-200/60 backdrop-blur-lg'}
                w-full md:w-[38%] md:overflow-y-auto md:custom-scrollbar shrink-0
                border-b md:border-b-0 ${isDarkMode ? 'border-neutral-700/25' : 'border-gray-200/60'}`}
            variants={contentChildVariants(RMF() ? 0 : 0.1)}
            >
            <DynamicAbstractBackground isDarkMode={isDarkMode} patternType="grid" />

            <motion.h3 variants={sectionTitleVariants} className={`text-xl sm:text-2xl font-black mb-5 sm:mb-7 ${isDarkMode ? 'text-customyellow-700' : 'text-customyellow-700'}`}>
                <AnimatedText text="Synthèse Projet" type="char" variant="title" stagger={0.03} delay={isVisible && !RMF() ? 0.2 : 0} isVisible={isVisible} />
            </motion.h3>
            
            <motion.div variants={contentChildVariants(RMF() ? 0 : 0.1)} className="mb-5 sm:mb-7">
                <motion.div
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs font-bold inline-flex items-center gap-0.5 sm:gap-1 shadow-xl group/tag
                    ${isDarkMode ? 'bg-gold/25 text-gold border-2 border-gold/35' : 'bg-customyellow-600/20 text-customyellow-700 border-2 border-customyellow-600/35'}`}
                whileHover={reduceMotionPref ? {} : { scale: 1.12, y: -4, boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(234,179,8,0.35)' : 'rgba(200,150,0,0.28)'}`, transition: hyperSpring }}
                >
                <motion.span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full ${isDarkMode ? 'bg-gold' : 'bg-customyellow-600'}`}
                    animate={reduceMotionPref ? {} : { scale: [1, 1.8, 1], opacity: [1, 0.4, 1], boxShadow: `0 0 8px ${isDarkMode ? 'rgba(234,179,8,0.6)' : 'rgba(200,150,0,0.5)'}` }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
                <TagIcon size={10} className="sm:size-12 group-hover/tag:rotate-12 transition-transform duration-300" />
                <span>{project.category || 'Projet'}</span>
                </motion.div>
            </motion.div>
            
            <motion.div variants={staggerContainer(0.07, 0.2)} initial="hidden" animate="visible" className="mb-6 space-y-3.5 sm:space-y-4">
                {/* Project Title */}
                <motion.h2 
                variants={listItemVariants(0)}
                id={`modal-title-${project.id || project.title}`}
                className={`text-xl sm:text-2xl lg:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-customyellow-700'}`}
                >
                {project.title}
                </motion.h2>
                
                {/* Date Range */}
                <motion.div variants={listItemVariants(1)} className="flex items-center gap-2">
                <CalendarDays size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {project.dateRange || 'Jan 2023 - Mars 2023'}
                </span>
                </motion.div>

                {/* Short Description */}
                <motion.p 
                variants={listItemVariants(3)}
                id={`modal-desc-${project.id || project.title}`}
                className={`text-sm sm:text-base mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                {project.summary || project.description?.substring(0, 150) + '...' || 
                    'Une description courte du projet irait ici, décrivant brièvement les objectifs et résultats.'}
                </motion.p>
            </motion.div>

            {/* Tech stack / Tools used */}
            <motion.div 
                variants={contentChildVariants(0.2)}
                className="mb-7"
            >
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                {(project.tools && project.tools.length > 0 ? project.tools : ['React', 'TypeScript', 'Tailwind CSS', 'Node.js']).map((tech, i) => (
                    <motion.span
                    key={tech}
                    custom={i}
                    variants={toolBadgeVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`px-2.5 py-1 text-xs font-medium rounded-md 
                        ${isDarkMode ? 'bg-neutral-800 text-gray-200 border border-neutral-700' : 'bg-white text-gray-700 border border-gray-200'}`}
                    >
                    {tech}
                    </motion.span>
                ))}
                </div>
            </motion.div>
            
            {/* Project status */}
            <motion.div 
                variants={contentChildVariants(0.3)}
                className="mb-7"
            >
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Statut
                </h4>
                <motion.div 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg 
                    ${project.status === 'completed' 
                        ? (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600')
                        : (isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                    }`}
                whileHover={{ x: 3, transition: hyperSpring }}
                >
                {project.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                <span className="text-sm font-medium">
                    {project.status === 'completed' ? 'Projet complété' : 'En cours de développement'}
                </span>
                </motion.div>
            </motion.div>
            {/* Conditional Links section */}
            {(project.links?.length > 0 || project.demoLink || project.githubLink) && (
                <motion.div variants={contentChildVariants(0.5)} className="mb-7">
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Liens
                </h4>
                <div className="space-y-2">
                    {project.demoLink && (
                    <motion.a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
                        ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                        whileHover={{ x: 5, transition: { ...hyperSpring } }}
                    >
                        <div className="flex items-center gap-2">
                        <Zap size={16} className={isDarkMode ? 'text-gold' : 'text-customyellow-600'} />
                        <span>Voir la démo</span>
                        </div>
                        <ExternalLink size={14} />
                    </motion.a>
                    )}
                    
                    {project.githubLink && (
                    <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
                        ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                        whileHover={{ x: 5, transition: { ...hyperSpring } }}
                    >
                        <div className="flex items-center gap-2">
                        <Github size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                        <span>Code source</span>
                        </div>
                        <ExternalLink size={14} />
                    </motion.a>
                    )}
                </div>
                </motion.div>
            )}
            
            {/* Quick feedback section */}
            <motion.div 
                variants={contentChildVariants(0.6)}
                className="mt-auto md:mb-5"
            >
                {!showFeedbackForm ? (
                <motion.button
                    onClick={() => setShowFeedbackForm(true)}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium 
                    ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                    whileHover={{ scale: 1.03, transition: { ...hyperSpring } }}
                >
                    Évaluer ce projet
                </motion.button>
                ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full"
                >
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quelle note donneriez-vous?</p>
                    <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 ${rating >= star ? (isDarkMode ? 'text-gold' : 'text-customyellow-600') : (isDarkMode ? 'text-neutral-700' : 'text-gray-300')}`}
                        whileHover={{ scale: 1.3, transition: { ...hyperSpring } }}
                        whileTap={{ scale: 0.9 }}
                        >
                        <Star size={20} fill={rating >= star ? (isDarkMode ? '#eab308' : '#ca8a04') : 'none'} />
                        </motion.button>
                    ))}
                    </div>
                    <div className="flex gap-2">
                    <motion.button
                        onClick={() => {
                        setShowFeedbackForm(false);
                        setRating(0);
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border
                        ${isDarkMode ? 'border-neutral-700 hover:bg-neutral-800 text-gray-300' : 'border-gray-200 hover:bg-gray-100 text-gray-600'}`}
                        whileHover={{ scale: 1.03, transition: { ...hyperSpring } }}
                    >
                        Annuler
                    </motion.button>
                    <motion.button
                        onClick={() => {
                        setShowFeedbackForm(false);
                        // Here we would submit the feedback
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium
                        ${isDarkMode ? 'bg-gold hover:bg-gold/90 text-neutral-900' : 'bg-customyellow-600 hover:bg-customyellow-700 text-white'}`}
                        whileHover={{ scale: 1.03, transition: { ...hyperSpring } }}
                    >
                        Envoyer
                    </motion.button>
                    </div>
                </motion.div>
                )}
            </motion.div>
            </motion.aside>

            {/* === Main Content Area === */}
            <motion.div
                ref={mainScrollAreaRef}
                variants={contentChildVariants(0.2)}
                className="relative flex-1 overflow-y-auto custom-scrollbar"
                style={{
                willChange
                }}
            >
                {/* Full hero image with parallax effect */}
                <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden">
                    {/* Switch between gallery mode and normal mode */}
                    {isShowingGallery ? (
                        <div className="absolute inset-0 z-10 bg-black/80 flex flex-col">
                            {/* Gallery Navigation Header */}
                            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-neutral-900' : 'bg-gray-800'}`}>
                                <motion.button
                                    onClick={toggleGallery}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${isDarkMode ? 'text-white bg-neutral-800 hover:bg-neutral-700' : 'text-white bg-gray-700 hover:bg-gray-600'}`}
                                    whileHover={{ x: -3 }}
                                >
                                    <ChevronLeft size={16} />
                                    <span>Retour</span>
                                </motion.button>
                                <span className="text-sm text-white font-medium">
                                    {currentImageIndex + 1} / {projectImages.length}
                                </span>
                            </div>
                            
                            {/* Gallery Image Display */}
                            <div className="flex-1 flex items-center justify-center p-4">
                                <motion.img
                                    src={projectImages[currentImageIndex]}
                                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            
                            {/* Gallery Navigation Dots */}
                            <GalleryProgressIndicator
                                currentIndex={currentImageIndex}
                                totalImages={projectImages.length}
                                isDarkMode={isDarkMode}
                                onClick={setCurrentImageIndex}
                            />
                        </div>
                    ) : (
                        <>
                            <motion.div
                                ref={imageRef}
                                style={{ 
                                    y: imageY,
                                    scale: imageScale, 
                                    opacity: imageOpacity, 
                                    willChange
                                }}
                                className={`absolute inset-0 bg-gradient-to-b ${getGradientClass(project.category)}`}
                            >
                                <motion.img
                                    src={project.image || projectImages[0] || "/api/placeholder/1200/600"}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: RMF() ? 1 : 0 }}
                                    animate={{ opacity: isImageInView ? 1 : 0 }}
                                    transition={{ duration: 0.8 }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t 
                                    ${isDarkMode ? 'from-neutral-900/90 via-neutral-900/30 to-transparent' : 'from-white/90 via-white/30 to-transparent'}`}
                                />
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Content sections */}
                <div className={`p-5 sm:p-7 md:p-8 space-y-8 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                    {/* Project Description */}
                    <motion.div
                        variants={contentChildVariants(0.3)}
                        className="space-y-4"
                    >
                        <motion.h3 variants={sectionTitleVariants} 
                            className={`text-xl font-bold ${isDarkMode ? 'text-customyellow-700' : 'text-customyellow-700'}`}>
                            <AnimatedText text="À propos du projet" type="char" variant="title" stagger={0.03} delay={isVisible && !RMF() ? 0.3 : 0} isVisible={isVisible} />
                        </motion.h3>
                        
                        <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {project.description || 
                                `Ce projet présente une interface utilisateur interactive et élégante qui combine une esthétique moderne avec une expérience utilisateur fluide.
                                La conception met l'accent sur l'accessibilité et la performance, garantissant une expérience cohérente sur tous les appareils.`}
                            </p>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {`L'objectif principal était de créer une solution intuitive qui répond aux besoins spécifiques des utilisateurs tout en maintenant une architecture technique solide et évolutive. Des animations subtiles et des micro-interactions améliorent l'engagement sans compromettre la facilité d'utilisation.`}
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Technical Highlights */}
                    <motion.div
                        variants={contentChildVariants(0.4)}
                        className="space-y-4"
                    >
                        <motion.h3 variants={sectionTitleVariants} 
                            className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-customyellow-700'}`}>
                            <AnimatedText text="Aspects techniques" type="char" variant="title" stagger={0.03} delay={isVisible && !RMF() ? 0.4 : 0} isVisible={isVisible} />
                        </motion.h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(project.technicalAspects && project.technicalAspects.length > 0 ? project.technicalAspects : []).map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    className={`p-4 rounded-xl border ${isDarkMode ? 'bg-neutral-850 border-neutral-700 hover:border-gold/50' : 'bg-yellow-50/60 border-yellow-200 hover:border-customyellow-600/60'} transition-colors`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, ...snappySpring }}
                                    whileHover={{ y: -3, transition: { ...hyperSpring } }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${isDarkMode ? 'text-gold' : 'text-customyellow-600'}`}>
                                            {/* Render icon based on string name */}
                                            {getIconComponent(item.icon, isDarkMode)}
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-customyellow-700'}`}>{item.title}</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-customyellow-800'}`}>{item.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {(project.technicalAspects && project.technicalAspects.length > 0) ? null : (
                            <motion.div
                                className={`p-4 rounded-xl border ${isDarkMode ? 'bg-neutral-850 border-neutral-700' : 'bg-yellow-50/60 border-yellow-200'} transition-colors col-span-full text-center ${isDarkMode ? 'text-gray-400' : 'text-customyellow-800'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, ...snappySpring }}
                            >
                                <p>Aucun aspect technique spécifique n'est listé pour ce projet.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProjectDetail;