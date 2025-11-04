import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimation, AnimatePresence } from 'framer-motion';
// Make sure these paths are correct for your project structure
import SkillCard from './SkillCard';     // Assuming ./SkillCard.jsx or ./SkillCard.js
import TimelineEvent from './TimelineEvent'; // Assuming ./TimelineEvent.jsx or ./TimelineEvent.js
import ContactButton from './ContactButton'; // Assuming ./ContactButton.jsx or ./ContactButton.js

const skills = [
  { name: 'HTML', logo: 'https://brandeps.com/logo-download/H/HTML-5-logo-vector-01.svg', category: 'Frontend', proficiency: 95, years: 2 },
  { name: 'CSS', logo: 'https://www.vectorlogo.zone/logos/w3_css/w3_css-official.svg', category: 'Frontend', proficiency: 90, years: 2 },
  { name: 'JavaScript', logo: 'https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg', category: 'Frontend', proficiency: 85, years: 1.5 },
  { name: 'React', logo: 'https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/react.svg', category: 'Frontend', proficiency: 70, years: 1 },
  { name: 'Next.js', logo: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg', category: 'Frontend', proficiency: 65, years: 0.8 },
  { name: 'Tailwind CSS', logo: 'https://raw.githubusercontent.com/withastro/docs/1dbcb6c05461b6fd744ceab8a03f45ed4618ec4f/public/logos/tailwind.svg', category: 'Frontend', proficiency: 75, years: 1 },
  { name: 'Vue.js', logo: 'https://www.vectorlogo.zone/logos/vuejs/vuejs-icon.svg', category: 'Frontend', proficiency: 60, years: 0.8 },
  { name: 'SQL', logo: 'https://www.svgrepo.com/show/7344/sql-file-format-symbol.svg', category: 'Backend', proficiency: 80, years: 1.5 },
  { name: 'Supabase', logo: 'https://cdn.brandfetch.io/idsSceG8fK/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B', category: 'Backend', proficiency: 60, years: 0.5 },
  { name: 'Symfony', logo: 'https://www.svgrepo.com/show/508947/symfony.svg', category: 'Backend', proficiency: 75, years: 1.5 },
  { name: 'Flutter', logo: 'https://www.svgrepo.com/show/341825/flutter.svg', category: 'Mobile', proficiency: 80, years: 1.5 },
  { name: 'Dart', logo: 'https://www.svgrepo.com/show/353631/dart.svg', category: 'Mobile', proficiency: 78, years: 1.5 },
];

const roadmap = [
  {
    year: '2022',
    title: 'Bac Pro Métiers de l\'Électricité et de ses Environnements Connectés (MELEC)',
    icon: '🎓',
    details: 'Après mon Bac Pro Métiers de l\'Électricité et de ses Environnements Connectés, j\'ai découvert ma passion pour la programmation et le design, ce qui m\'a poussé à me réorienter vers l\'informatique.',
  },
  {
    year: '2023',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    icon: '💻',
    details: 'Je me suis concentré sur la conception web interactive et les principes d\'UI/UX.',
  },
  {
    year: '2025',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    icon: '💻',
    details: 'Formation en développement web et systèmes, avec un focus particulier sur la conception d\'interfaces utilisateurs.',
  },
  {
    year: '2026/2027',
    title: 'Prévisions futures',
    icon: '🚀',
    details: 'Licence pour approfondir mes compétences en informatique, puis intégrer une école d\'ingénieurs pour me spécialiser dans le développement et le design.',
  },
];

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const shimmerAnimation = {
  x: ["-100%", "100%"],
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    duration: 2.5,
    ease: "linear"
  }
};

