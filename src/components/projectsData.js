const allProjects = [
  {
    title: 'Portfolio Personnel',
    description: 'Un portfolio moderne et responsive développé avec React et Tailwind CSS pour présenter mes projets et compétences.',
    tag: 'Site Web',
    tools: ['React', 'Tailwind CSS', 'Framer Motion'],
    image: './src/assets/images/portfolio.png',
    link: 'https://monportfolio.dev',
    status: 'completed',
    date: '2025',
    dateRange: 'Janvier 2025 - Mars 2025',
    technicalAspects: [
      {
        title: "Architecture Frontend",
        description: "Utilisation de React fonctionnel avec hooks et context pour une gestion d'état optimisée.",
        icon: "Code2"
      },
      {
        title: "Animations",
        description: "Animations fluides avec Framer Motion pour une meilleure expérience utilisateur.",
        icon: "Zap"
      },
      {
        title: "Déploiement",
        description: "Hébergé sur Vercel avec intégration continue.",
        icon: "Cloud"
      }
    ]
  },
  {
    title: 'Lodan Market',
    description: 'Plateforme locale bio & durable pour annonces, horaires, contact et galerie, avec interface responsive et optimisée.',
    tag: 'Site Web',
    tools: ['Next.js', 'Tailwind CSS'],
    image: './src/assets/images/lodan-market.png',
    link: 'https://lodanmarket.fr',
    status: 'completed',
    date: '2024',
    dateRange: 'Février 2024 - Juin 2024',
    technicalAspects: [
      {
        title: "Frontend",
        description: "Site statique construit avec Next.js et Tailwind CSS, optimisé pour la rapidité et le SEO.",
        icon: "Code2"
      },
      {
        title: "Déploiement",
        description: "Déployé sur IONOS avec gestion du domaine et hébergement performant.",
        icon: "Cloud"
      },
      {
        title: "Contenu",
        description: "Gestion des contenus directement dans les fichiers statiques, sans base de données.",
        icon: "FileText"
      }
    ]
  },
  {
    title: 'Application de gestion de tâches',
    description: 'Application web en développement, bientôt disponible avec de nombreuses fonctionnalités.',
    tag: 'Application Web',
    tools: ['Coming Soon'],
    image: './src/assets/images/coming_soon.png',
    status: 'en cours',
    link: '#',
    date: '2025',
    dateRange: 'Mars 2025 - Présent',
    technicalAspects: []
  },
  {
    title: 'Plateforme E-Commerce',
    description: 'Projet e-commerce en cours de réalisation, restez à l’écoute pour plus d’informations.',
    tag: 'E-Commerce',
    tools: ['Coming Soon'],
    image: './src/assets/images/coming_soon.png',
    status: 'en cours',
    link: '#',
    date: '2025',
    dateRange: 'Avril 2025 - Présent',
    technicalAspects: []
  }
];

export default allProjects;
