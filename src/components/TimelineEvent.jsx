import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TimelineEvent({ item, idx }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: idx * 0.2 }}
      className={`relative flex ${idx % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start'} w-full min-h-[180px] py-8`}
    >
      {/* Cercle sur la ligne */}
      <motion.div
  className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 
             bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center 
             z-10 border-4 border-white dark:border-neutral-700 cursor-pointer"
  initial={{ scale: 0 }}
  whileInView={{ scale: 1 }}
  whileHover={{
    scale: 1.4,            // agrandissement léger
    rotate: [0, 5, -5, 0], // léger "shake" magnétique
    boxShadow: "0 0 20px rgba(234, 179, 8, 0.7)"
  }}
  viewport={{ once: true }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
  tabIndex={0}
  aria-label="Expand timeline event"
  onClick={() => setIsExpanded(!isExpanded)}
  onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click();
  }}
>
  <span className="text-lg">{item.icon}</span>
</motion.div>

      {/* Carte de l'événement */}
      <motion.div
        className={`rounded-xl px-8 py-6 shadow-xl border border-neutral-200 dark:border-gold/30 text-left
                   ${idx % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} mx-auto md:mx-0
                   relative md:w-[350px] cursor-pointer bg-neutral-50 dark:bg-neutral-800 
                   text-neutral-800 dark:text-neutral-300 transition-colors transition-shadow duration-300`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{
          boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.2)",
          y: -5,
        }}
        layout
      >
        {/* Badge Année */}
        <div className="absolute -top-3 left-4 bg-gold px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-gray-100">
          {item.year}
        </div>

        <div className="mt-3">
          <div className="text-gold dark:text-yellow-400 font-semibold text-xl mb-2">{item.title}</div>
          <p className="text-neutral-800 dark:text-neutral-300 text-base">{item.desc}</p>

          {/* Détails extensibles */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gold/20"
              >
                <p className="text-neutral-700 dark:text-neutral-400 mb-3">{item.details}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicateur pour cliquer */}
          <motion.div
            className="mt-3 text-gold dark:text-yellow-400 flex items-center gap-1 text-sm"
            animate={{ y: isExpanded ? 0 : 5, opacity: isExpanded ? 0 : 1 }}
          >
            {!isExpanded && (
              <>
                Cliquez pour plus de détails
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TimelineEvent;
