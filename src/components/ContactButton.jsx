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
      transition={{ duration: 0.8, delay: 0.4 }}
      className="flex gap-6"
    >
      <motion.a
        href="#contact"
        onClick={handleClick}
        className={`px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-orange-500 text-white font-medium 
                  shadow-lg shadow-gold/30 flex items-center gap-2.5 hover:shadow-xl hover:shadow-gold/40 
                  transition-all duration-300 relative overflow-hidden group`}
        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(234,179,8,0.4)' }}
        whileTap={{ scale: 0.98 }}
        role="button"
        aria-label="Naviguer vers la section contact"
      >
        <motion.div
          className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-700"
          initial={{ x: '-100%', skewX: -15 }}
          whileHover={{ x: '100%', skewX: -15 }}
          transition={{ duration: 0.8 }}
        />
        <span className="relative z-10">Contacter-nous</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 relative z-10"
          viewBox="0 0 20 20"
          fill="currentColor"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </motion.svg>
        <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-gold to-[#D90429] opacity-0 group-hover:opacity-30 group-hover:animate-pulse blur-sm"></span>
      </motion.a>
    </motion.div>
  );
};

ContactButton.propTypes = {
  onOpenContact: PropTypes.func,
};

export default ContactButton;