const CustomCursor = ({ isDarkMode }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const outerSpringConfig = { damping: 30, stiffness: 200, mass: 0.7 };

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .interactive-hover')) {
        setIsHoveringInteractive(true);
      }
    };
    const handleMouseOut = (e) => {
       if (e.target.closest('a, button, [role="button"], .interactive-hover')) {
        setIsHoveringInteractive(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    // Optional: Hide system cursor. Add to global CSS: body { cursor: none; }
    // document.body.style.cursor = 'none'; 

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      // document.body.style.cursor = 'auto';
    };
  }, []);

  const smoothMouseInner = {
    x: useSpring(mousePosition.x, springConfig),
    y: useSpring(mousePosition.y, springConfig),
  };
  const smoothMouseOuter = {
    x: useSpring(mousePosition.x, outerSpringConfig),
    y: useSpring(mousePosition.y, outerSpringConfig),
  };

  const innerSize = isClicking ? 10 : 8;
  const outerBaseSize = 32;
  const outerHoverSize = 40;
  
  const outerVariants = {
    default: { 
      width: outerBaseSize, height: outerBaseSize, scale: 1, 
      borderColor: isDarkMode ? 'rgba(234,179,8,0.7)' : 'rgba(234,179,8,0.9)',
      borderWidth: 2, backgroundColor: 'transparent'
    },
    hovering: { 
      width: outerHoverSize, height: outerHoverSize, scale: 1.1, 
      borderColor: isDarkMode ? 'rgba(234,179,8,0.9)' : 'rgba(249,115,22,1)',
      backgroundColor: isDarkMode ? 'rgba(234,179,8,0.1)' : 'rgba(234,179,8,0.05)',
      borderWidth: 2,
    },
    clicking: { 
      width: outerHoverSize, height: outerHoverSize, scale: 0.9, 
      borderColor: isDarkMode ? 'rgba(234,179,8,1)' : 'rgba(249,115,22,1)', 
      backgroundColor: isDarkMode ? 'rgba(234,179,8,0.2)' : 'rgba(234,179,8,0.1)',
    }
  };

  let currentOuterVariant = "default";
  if (isClicking) currentOuterVariant = "clicking";
  else if (isHoveringInteractive) currentOuterVariant = "hovering";

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{ translateX: smoothMouseOuter.x, translateY: smoothMouseOuter.y, x: "-50%", y: "-50%" }}
        variants={outerVariants}
        animate={currentOuterVariant}
        transition={{ type: 'spring', ...outerSpringConfig }}
      />
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] ${isDarkMode ? 'bg-gold' : 'bg-gold'}`}
        style={{ translateX: smoothMouseInner.x, translateY: smoothMouseInner.y, x: "-50%", y: "-50%" }}
        animate={{ width: innerSize, height: innerSize }}
        transition={{ type: 'spring', ...springConfig }}
      />
    </>
  );
};

const ScrollProgress = ({ scrollYProgress, isDarkMode }) => {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
      style={{
        scaleX,
        background: `linear-gradient(to right, ${isDarkMode ? 'rgba(234,179,8,0.7)' : 'rgba(234,179,8,0.8)'}, ${isDarkMode ? 'rgba(249,115,22,0.7)' : 'rgba(249,115,22,0.8)'})`
      }}
    />
  );
};

const EnhancedTooltip = ({ text, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative interactive-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedSectionTitle = ({ title, isDarkMode }) => {
  const titleChars = title.split("");
  return (
    <motion.div
      className="flex items-center gap-3 mb-14 relative" // Removed overflow-hidden to ensure shimmer isn't clipped if its x is large
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-gold' : 'text-gray-900'} relative whitespace-nowrap`}>
        {titleChars.map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.04, ease: "easeOut" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
        <motion.span
          className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-gold via-orange-500 to-gold"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 + titleChars.length * 0.04 }}
        />
      </h3>
      <div className={`flex-grow h-0.5 ${isDarkMode ? 'bg-gold/30' : 'bg-gray-300'} relative overflow-hidden`}>
        <motion.div
          className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ x: "-100%" }} 
          animate={shimmerAnimation}
        />
      </div>
      <motion.div
        className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-gold' : 'bg-gold'}`}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default function About({ isDarkMode, onOpenContact }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: pageScrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.7, 1, 1, 0.9]);
  const parallaxEffect1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxEffect2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const parallaxEffect3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const [activeCategory, setActiveCategory] = useState('Tout');
  const categories = ['Tout', ...Array.from(new Set(skills.map(skill => skill.category)))];
  const filteredSkills = activeCategory === 'Tout'
    ? skills
    : skills.filter(skill => skill.category && skill.category.toLowerCase() === activeCategory.toLowerCase());

  const aboutHeaderRef = useRef(null); // Refs for scrollspy if needed, not directly used in this animation pass
  const timelineRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const { clientX, clientY } = e;
      const containerRect = containerRef.current.getBoundingClientRect();
      setMousePosition({ x: clientX - containerRect.left, y: clientY - containerRect.top });
    }
  };
  
  // Note: VisibleSection useEffect is omitted for brevity as it's not directly related to Framer Motion enhancements requested.

  const lightModeClasses = {
    sectionBg: 'bg-white/70 backdrop-blur-md', heading: 'text-gray-800', paragraph: 'text-gray-700',
    secondaryText: 'text-gray-600', accent: 'text-gold', cardBg: 'bg-white shadow-lg hover:shadow-xl',
    badge: 'bg-gray-100 text-gray-800', activeBadge: 'bg-gradient-to-r from-gold to-orange-500 text-white',
    buttonBg: 'bg-white hover:bg-gray-50', timeline: 'bg-white border border-gray-200',
    divider: 'bg-gradient-to-r from-gold/50 via-gold/30 to-transparent',
  };
  const darkModeClasses = {
    sectionBg: 'bg-black', heading: 'text-gold', paragraph: 'text-gray-300',
    secondaryText: 'text-gray-400', accent: 'text-gold', cardBg: 'bg-zinc-900 shadow-xl hover:shadow-2xl',
    badge: 'bg-zinc-900 text-gray-200', // Assuming text-foreground or similar for light text
    activeBadge: 'bg-gradient-to-r from-gold to-orange-500 text-gray-900', // Assuming text-background for dark text
    buttonBg: 'bg-zinc-900 hover:bg-zinc-800', timeline: 'bg-black border border-gold/10',
    divider: 'bg-gradient-to-r from-gold/50 to-transparent',
  };
  const themeClasses = isDarkMode ? darkModeClasses : lightModeClasses;

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
  };

  const titleText = "À propos de moi";
  const titleChars = titleText.split("");

  return (
    <>
      <CustomCursor isDarkMode={isDarkMode} />
      <ScrollProgress scrollYProgress={pageScrollYProgress} isDarkMode={isDarkMode} />

      <section
        id="about"
        ref={containerRef}
        className={`w-full max-w-7xl mx-auto py-12 md:py-16 px-6 md:px-12 ${themeClasses.sectionBg} ${themeClasses.paragraph} transition-colors duration-300 relative`}
        style={{ border: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveringContainer(true)}
        onMouseLeave={() => setIsHoveringContainer(false)}
      >
        {isHoveringContainer && (
          <motion.div
            className={`absolute w-12 h-12 rounded-full ${isDarkMode ? 'bg-gold/10' : 'bg-gold/5'} blur-lg -z-10`}
            style={{ left: mousePosition.x - 24, top: mousePosition.y - 24 }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}

        {/* Background Parallax Elements */}
        <motion.div className={`absolute top-0 right-0 w-96 h-96 rounded-full ${isDarkMode ? 'bg-gold/8' : 'bg-gold/5'} blur-3xl -z-10`} style={{ y: parallaxEffect1, scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]), opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.2]) }} />
        <motion.div className={`absolute bottom-40 left-10 w-80 h-80 rounded-full ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-500/3'} blur-3xl -z-10`} style={{ y: parallaxEffect2, x: useTransform(scrollYProgress, [0, 1], [0, 50]), opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.7, 0.3]) }} />
        <motion.div className={`absolute top-1/3 left-1/3 w-40 h-40 rounded-md rotate-45 ${isDarkMode ? 'bg-gold/5' : 'bg-gold/7'} blur-xl -z-10`} style={{ x: useTransform(scrollYProgress, [0, 1], [-50, 50]), rotate: parallaxRotate, scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.8, 0.7])}} />
        <motion.div className={`absolute top-1/2 right-1/4 w-24 h-24 rounded-full ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-500/7'} blur-lg -z-10`} style={{ x: useTransform(scrollYProgress, [0, 1], [30, -30]), y: parallaxEffect3, opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.8, 0.6, 0.1])}} />
        <motion.div className={`absolute bottom-1/4 right-10 w-32 h-32 rounded-full ${isDarkMode ? 'bg-gold/5' : 'bg-gold/7'} blur-xl -z-10`} style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]), x: useTransform(scrollYProgress, [0, 1], [-20, 20]), opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.5, 0.1])}} animate={floatingAnimation} />
        <motion.div className={`absolute top-1/3 right-1/3 w-16 h-16 rounded-md rotate-12 ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-500/7'} blur-lg -z-10`} style={{ rotate: useTransform(scrollYProgress, [0, 1], [12, -24]), scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 0.8])}} animate={pulseAnimation} />
        
        <motion.div style={{ opacity: contentOpacity }}>
            <motion.div
              ref={aboutHeaderRef} className="mb-32"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <motion.h2
                initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`text-4xl md:text-5xl font-extrabold text-left mb-12 ${themeClasses.heading} tracking-tight`}
              >
                <span className="inline-block relative">
                  {titleChars.map((char, index) => (
                    <motion.span key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 + index * 0.05, ease: "easeOut" }} className="inline-block">
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  <motion.span className="absolute -bottom-3 left-0 h-2 bg-gradient-to-r from-gold via-orange-500 to-gold" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.6 + titleChars.length * 0.05 }} />
                </span>
              </motion.h2>

              <motion.div className="grid md:grid-cols-5 gap-12 items-center" variants={itemVariants}>
                <motion.div className="md:col-span-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={contentContainerVariants}>
                  <motion.p variants={itemVariants} className={`text-xl md:text-2xl leading-relaxed text-left max-w-3xl mb-8 ${themeClasses.paragraph}`}>
                    Je suis un <motion.span className={`font-bold inline-block interactive-hover ${themeClasses.accent}`} whileHover={{ scale: 1.1, textShadow: `0 0 8px ${isDarkMode ? 'rgba(234,179,8,0.5)' : 'rgba(234,179,8,0.7)'}` }} whileTap={{ scale: 0.95 }}>designer</motion.span> et <motion.span className={`font-bold inline-block interactive-hover ${themeClasses.accent}`} whileHover={{ scale: 1.1, textShadow: `0 0 8px ${isDarkMode ? 'rgba(234,179,8,0.5)' : 'rgba(234,179,8,0.7)'}` }} whileTap={{ scale: 0.95 }}>développeur</motion.span> encore en études, passionné par la création d'expériences digitales modernes, minimalistes et animées, alliant design épuré et interactions fluides.
                  </motion.p>
                  <motion.p variants={itemVariants} className={`text-base md:text-lg leading-relaxed text-left max-w-3xl mb-10 ${themeClasses.secondaryText}`}>
                    Mon approche combine esthétique minimaliste et fonctionnalité intuitive pour créer des interfaces utilisateur mémorables et performantes qui s'adaptent aux besoins des utilisateurs.
                  </motion.p>
                  <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-10" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div ref={timelineRef} className="mb-32" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
              <AnimatedSectionTitle title="Parcours" isDarkMode={isDarkMode} />
              <motion.div className="relative" variants={contentContainerVariants}>
                {roadmap.map((event, index) => (
                  <motion.div key={event.year + event.title + index} className="mb-12" variants={itemVariants} whileHover={{ x: index % 2 === 0 ? 4 : -4, transition: { type: "spring", stiffness: 350, damping: 10 } }}>
                    <TimelineEvent item={event} idx={index} isDarkMode={isDarkMode} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div ref={skillsRef} className="mb-32" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
              <AnimatedSectionTitle title="Compétences" isDarkMode={isDarkMode} />
              <motion.div className="flex flex-wrap gap-3 mb-8 md:gap-4" variants={contentContainerVariants}>
                {categories.map((category) => (
                  <motion.span
                    key={category}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full cursor-pointer text-sm md:text-base interactive-hover ${themeClasses.badge} ${ activeCategory === category ? themeClasses.activeBadge : (isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-200') }`}
                    onClick={() => setActiveCategory(category)}
                    variants={itemVariants}
                    whileHover={{ y: -2, transition: { type: "spring", stiffness:400, damping:10 } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" variants={contentContainerVariants}>
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill) => (
                     <motion.div
                        key={skill.name} layout
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, duration:0.3 }}
                        // variants={itemVariants} // This would be for initial stagger, layout/presence handles changes
                        className="interactive-hover"
                        whileHover={{ y: -6, scale:1.03, transition:{type:'spring', stiffness:300, damping:12} }}
                     >
                        <SkillCard skill={skill} isDarkMode={isDarkMode} />
                     </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.div ref={contactRef} className="flex justify-center items-center min-h-[340px] py-16 px-6 md:px-12 relative" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
              <motion.div
                className={`relative w-full max-w-5xl min-h-[320px] mx-auto shadow-2xl py-20 px-6 md:px-16 flex flex-col border rounded-2xl items-center justify-center overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-black/80 border-gold/20' : 'bg-white/80 border-gold/30 backdrop-blur-xl'}`}
                whileHover={{ scale: 1.02, boxShadow: `0 10px 50px 0 ${isDarkMode ? 'rgba(234,193,7,0.2)' : 'rgba(234,193,7,0.15)'}, 0 4px 15px 0 rgba(0,0,0,0.08)`, borderColor: isDarkMode ? 'rgba(234,179,8,0.6)' : 'rgba(234,179,8,0.7)', filter: 'brightness(1.05)' }}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <motion.div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 bg-gold/30 -z-10" animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15]}} transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease:"easeInOut" }} />
                <motion.div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-40 h-8 rounded-full blur-2xl opacity-30 bg-orange-400/60 -z-10" animate={{ scaleX: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2]}} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease:"easeInOut" }} />
                <motion.h3
                  className="text-4xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-gold via-orange-400 to-gold bg-clip-text text-transparent text-center flex items-center gap-3 drop-shadow-lg"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay:0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-gold animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Intéressé par mon travail ?
                </motion.h3>
                <motion.p
                  className={`text-lg md:text-xl mb-10 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} leading-relaxed drop-shadow-sm text-center max-w-2xl`}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
                >
                  N'hésitez pas à me <span className="text-gold font-semibold">contacter</span> pour discuter de vos projets ou pour toute information complémentaire. Je me ferai un plaisir de vous répondre rapidement !
                </motion.p>
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 220 }}
                  className="relative group"
                >
                  <ContactButton 
                    onOpenContact={onOpenContact} 
                    className={`text-lg px-8 py-4 rounded-full shadow-xl bg-gradient-to-r from-gold to-orange-400 text-black font-bold border-none relative overflow-hidden interactive-hover group-hover:scale-105 transition-transform duration-300 ease-out focus:scale-105`}
                  />
                  <motion.span 
                    className="absolute inset-0 rounded-full pointer-events-none bg-gold/20 blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0.2, 0.7, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] }} 
                  />
                </motion.div>
              </motion.div>
            </motion.div>
        </motion.div>
      </section>
    </>
  );
}