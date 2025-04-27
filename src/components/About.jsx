import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import SkillCard from './SkillCard';
import TimelineEvent from './TimelineEvent';

const skills = [
  { name: 'HTML', logo: '/src/assets/skill/html-5-svgrepo-com.svg', category: 'Frontend', proficiency: 100, years: 2 },
  { name: 'CSS', logo: '/src/assets/skill/css-3-svgrepo-com.svg', category: 'Frontend', proficiency: 90, years: 2 },
  { name: 'JavaScript', logo: '/src/assets/skill/js-official-svgrepo-com.svg', category: 'Frontend', proficiency: 85, years: 1.5 },
  { name: 'Symfony', logo: '/src/assets/skill/symfony-svgrepo-com.svg', category: 'Backend', proficiency: 97, years: 2 },
  { name: 'Vue.js', logo: '/src/assets/skill/vue-9-logo-svgrepo-com.svg', category: 'Frontend', proficiency: 75, years: 1 },
  { name: 'Flutter', logo: '/src/assets/skill/flutter-svgrepo-com.svg', category: 'Mobile', proficiency: 82, years: 1.5 },
  { name: 'React', logo: '/src/assets/skill/react-svgrepo-com.svg', category: 'Frontend', proficiency: 65, years: 0.6 },
  { name: 'SQL', logo: '/src/assets/skill/sql-file-format-symbol-svgrepo-com.svg', category: 'Backend', proficiency: 90, years: 2 },
];

const roadmap = [
  {
    year: '2022',
    title: 'Bac Pro Métiers de l\'Électricité et de ses Environnements Connectés (MELEC)',
    desc: 'Diplômé avec Mention Bien, puis réorientation en informatique et développement.',
    icon: '🎓',
    details: 'Après mon Bac Pro Métiers de l\'Électricité et de ses Environnements Connectés, j\'ai découvert ma passion pour la programmation et le design, ce qui m\'a poussé à me réorienter vers l\'informatique.',
  },
  {
    year: '2023',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    desc: 'Début de mon BTS, avec un focus sur le développement web et les systèmes informatiques.',
    icon: '💻',
    details: 'Je me suis concentré sur la conception web interactive et les principes d\'UI/UX.',
  },
  {
    year: '2024/2025',
    title: 'BTS Services Informatiques aux Organisations (SIO)',
    desc: 'Toujours en BTS, avec une formation dans divers langages de programmation et un intérêt marqué pour l\'UI/UX.',
    icon: '💻',
    details: 'Formation en développement web et systèmes, avec un focus particulier sur la conception d\'interfaces utilisateurs.',
  },
  {
    year: '2025/2026',
    title: 'Prévisions futures',
    desc: 'Prévoit de poursuivre en licence puis en école d\'ingénieurs après son BTS SIO.',
    icon: '🎓',
    details: 'Après mon BTS SIO, je prévois de continuer en licence pour approfondir mes compétences en informatique, puis intégrer une école d\'ingénieurs pour me spécialiser dans le développement et le design.',
  },
];

const qualities = [
  { name: 'Créatif', icon: '✨' },
  { name: 'Souci du détail', icon: '🔍' },
  { name: 'Résolution de problèmes', icon: '🧩' },
];


const interests = [
  { name: 'UI/UX Design', icon: '🎨', color: 'from-pink-500 to-purple-500' },
  { name: 'Web Animation', icon: '✨', color: 'from-blue-500 to-cyan-500' },
  { name: 'Mobile Development', icon: '📱', color: 'from-green-500 to-emerald-500' },
  { name: 'Minimalist Design', icon: '◻️', color: 'from-amber-500 to-yellow-500' },
];

