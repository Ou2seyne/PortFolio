import React, { useState } from 'react';
import { motion } from 'framer-motion';


// Extracted TimelineEvent component with enhanced visuals
const TimelineEvent = ({ item, idx }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = idx % 2 === 0;

  return (
    <div className={`relative flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center`}>
      {/* Year bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
          <span className="text-xl font-bold text-white">{item.year}</span>
        </div>
      </motion.div>

      {/* Content card */}
      <motion.div 
        initial={{ 
          opacity: 0, 
          x: isEven ? -50 : 50,
          y: 20
        }}
        whileInView={{ 
          opacity: 1, 
          x: 0,
          y: 0 
        }}
        transition={{ 
          duration: 0.6, 
          delay: idx * 0.2,
          ease: "easeOut" 
        }}
        viewport={{ once: true, margin: "-100px" }}
        whileHover={{ y: -5 }}
        className={`w-5/12 ${isEven ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-amber-500`}
        >
          {/* Gradient overlay for top of card */}
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${item.color}`}></div>
          
          {/* Card content */}
          <div className="p-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{item.icon}</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.title}</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            
            {/* Expandable content */}
            <motion.div 
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.details}</p>
                <img 
                  src={item.image} 
                  alt={`Illustration for ${item.title}`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
            
            {/* Read more button */}
            <button 
              className="flex items-center gap-1 mt-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Read less" : "Read more"}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function Timeline() {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-20 px-6 sm:px-12 transition-colors duration-500 ease-in-out">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Timeline header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          My Journey
          <span className="relative whitespace-nowrap">
            <span className="relative"> Through Time</span>
            <span className="absolute bottom-1 left-0 w-full h-1 bg-amber-400"></span>
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Explore the key milestones of my learning path and professional development in web development and IT.
        </p>
      </motion.div>
      
      {/* Main timeline */}
      <div className="relative">
        {/* Animated vertical line */}
        <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 transform -translate-x-1/2 origin-top"
        ></motion.div>

        {/* Timeline events */}
        <div className="relative z-10 py-8 space-y-24">
          {timelineData.map((item, idx) => (
            <TimelineEvent key={item.year} item={item} idx={idx} />
          ))}
        </div>
        
        {/* Timeline end cap */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* Final call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          And this is just the beginning of my journey. The future holds many more exciting projects and learning experiences.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          View My Portfolio
        </button>
      </motion.div>
    </div>
  );
}

export default Timeline;