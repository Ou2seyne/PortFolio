import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <section id="contact" className="w-full max-w-2xl mx-auto py-16 md:py-24 px-6 md:px-12 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-xl border border-neutral-200 dark:border-gold/30 transition-colors transition-shadow duration-300">
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100"
      >
        Contact
      </motion.h2>
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col gap-6 relative"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {/* Floating labels for inputs */}
        <div className="relative">
          <input id="name" name="name" type="text" required className="peer bg-accent rounded px-4 pt-6 pb-2 w-full text-foreground placeholder-transparent outline-none focus:ring-2 focus:ring-primary border border-subtle" placeholder="Your Name" />
          <label htmlFor="name" className="absolute left-4 top-3 text-secondary text-sm transition-all peer-focus:text-primary peer-focus:top-1 peer-valid:top-1 peer-valid:text-primary pointer-events-none">Your Name</label>
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" required className="peer bg-accent rounded px-4 pt-6 pb-2 w-full text-foreground placeholder-transparent outline-none focus:ring-2 focus:ring-primary border border-subtle" placeholder="Your Email" />
          <label htmlFor="email" className="absolute left-4 top-3 text-secondary text-sm transition-all peer-focus:text-primary peer-focus:top-1 peer-valid:top-1 peer-valid:text-primary pointer-events-none">Your Email</label>
        </div>
        <div className="relative">
          <textarea id="message" name="message" rows={4} required className="peer bg-accent rounded px-4 pt-6 pb-2 w-full text-foreground placeholder-transparent outline-none focus:ring-2 focus:ring-primary border border-subtle resize-none" placeholder="Your Message" />
          <label htmlFor="message" className="absolute left-4 top-3 text-secondary text-sm transition-all peer-focus:text-primary peer-focus:top-1 peer-valid:top-1 peer-valid:text-primary pointer-events-none">Your Message</label>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.06, backgroundColor: '#6366f1', color: '#fff', borderColor: '#6366f1' }}
          whileTap={{ scale: 0.97 }}
          className="mt-2 px-6 py-3 rounded-full border border-primary text-primary font-semibold bg-background shadow hover:bg-primary hover:text-background transition-all duration-300 relative overflow-visible"
          id="send-btn"
        >
          Send Message
        </motion.button>
        {/* Emoji burst animation on send */}
        {sent && (
          <span
            aria-hidden="true"
            style={{ pointerEvents: 'none', position: 'absolute', left: '50%', top: 'calc(100% - 18px)', transform: 'translateX(-50%)', zIndex: 10 }}
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const emoji = ["✉️","💌","❤️"][i%3];
              const angle = (i / 8) * 2 * Math.PI;
              const x = Math.cos(angle) * 38;
              const y = Math.sin(angle) * 32 - 10;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
                  animate={{ opacity: 1, x, y, scale: 1.3 }}
                  exit={{ opacity: 0, x, y: y-12, scale: 0.7 }}
                  transition={{ duration: 0.7, delay: i * 0.03 }}
                  style={{ position: 'absolute', fontSize: '1.3rem', left: 0, top: 0 }}
                >
                  {emoji}
                </motion.span>
              );
            })}
          </span>
        )}
        {/* Animated feedback */}
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-primary text-background px-6 py-3 rounded-full shadow-lg font-semibold"
            >
              Message sent! 🚀
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </section>
  );
}
