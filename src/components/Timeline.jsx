import React from 'react';
import { motion } from 'framer-motion';
import TimelineEvent from './TimelineEvent';

const timelineData = [
  { year: '2020', title: 'Started Journey', desc: 'Began exploring web development.', details: 'Learned HTML, CSS, JavaScript.', icon: '🚀' },
  { year: '2021', title: 'First Project', desc: 'Built my first website.', details: 'A portfolio website made with React.', icon: '🌟' },
  { year: '2022', title: 'Freelancing', desc: 'Started working with clients.', details: 'Completed 10+ freelance projects.', icon: '💼' },
  { year: '2023', title: 'BTS SIO', desc: 'Started formal education.', details: 'Learning programming and network basics.', icon: '🎓' },
];

function Timeline() {
  return (
    <div className="relative w-full py-12 transition-colors duration-500 ease-in-out">
      {/* Ligne verticale animée */}
      <motion.div
  initial={{ height: 0, backgroundColor: '#facc15' }} // gold clair
  whileInView={{ height: '100%', backgroundColor: '#eab308' }} // gold plus foncé
  transition={{ duration: 1.2, ease: 'easeInOut' }}
  viewport={{ once: true }}
  className="absolute left-1/2 top-0 w-[2px] transform -translate-x-1/2 origin-top"
>
</motion.div>

      {/* Les événements */}
      <div className="flex flex-col gap-16">
        {timelineData.map((item, idx) => (
          <TimelineEvent key={item.year} item={item} idx={idx} />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