export default function About({ isDarkMode }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.6, 1, 1, 0.8]);

  const [activeCategory, setActiveCategory] = useState('Tout');
  const categories = ['Tout', ...Array.from(new Set(skills.map(skill => skill.category)))];
  const filteredSkills = activeCategory === 'Tout'
    ? skills
    : skills.filter(skill => skill.category && skill.category.toLowerCase() === activeCategory.toLowerCase());

  // Scroll reveal sections
  const [visibleSection, setVisibleSection] = useState('');
  const aboutHeaderRef = useRef(null);
  const timelineRef = useRef(null);
  const skillsRef = useRef(null);
  const interestsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY + window.innerHeight * 0.6;
      
      const sections = [
        { ref: aboutHeaderRef, id: 'about-header' },
        { ref: timelineRef, id: 'timeline' },
        { ref: skillsRef, id: 'skills' },
        { ref: interestsRef, id: 'interests' },
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

  // Light mode specific classes and styles
  const lightModeClasses = {
    sectionBg: 'bg-white/70',
    heading: 'text-gray-800',
    paragraph: 'text-gray-700',
    secondaryText: 'text-gray-600',
    accent: 'text-gold',
    cardBg: 'bg-white shadow-md',
    badge: 'bg-gray-100 text-gray-800',
    activeBadge: 'bg-gradient-to-r from-gold to-orange text-white',
    buttonBg: 'bg-white hover:bg-gray-50',
    timeline: 'bg-white border border-gray-200',
    divider: 'bg-gradient-to-r from-gold/40 via-gold/20 to-transparent',
  };
  
  // Dark mode specific classes and styles
  const darkModeClasses = {
    sectionBg: 'bg-accent/30',
    heading: 'text-gold',
    paragraph: 'text-gray-300',
    secondaryText: 'text-gray-400',
    accent: 'text-gold',
    cardBg: 'bg-accent shadow-lg',
    badge: 'bg-accent text-foreground',
    activeBadge: 'bg-gradient-to-r from-gold to-orange text-background',
    buttonBg: 'bg-accent hover:bg-accent/80',
    timeline: 'bg-accent/70 border border-gold/10',
    divider: 'bg-gradient-to-r from-gold/40 to-transparent',
  };
  
  const themeClasses = isDarkMode ? darkModeClasses : lightModeClasses;

  return (
    <section
      id="about"
      ref={containerRef}
      className="w-full max-w-7xl mx-auto py-20 md:py-28 px-6 md:px-12 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Enhanced background elements with more dynamic animation */}
      <motion.div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full ${isDarkMode ? 'bg-gold/5' : 'bg-gold/3'} blur-3xl -z-10`}
        style={{ 
          y: backgroundY,
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.9])
        }}
      />

      <motion.div
        className={`absolute bottom-40 left-10 w-80 h-80 rounded-full ${isDarkMode ? 'bg-orange/5' : 'bg-orange/3'} blur-3xl -z-10`}
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [100, -50]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 0.4])
        }}
      />

      <motion.div
        className={`absolute top-1/3 left-1/3 w-40 h-40 rounded-md rotate-45 ${isDarkMode ? 'bg-gold/3' : 'bg-gold/5'} blur-xl -z-10`}
        style={{
          x: useTransform(scrollYProgress, [0, 1], [-30, 30]),
          rotate: useTransform(scrollYProgress, [0, 1], [45, 90]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 0.8])
        }}
      />
      
      <motion.div
        className={`absolute top-1/2 right-1/4 w-24 h-24 rounded-full ${isDarkMode ? 'bg-orange/3' : 'bg-orange/5'} blur-lg -z-10`}
        style={{
          x: useTransform(scrollYProgress, [0, 1], [20, -20]),
          y: useTransform(scrollYProgress, [0, 1], [-20, 20]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 0.8, 0.8, 0.2])
        }}
      />

      {/* New floating elements */}
      <motion.div
        className={`absolute bottom-1/4 right-10 w-32 h-32 rounded-full ${isDarkMode ? 'bg-gold/3' : 'bg-gold/5'} blur-xl -z-10`}
        style={{
          y: useTransform(scrollYProgress, [0, 1], [30, -30]),
          x: useTransform(scrollYProgress, [0, 1], [-10, 10]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.5, 0.2])
        }}
      />

      <motion.div
        className={`absolute top-1/3 right-1/3 w-16 h-16 rounded-md rotate-12 ${isDarkMode ? 'bg-orange/4' : 'bg-orange/5'} blur-lg -z-10`}
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [12, -12]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.9])
        }}
      />

      <motion.div style={{ opacity: contentOpacity }}>
        <motion.div
          ref={aboutHeaderRef}
          className="mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`text-4xl md:text-5xl font-extrabold text-left mb-6 ${themeClasses.heading}`}
          >
            <span className="inline-block relative">
              A propos de moi
              <motion.span 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-gold via-orange to-gold"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </span>
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-5 gap-8 items-center"
          >
            <motion.div 
              className="md:col-span-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <p className={`text-xl md:text-2xl leading-relaxed text-left max-w-3xl mb-6 ${themeClasses.paragraph}`}>
                Je suis un <span className="text-gold font-medium">designer</span> et <span className="text-gold font-medium">développeur</span> encore en études, passionné par la création d'expériences digitales modernes, minimalistes et animées, alliant design épuré et interactions fluides.
              </p>
              
              <motion.p 
                className={`text-base md:text-lg leading-relaxed text-left max-w-3xl mb-8 ${themeClasses.secondaryText}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Mon approche combine esthétique minimaliste et fonctionnalité intuitive pour créer des interfaces utilisateur mémorables et performantes.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-3 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {qualities.map((quality, i) => (
                  <motion.div
                    key={quality.name}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  >
                    <motion.span
                      className={`relative px-4 py-2.5 rounded-full ${isDarkMode ? 'bg-accent' : 'bg-gray-100'} ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm font-medium border ${isDarkMode ? 'border-gold/20' : 'border-gold/30'} inline-flex items-center gap-2 cursor-pointer outline-none focus-visible:ring-2 ring-gold/50 transition-all duration-200`}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 0 15px 1.5px rgba(234,179,8,0.15)",
                        backgroundColor: isDarkMode ? "rgba(234,179,8,0.1)" : "rgba(234,179,8,0.1)"
                      }}
                      whileTap={{ scale: 0.96 }}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click();
                      }}
                    >
                      <span className="text-lg">{quality.icon}</span>
                      {quality.name}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:col-span-2 hidden md:block"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <motion.div 
                  className={`absolute inset-4 rounded-2xl ${isDarkMode ? 'bg-accent' : 'bg-white'} border ${isDarkMode ? 'border-gold/10' : 'border-gold/20'} shadow-lg overflow-hidden`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-6xl"
                      initial={{ rotateY: 0 }}
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      👨‍💻
                    </motion.span>
                  </div>
                  
                  {/* Decorative elements inside the box */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/30 to-orange/20"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold/30"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-orange/20"></div>
                </motion.div>
                
                <motion.div 
                  className={`absolute inset-0 rounded-2xl border-2 border-dashed ${isDarkMode ? 'border-gold/30' : 'border-gold/40'} -rotate-3`}
                  animate={{ 
                    rotate: [-3, 0, -3], 
                    borderColor: [
                      isDarkMode ? 'rgba(234,179,8,0.3)' : 'rgba(234,179,8,0.4)', 
                      isDarkMode ? 'rgba(234,179,8,0.5)' : 'rgba(234,179,8,0.6)', 
                      isDarkMode ? 'rgba(234,179,8,0.3)' : 'rgba(234,179,8,0.4)'
                    ] 
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div ref={timelineRef} className="relative mb-32">
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={`text-2xl font-bold ${themeClasses.heading}`}>
              Mon Aventure
            </h3>
            
            <div className={`flex-grow h-px ${themeClasses.divider}`}></div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 top-12 h-[calc(100%-6rem)] w-1 bg-gradient-to-b from-gold/30 via-gold to-orange/50 z-0"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {roadmap.map((item, idx) => (
            <TimelineEvent key={item.year} item={item} idx={idx} isDarkMode={isDarkMode} />
          ))}
        </div>

        <motion.div
          ref={skillsRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={`text-2xl font-bold ${themeClasses.heading}`}>
              Mes Compétences
            </h3>
            
            <div className={`flex-grow h-px ${themeClasses.divider}`}></div>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-gold to-orange text-white shadow-lg'
                    : `${isDarkMode ? 'bg-accent text-foreground' : 'bg-gray-100 text-gray-800'} hover:bg-opacity-80`
                } ${isDarkMode ? 'border border-gold/10' : 'border border-gold/20'}`}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: isDarkMode ? "0 5px 15px rgba(0,0,0,0.1)" : "0 5px 15px rgba(0,0,0,0.05)" 
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <AnimatePresence mode="wait">
              {filteredSkills.map((skill) => (
                <SkillCard key={`${skill.name}-${skill.category}`} skill={skill} isDarkMode={isDarkMode} />
              ))}
            </AnimatePresence>

            {filteredSkills.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-4 text-center py-10"
              >
                <p className={themeClasses.secondaryText}>
                  Aucune compétence trouvée dans cette catégorie.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* New Interests/Focus Areas Section */}
        <motion.div
          ref={interestsRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={`text-2xl font-bold ${themeClasses.heading}`}>
              Centres d'Intérêt
            </h3>
            
            <div className={`flex-grow h-px ${themeClasses.divider}`}></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                className={`rounded-xl p-0.5 overflow-hidden ${isDarkMode ? 'shadow-lg' : 'shadow-md'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={`relative bg-gradient-to-br ${interest.color} p-0.5 rounded-xl w-full h-full overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${interest.color} opacity-30 blur-sm`}></div>
                  <div className={`relative rounded-xl p-6 ${isDarkMode ? 'bg-accent/95' : 'bg-white/95'} h-full backdrop-blur-sm`}>
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{interest.icon}</span>
                      <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-foreground' : 'text-gray-800'}`}>{interest.name}</h4>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {interest.name === 'UI/UX Design' && "Je me passionne pour la création d'interfaces utilisateur intuitives et esthétiques, en plaçant l'expérience utilisateur au centre de mes démarches."}
                      {interest.name === 'Web Animation' && "J'aime donner vie aux interfaces web avec des animations fluides et significatives qui guident l'utilisateur et apportent une dimension interactive."}
                      {interest.name === 'Mobile Development' && "Le développement d'applications mobiles responsive et performantes m'intéresse particulièrement, avec un focus sur l'expérience utilisateur."}
                      {interest.name === 'Minimalist Design' && "J'adopte une approche minimaliste dans mes designs, privilégiant la clarté, la fonctionnalité et l'élégance à travers la simplicité."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={contactRef}
          className="relative pt-16 pb-8 px-6 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Enhanced Background gradient */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-accent/30' : 'bg-white/80'} rounded-2xl border ${isDarkMode ? 'border-gold/10' : 'border-gold/20'} backdrop-blur-sm z-0`}>
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-orange/5 opacity-50"></div>
          </div>
          
          {/* Enhanced Glowing effects */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-32 ${isDarkMode ? 'bg-gold/5' : 'bg-gold/10'} blur-3xl rounded-full`}></div>
          <div className={`absolute bottom-0 right-0 w-24 h-24 ${isDarkMode ? 'bg-orange/5' : 'bg-orange/10'} blur-2xl rounded-full`}></div>
          <div className={`absolute top-0 left-10 w-16 h-16 ${isDarkMode ? 'bg-gold/8' : 'bg-gold/10'} blur-xl rounded-full`}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.h3
              className={`text-2xl md:text-3xl font-bold mb-6 ${themeClasses.heading}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Prêt à démarrer un projet?
            </motion.h3>

            <motion.p 
              className={`text-center max-w-xl mb-8 ${themeClasses.secondaryText}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Je suis toujours ouvert à discuter de nouveaux projets, opportunités créatives ou possibilités de collaboration.            </motion.p>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="flex gap-4"
>
  <motion.a
    href="#contact"
    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-orange text-white font-medium shadow-lg shadow-gold/20 flex items-center gap-2 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
  >
    Me Contacter
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </motion.a>

</motion.div>
</div>
</motion.div>
</motion.div>
</section>
);
}