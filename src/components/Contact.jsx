import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    subject: '' // Added subject field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  // Reset errors when input changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const updatedErrors = { ...errors };
      if (formState.name && updatedErrors.name) delete updatedErrors.name;
      if (formState.email && updatedErrors.email) delete updatedErrors.email;
      if (formState.message && updatedErrors.message) delete updatedErrors.message;
      setErrors(updatedErrors);
    }
  }, [formState, errors]);

  // Scroll to success message when shown
  useEffect(() => {
    if (sent && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [sent]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  }

  function handleFocus(field) {
    setFocused(field);
  }

  function handleBlur() {
    setFocused(null);
  }

  function validateForm() {
    const newErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      // Shake form if validation fails
      formRef.current.classList.add('shake');
      setTimeout(() => {
        formRef.current.classList.remove('shake');
      }, 500);
      return;
    }

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSent(true);

      // Reset form after successful submission
      setFormState({
        name: '',
        email: '',
        message: '',
        subject: ''
      });

      // Reset success message after delay
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const buttonVariants = {
    initial: { scale: 1, backgroundColor: 'transparent' },
    hover: {
      scale: 1.05,
      backgroundColor: '#eab308',
      color: '#000',
      boxShadow: '0 10px 20px rgba(234, 179, 8, 0.2)'
    },
    tap: { scale: 0.95 },
    loading: {
      scale: 1,
      backgroundColor: '#eab308',
      color: '#000',
      transition: {
        duration: 0.3
      }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section id="contact" className="w-full max-w-3xl mx-auto py-16 md:py-24 px-6 md:px-12 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-xl border border-neutral-200 dark:border-gold/30 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="relative z-10"
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          variants={itemVariants}
        >
          <div className="hidden md:block w-12 h-1 bg-gold rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Contactez-nous
          </h2>
          <div className="hidden md:block w-12 h-1 bg-gold rounded-full"></div>
        </motion.div>

        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-10 text-center max-w-lg mx-auto"
          variants={itemVariants}
        >
          Vous avez des questions ou souhaitez collaborer ? Envoyez-nous un message et nous vous répondrons dans les 24 heures.
        </motion.p>

        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Contact Info Column */}
          <motion.div
            className="md:col-span-2 flex flex-col gap-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-1 bg-gold rounded-full"></span>
                Informations de contact
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
              N'hésitez pas à nous contacter par l'un de ces canaux. Nous sommes toujours là pour vous aider !
              </p>
            </motion.div>

            <motion.div className="space-y-6">
              <motion.a
                href="mailto:hello@example.com"
                variants={itemVariants}
                whileHover={{ scale: 1.03, x: 5 }}
                className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-gold dark:hover:text-gold transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gold/80 dark:group-hover:text-gold/80">ousseyne01@gmail.com</div>
                </div>
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-3">Suivez-nous</h4>
              <div className="flex gap-3">
                {['twitter', 'instagram', 'linkedin'].map((social, index) => (
                  <motion.a
                    key={social}
                    href={`https://${social}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.5 + (index * 0.1) }
                    }}
                    className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-colors"
                    aria-label={`Follow us on ${social}`}
                  >
                    {social === 'twitter' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                      </svg>
                    )}
                    {social === 'instagram' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                      </svg>
                    )}
                    {social === 'linkedin' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Form Column */}
          <motion.div className="md:col-span-3" variants={containerVariants}>
            <motion.form
              ref={formRef}
              variants={itemVariants}
              className="flex flex-col gap-4 relative p-6 bg-white/50 dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700 backdrop-blur-sm"
              onSubmit={handleSubmit}
              autoComplete="off"
              aria-label="Contact form"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold/5 rounded-xl pointer-events-none"></div>

              {/* Name input */}
              <motion.div
                className="relative group"
                variants={itemVariants}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className={`peer bg-transparent rounded-lg px-5 pt-6 pb-2 w-full
                            text-gray-800 dark:text-gray-200 placeholder-transparent outline-none
                            transition-all duration-300 border-2
                            ${errors.name ? 'border-red-500 dark:border-red-500' : focused === 'name' ? 'border-gold ring-2 ring-gold/30' : 'border-gray-300 dark:border-gray-600'}
                              focus:border-gold focus:ring-2 focus:ring-gold/30 dark:focus:border-gold`}
                    placeholder="Votre Nom"
                  aria-labelledby="name-label"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                <label
                  id="name-label"
                  htmlFor="name"
                  className={`absolute left-5 top-4 text-sm transition-all pointer-events-none
                            ${formState.name || focused === 'name' ? 'text-xs top-1.5 text-gold' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  Votre Nom
                </label>
                <AnimatePresence>
                  {errors.name && (
                    <motion.span
                      id="name-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1 absolute left-2 bottom-0 transform translate-y-full"
                    >
                      {errors.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {focused === 'name' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email input */}
              <motion.div
                className="relative group"
                variants={itemVariants}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className={`peer bg-transparent rounded-lg px-5 pt-6 pb-2 w-full
                            text-gray-800 dark:text-gray-200 placeholder-transparent outline-none
                            transition-all duration-300 border-2
                            ${errors.email ? 'border-red-500 dark:border-red-500' : focused === 'email' ? 'border-gold ring-2 ring-gold/30' : 'border-gray-300 dark:border-gray-600'}
                            focus:border-gold focus:ring-2 focus:ring-gold/30 dark:focus:border-gold`}
                  placeholder="Votre Email"
                  aria-labelledby="email-label"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <label
                  id="email-label"
                  htmlFor="email"
                  className={`absolute left-5 top-4 text-sm transition-all pointer-events-none
                            ${formState.email || focused === 'email' ? 'text-xs top-1.5 text-gold' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  Votre e-mail
                </label>
                <AnimatePresence>
                  {errors.email && (
                    <motion.span
                      id="email-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1 absolute left-2 bottom-0 transform translate-y-full"
                    >
                      {errors.email}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {focused === 'email' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Subject input (new field) */}
              <motion.div
                className="relative group"
                variants={itemVariants}
              >
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formState.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus('subject')}
                  onBlur={handleBlur}
                  className={`peer bg-transparent rounded-lg px-5 pt-6 pb-2 w-full
                            text-gray-800 dark:text-gray-200 placeholder-transparent outline-none
                            transition-all duration-300 border-2
                            ${focused === 'subject' ? 'border-gold ring-2 ring-gold/30' : 'border-gray-300 dark:border-gray-600'}
                            focus:border-gold focus:ring-2 focus:ring-gold/30 dark:focus:border-gold`}
                  placeholder="Objet (facultatif)"
                  aria-labelledby="subject-label"
                />
                <label
                  id="subject-label"
                  htmlFor="subject"
                  className={`absolute left-5 top-4 text-sm transition-all pointer-events-none
                            ${formState.subject || focused === 'subject' ? 'text-xs top-1.5 text-gold' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  Objet (facultatif)
                </label>
                <AnimatePresence>
                  {focused === 'subject' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Message input */}
              <motion.div
                className="relative group"
                variants={itemVariants}
              >
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formState.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={handleBlur}
                  className={`peer bg-transparent rounded-lg px-5 pt-6 pb-2 w-full h-32
                            text-gray-800 dark:text-gray-200 placeholder-transparent outline-none
                            transition-all duration-300 border-2
                            ${errors.message ? 'border-red-500 dark:border-red-500' : focused === 'message' ? 'border-gold ring-2 ring-gold/30' : 'border-gray-300 dark:border-gray-600'}
                            focus:border-gold focus:ring-2 focus:ring-gold/30 dark:focus:border-gold`}
                  placeholder="Votre message"
                  aria-labelledby="message-label"
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                <label
                  id="message-label"
                  htmlFor="message"
                  className={`absolute left-5 top-4 text-sm transition-all pointer-events-none
                            ${formState.message || focused === 'message' ? 'text-xs top-1.5 text-gold' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  Votre message
                </label>
                <AnimatePresence>
                  {errors.message && (
                    <motion.span
                      id="message-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1 absolute left-2 bottom-0 transform translate-y-full"
                    >
                      {errors.message}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {focused === 'message' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 1115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.4-1.005.9l-3.5 7A2 2 0 007 10h4.764a2 2 0 011.789-2.894L14 7h4m0 6h4m0-2h-4m2 4h-4m0 4h4m-6 2h4m6-10h-4" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={loading ? 'loading' : 'initial'}
                className="w-full py-3 rounded-lg bg-gold text-black font-semibold transition-colors duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Envoyer le message</span>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {sent && (
            <motion.div
              ref={successRef}
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Your message has been sent successfully!</p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-green-400 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
