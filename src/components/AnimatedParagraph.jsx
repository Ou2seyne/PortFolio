import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AnimatedParagraph = ({ theme, colors }) => {
  const [ref, isInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Words to animate
  const words = [
    "Bienvenue", "sur", "mon", "portfolio", "—", "un", 
    "parfait", "mélange", "de", "sobriété,", "minimalisme,", 
    "et", "animation", "impressionnante."
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5,
        when: "beforeChildren"
      }
    }
  };
  
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0] // Custom cubic-bezier curve for smoother motion
      }
    }
  };
  
  // Start animation when in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      if (!hasAnimated) {
        setHasAnimated(true);
      }
    } else if (!hasAnimated) {
      controls.start("hidden");
    }
  }, [isInView, controls, hasAnimated]);
  
  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden"
    >
      <motion.p
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
        style={{ 
          color: colors.subtleText,
          transition: "color 0.5s ease"
        }}
        key={`subheading-${theme}`}
      >
        {words.map((word, i) => (
          <motion.span
            key={`word-${i}-${theme}`}
            variants={wordVariants}
            className="inline-block mr-1 relative"
          >
            {word}
            {/* Add subtle underline animation to key words */}
            {["Bienvenue", "portfolio", "minimalisme", "animation"].includes(word) && (
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-px bg-current opacity-50"
                initial={{ width: "0%" }}
                animate={isInView ? { width: "100%" } : { width: "0%" }}
                transition={{ 
                  delay: 2 + (i * 0.05),
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.span>
        ))}
      </motion.p>
      
      {/* Optional highlight accent */}
      <motion.div
        className="absolute -z-10 rounded-full blur-3xl opacity-10"
        style={{ 
          background: colors.accent,
          width: "40%",
          height: "120%",
          top: "-20%",
          left: "30%"
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.08 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default AnimatedParagraph;