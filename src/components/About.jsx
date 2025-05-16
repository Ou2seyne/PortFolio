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
    year: '2024/2025',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    icon: '💻',
    details: 'Formation en développement web et systèmes, avec un focus particulier sur la conception d\'interfaces utilisateurs.',
  },
  {
    year: '2025/2026',
    title: 'Prévisions futures',
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
    sectionBg: 'bg-black', // pure black, no blur, no accent
    heading: 'text-gold',
    paragraph: 'text-gray-300',
    secondaryText: 'text-gray-400',
    accent: 'text-gold',
    cardBg: 'bg-zinc-900 shadow-xl hover:shadow-2xl',
    badge: 'bg-zinc-900 text-foreground',
    activeBadge: 'bg-gradient-to-r from-gold to-orange-500 text-background',
    buttonBg: 'bg-zinc-900 hover:bg-zinc-800',
    timeline: 'bg-black border border-gold/10',
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
      className={`w-full max-w-7xl mx-auto py-12 md:py-16 px-6 md:px-12 ${themeClasses.sectionBg} ${themeClasses.paragraph} transition-colors duration-300 relative overflow-hidden`}
      style={{ position: 'relative', border: 'none' }}
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
                </motion.div>
              </motion.div>

              <motion.div
                className="md:col-span-2 relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
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
                <SkillCard key={skill.name} skill={skill} isDarkMode={isDarkMode} />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            ref={contactRef}
            className="flex justify-center items-center min-h-[340px] py-16 px-6 md:px-12 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            {/* Glassy card container */}
            <motion.div
              className={`relative w-full max-w-5xl min-h-[320px] mx-auto shadow-2xl py-20 px-6 md:px-16 flex flex-col border border-gold rounded-2xl items-center justify-center overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-black/80 border border-gold/10' : 'bg-white/80 border border-gold/20 backdrop-blur-xl'}`}
whileHover={{
  scale: 1.03,
  boxShadow: '0 8px 40px 0 rgba(255, 193, 7, 0.25), 0 2px 8px 0 rgba(0,0,0,0.10)',
  borderColor: '#FFD700',
  filter: 'brightness(1.04)'
}}

              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0., ease: 'easeOut' }}
            >
              {/* Animated gold blob */}
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 bg-gold/30 -z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              {/* Animated underline blob */}
              <motion.div
                className="absolute left-1/2 bottom-0 -translate-x-1/2 w-40 h-8 rounded-full blur-2xl opacity-30 bg-orange-400/60 -z-10"
                animate={{
                  scaleX: [1, 1.1, 1],
                  opacity: [0.18, 0.28, 0.18]
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              />
              {/* Heading with gradient and icon */}
              <motion.h3
                className="text-4xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-gold via-orange-400 to-gold bg-clip-text text-transparent flex items-center gap-3 drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-gold animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Intéressé par mon travail&nbsp;?
              </motion.h3>

              {/* Subheading paragraph */}
              <motion.p
                className={`text-lg md:text-xl mb-10 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} leading-relaxed drop-shadow-sm`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                N'hésitez pas à me <span className="text-gold font-semibold">contacter</span> pour discuter de vos projets ou pour toute information complémentaire. Je me ferai un plaisir de vous répondre rapidement&nbsp;!
              </motion.p>

              {/* Enhanced contact button */}
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 220 }}
              >
                <ContactButton onOpenContact={onOpenContact} className="text-lg px-8 py-4 rounded-full shadow-xl bg-gradient-to-r from-gold to-orange-400 text-black font-bold border-none relative overflow-hidden hover:scale-105 focus:scale-105 transition-transform duration-300" />
                {/* Glow effect */}
                <span className="absolute inset-0 rounded-full pointer-events-none animate-pulse bg-gold/20 blur-xl opacity-60" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
  );
}
