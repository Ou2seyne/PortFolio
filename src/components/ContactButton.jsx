import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ContactButton = ({ onOpenContact }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onOpenContact) {
      onOpenContact();
      return;
    }
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const topOffset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        const firstInput = contactSection.querySelector('input[name="name"]');
        if (firstInput) firstInput.focus();
      }, 800);
    } else {
      navigate('/contact');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.button
        onClick={handleClick}
        className="relative group overflow-hidden px-8 py-4 rounded-lg bg-black dark:bg-white dark:text-black text-white font-medium 
                  border border-black/20 shadow-lg hover:shadow-black/30
                  transition-all duration-300 flex items-center gap-3"
        whileHover={{ 
          y: -4,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)'
        }}
        whileTap={{ y: 0, scale: 0.98 }}
        aria-label="Ouvrir le formulaire de contact"
      >
        {/* Subtle shine effect */}
        <motion.div
          className="absolute inset-0 w-40 h-full"
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatType: "loop", 
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />
        
        {/* Button text */}
        <span className="relative z-10 font-medium tracking-wide ">Me contacter</span>
        
        {/* Icon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 relative z-10"
          viewBox="0 0 20 20"
          fill="currentColor"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.button>
    </motion.div>
  );
};

ContactButton.propTypes = {
  onOpenContact: PropTypes.func,
};

export default ContactButton;