import React, { useState, useEffect } from 'react';
import ProjectsGallery from './ProjectsGallery';

export default function Projects() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode) {
      setIsDarkMode(savedMode === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="py-4 flex justify-end">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-full bg-gold text-background transition-all"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <ProjectsGallery isDarkMode={isDarkMode} />
    </div>
  );
}
