import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import SkillCard from './SkillCard';
import TimelineEvent from './TimelineEvent';
import ContactButton from './ContactButton';

const skills = [
  { name: 'HTML', logo: '/src/assets/skill/html-5-svgrepo-com.svg', category: 'Frontend', proficiency: 100, years: 2 },
  { name: 'CSS', logo: '/src/assets/skill/css-3-svgrepo-com.svg', category: 'Frontend', proficiency: 90, years: 2 },
  { name: 'JavaScript', logo: '/src/assets/skill/js-official-svgrepo-com.svg', category: 'Frontend', proficiency: 85, years: 1.5 },
  { name: 'Symfony', logo: '/src/assets/skill/symfony-svgrepo-com.svg', category: 'Backend', proficiency: 97, years: 2 },
  { name: 'Vue.js', logo: '/src/assets/skill/vue-9-logo-svgrepo-com.svg', category: 'Frontend', proficiency: 75, years: 1 },
  { name: 'Flutter', logo: '/src/assets/skill/flutter-svgrepo-com.svg', category: 'Mobile', proficiency: 82, years: 1.5 },
  { name: 'React', logo: '/src/assets/skill/react-svgrepo-com.svg', category: 'Frontend', proficiency: 65, years: 0.6 },
  { name: 'SQL', logo: '/src/assets/skill/sql-file-format-symbol-svgrepo-com.svg', category: 'Backend', proficiency: 90, years: 2 },
  { name: 'Next.js', logo: '/src/assets/skill/nextjs-icon-svgrepo-com.svg', category: 'Frontend', proficiency: 70, years: 0.5 },
  { name: 'Tailwind CSS', logo: '/src/assets/skill/tailwindcss-svgrepo-com.svg', category: 'Frontend', proficiency: 80, years: 1 },
];

const roadmap = [
  {
    year: '2022',
    title: 'Bac Pro Métiers de l\'Électricité et de ses Environnements Connectés (MELEC)',
    // Diplômé avec Mention Bien, puis réorientation en informatique et développement.
    icon: '🎓',
    details: 'Après mon Bac Pro Métiers de l\'Électricité et de ses Environnements Connectés, j\'ai découvert ma passion pour la programmation et le design, ce qui m\'a poussé à me réorienter vers l\'informatique.',
  },
  {
    year: '2023',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    // Début de mon BTS, avec un focus sur le développement web et les systèmes informatiques.
    icon: '💻',
    details: 'Je me suis concentré sur la conception web interactive et les principes d\'UI/UX.',
  },
  {
    year: '2024/2025',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    // Toujours en BTS, avec une formation dans divers langages de programmation et un intérêt marqué pour l'UI/UX.
    icon: '💻',
    details: 'Formation en développement web et systèmes, avec un focus particulier sur la conception d\'interfaces utilisateurs.',
  },
  {
    year: '2025/2026',
    title: 'Prévisions futures',
    // Prévoit de poursuivre en licence puis en école d'ingénieurs après son BTS SIO.
    icon: '🚀',
    details: 'Après mon BTS SIO, je prévois de continuer en licence pour approfondir mes compétences en informatique, puis intégrer une école d\'ingénieurs pour me spécialiser dans le développement et le design.',
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
  x: [-100, 100],
  transition: {
    repeat: Infinity,
    repeatType: "mirror",
    duration: 2,
    ease: "easeInOut"
  }
};

const CustomCursor = ({ isDarkMode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  const cursorRef = useRef(null);
  const cursorOuterRef = useRef(null);

  const springConfig = { damping: 25, stiffness: 120 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const cursorOuterX = useSpring(0, springConfig);
  const cursorOuterY = useSpring(0, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      cursorX.set(clientX - 5);
      cursorY.set(clientY - 5);
      cursorOuterX.set(clientX - 15);
      cursorOuterY.set(clientY - 15);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY, cursorOuterX, cursorOuterY]);

  return (
    <>
      <motion.div
        ref={cursorOuterRef}
        className={`fixed pointer-events-none w-8 h-8 rounded-full border ${isDarkMode ? 'border-gold/60' : 'border-gold/80'} z-50`}
        style={{
          x: cursorOuterX,
          y: cursorOuterY,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", damping: 15 }}
      />
      <motion.div
        ref={cursorRef}
        className={`fixed pointer-events-none w-3 h-3 rounded-full ${isDarkMode ? 'bg-gold/80' : 'bg-gold'} z-50`}
        style={{
          x: cursorX,
          y: cursorY,
          scale: isClicking ? 1.2 : 1,
        }}
        transition={{ type: "spring", damping: 15 }}
      />
    </>
  );
};

const ScrollProgress = ({ scrollYProgress, isDarkMode }) => {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX,
        background: `linear-gradient(to right, ${isDarkMode ? 'rgba(234,179,8,0.7)' : 'rgba(234,179,8,0.8)'}, ${isDarkMode ? 'rgba(249,115,22,0.7)' : 'rgba(249,115,22,0.8)'})`
      }}
    />
  );
};

const EnhancedTooltip = ({ text, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({ opacity: 1, y: 0, scale: 1 });
    } else {
      controls.start({ opacity: 0, y: 10, scale: 0.95 });
    }
  }, [isHovered, controls]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <motion.div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap z-50"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={controls}
        transition={{ duration: 0.2 }}
      >
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
      </motion.div>
    </div>
  );
};

const CardHoverEffect = ({ children, className }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXVal = (y - centerY) / 10;
    const rotateYVal = (centerX - x) / 10;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setScale(1.05);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <motion.div
      className={`${className || ''} perspective-1000`}
      style={{
        rotateX,
        rotateY,
        scale,
        transition: "transform 0.3s ease"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

const AnimatedSectionTitle = ({ title, isDarkMode }) => {
  return (
    <motion.div
      className="flex items-center gap-3 mb-14 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-gold' : 'text-gray-900'} relative`}>
        {title}
        <motion.span
          className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-gold via-orange-500 to-gold"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </h3>

      <div className={`flex-grow h-1 bg-gradient-to-r ${isDarkMode ? 'from-gold/50 via-gold/30 to-transparent' : 'from-gold/50 via-gold/30 to-transparent'} relative overflow-hidden`}>
        <motion.div
          className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          animate={shimmerAnimation}
        />
      </div>

      <motion.div
        className={`w-4 h-4 rounded-full ${isDarkMode ? 'bg-gold' : 'bg-gold'}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default function About({ isDarkMode, onOpenContact }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.7, 1, 1, 0.9]);

  const parallaxEffect1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxEffect2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const parallaxEffect3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const parallaxEffect4 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const [activeCategory, setActiveCategory] = useState('Tout');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const categories = ['Tout', ...Array.from(new Set(skills.map(skill => skill.category)))];
  const filteredSkills = activeCategory === 'Tout'
    ? skills
    : skills.filter(skill => skill.category && skill.category.toLowerCase() === activeCategory.toLowerCase());

  const [visibleSection, setVisibleSection] = useState('');
  const aboutHeaderRef = useRef(null);
  const timelineRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY + window.innerHeight * 0.6;

      const sections = [
        { ref: aboutHeaderRef, id: 'about-header' },
        { ref: timelineRef, id: 'timeline' },
        { ref: skillsRef, id: 'skills' },
        { ref: contactRef, id: 'contact-cta' }
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const element = section.ref.current;
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;

          if (position >= top && position <= bottom) {
            setVisibleSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lightModeClasses = {
    sectionBg: 'bg-white/70 backdrop-blur-md',
    heading: 'text-gray-800',
    paragraph: 'text-gray-700',
    secondaryText: 'text-gray-600',
    accent: 'text-gold',
    cardBg: 'bg-white shadow-lg hover:shadow-xl',
    badge: 'bg-gray-100 text-gray-800',
    activeBadge: 'bg-gradient-to-r from-gold to-orange-500 text-white',
    buttonBg: 'bg-white hover:bg-gray-50',
    timeline: 'bg-white border border-gray-200',
    divider: 'bg-gradient-to-r from-gold/50 via-gold/30 to-transparent',
  };

  const darkModeClasses = {
    sectionBg: 'bg-accent/50 backdrop-blur-lg',
    heading: 'text-gold',
    paragraph: 'text-gray-300',
    secondaryText: 'text-gray-400',
    accent: 'text-gold',
    cardBg: 'bg-accent shadow-xl hover:shadow-2xl',
    badge: 'bg-accent text-foreground',
    activeBadge: 'bg-gradient-to-r from-gold to-orange-500 text-background',
    buttonBg: 'bg-accent hover:bg-accent/80',
    timeline: 'bg-accent/70 border border-gold/10',
    divider: 'bg-gradient-to-r from-gold/50 to-transparent',
  };

  const themeClasses = isDarkMode ? darkModeClasses : lightModeClasses;

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="w-full max-w-7xl mx-auto py-12 md:py-16 px-6 md:px-12 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden"
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringContainer(true)}
      onMouseLeave={() => setIsHoveringContainer(false)}
    >
      {/* Mouse follower effect */}
      {isHoveringContainer && (
        <motion.div
          className={`absolute w-12 h-12 rounded-full ${isDarkMode ? 'bg-gold/20' : 'bg-gold/10'} blur-md -z-10`}
          style={{ left: mousePosition.x - 24, top: mousePosition.y - 24 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Custom cursor */}
      <CustomCursor isDarkMode={isDarkMode} />

      {/* Scroll progress indicator */}
      <ScrollProgress scrollYProgress={scrollYProgress} isDarkMode={isDarkMode} />

      {/* Enhanced background elements with sophisticated animations */}
      <motion.div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full ${isDarkMode ? 'bg-gold/8' : 'bg-gold/5'} blur-3xl -z-10`}
        style={{
          y: parallaxEffect1,
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.2])
        }}
      />

      <motion.div
        className={`absolute bottom-40 left-10 w-80 h-80 rounded-full ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-500/3'} blur-3xl -z-10`}
        style={{
          y: parallaxEffect2,
          x: useTransform(scrollYProgress, [0, 1], [0, 50]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.7, 0.3])
        }}
      />

      <motion.div
        className={`absolute top-1/3 left-1/3 w-40 h-40 rounded-md rotate-45 ${isDarkMode ? 'bg-gold/5' : 'bg-gold/7'} blur-xl -z-10`}
        style={{
          x: useTransform(scrollYProgress, [0, 1], [-50, 50]),
          rotate: parallaxRotate,
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.8, 0.7])
        }}
      />

      <motion.div
        className={`absolute top-1/2 right-1/4 w-24 h-24 rounded-full ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-500/7'} blur-lg -z-10`}
        style={{
          x: useTransform(scrollYProgress, [0, 1], [30, -30]),
          y: parallaxEffect3,
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.8, 0.6, 0.1])
        }}
      />

      <motion.div
        className={`absolute bottom-1/4 right-10 w-32 h-32 rounded-full ${isDarkMode ? 'bg-gold/5' : 'bg-gold/7'} blur-xl -z-10`}
        style={{
          y: useTransform(scrollYProgress, [0, 1], [50, -50]),
          x: useTransform(scrollYProgress, [0, 1], [-20, 20]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.5, 0.1])
        }}
        animate={floatingAnimation}
      />

      <motion.div
        className={`absolute top-1/3 right-1/3 w-16 h-16 rounded-md rotate-12 ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-500/7'} blur-lg -z-10`}
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [12, -24]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 0.8])
        }}
        animate={pulseAnimation}
      />

      <motion.div
        style={{ opacity: contentOpacity }}>
          <motion.div
            ref={aboutHeaderRef}
            className="mb-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`text-4xl md:text-5xl font-extrabold text-left mb-12 ${themeClasses.heading} tracking-tight`}
            >
              <span className="inline-block relative">
                À propos de moi
                <motion.span
                  className="absolute -bottom-3 left-0 h-2 bg-gradient-to-r from-gold via-orange-500 to-gold"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
              </span>
            </motion.h2>

            <motion.div
              className="grid md:grid-cols-5 gap-12 items-center"
            >
              <motion.div
                className="md:col-span-3"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <p className={`text-xl md:text-2xl leading-relaxed text-left max-w-3xl mb-8 ${themeClasses.paragraph}`}>
                  Je suis un <motion.span
                    className="text-gold font-bold inline-block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >designer</motion.span> et <motion.span
                    className="text-gold font-bold inline-block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >développeur</motion.span> encore en études, passionné par la création d'expériences digitales modernes, minimalistes et animées, alliant design épuré et interactions fluides.
                </p>

                <motion.p
                  className={`text-base md:text-lg leading-relaxed text-left max-w-3xl mb-10 ${themeClasses.secondaryText}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Mon approche combine esthétique minimaliste et fonctionnalité intuitive pour créer des interfaces utilisateur mémorables et performantes qui s'adaptent aux besoins des utilisateurs.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 mt-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  variants={containerVariants}
                >
                  {/* qualities.map((quality, i) => (
                    <motion.div
                      key={quality.name}
                      className="relative group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
                    >
                      <motion.span
                        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-gold to-orange-500 text-white text-xl md:text-2xl font-bold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {quality.icon}
                      </motion.span>
                      <motion.span
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {quality.name}
                      </motion.span>
                    </motion.div>
                  )) */}
                </motion.div>
              </motion.div>

              <motion.div
                className="md:col-span-2 relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <div className="relative w-full h-full">
                  <img
                    src="/src/assets/profile-pic.png"
                    alt="Profile Picture"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            ref={timelineRef}
            className="mb-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <AnimatedSectionTitle title="Parcours" isDarkMode={isDarkMode} />
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              variants={containerVariants}
            >
              {roadmap.map((event, index) => (
                <motion.div
                  key={event.year}
                  className="mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                >
                  <TimelineEvent item={event} idx={index} isDarkMode={isDarkMode} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            ref={skillsRef}
            className="mb-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <AnimatedSectionTitle title="Compétences" isDarkMode={isDarkMode} />
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              variants={containerVariants}
            >
              {categories.map((category) => (
                <motion.span
                  key={category}
                  className={`px-4 py-2 rounded-full cursor-pointer ${themeClasses.badge} ${
                    activeCategory === category ? themeClasses.activeBadge : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {category}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              variants={containerVariants}
            >
              {filteredSkills.map((skill) => (
                <CardHoverEffect key={skill.name} className="w-full">
                  <SkillCard skill={skill} isDarkMode={isDarkMode} />
                </CardHoverEffect>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            ref={contactRef}
            className="text-center py-16 px-6 md:px-12 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            {/* Background effects */}
            <motion.div
              className={`absolute inset-0 w-full opacity-20 -z-10 ${
                isDarkMode ? 'bg-subtle/40' : 'bg-gold/5'
              } rounded-2xl`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gold/20 -z-10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Content */}
            <motion.div
              className="max-w-2xl mx-auto"
              variants={itemVariants}
            >
              <motion.h3
                className={`text-3xl md:text-4xl font-bold mb-5 ${themeClasses.heading}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Intéressé par mon travail ?
              </motion.h3>
              
              <motion.p
                className={`text-base md:text-lg mb-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                N'hésitez pas à me contacter pour discuter de vos projets ou pour toute information complémentaire.
              </motion.p>
              
              <ContactButton onClick={onOpenContact} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
  );
}
