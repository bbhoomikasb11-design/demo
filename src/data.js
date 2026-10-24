export const links = {
  github: 'https://github.com/bbhoomikasb11-design',
  linkedin: 'https://linkedin.com/in/bhoomika-s-743758381',
  email: 'mailto:bbhoomikasb11@gmail.com',
  resume: 'https://drive.google.com/file/d/1cXGHubii1TikJa3mbEykhnhQNFQqdFHg/view?usp=sharing',
}

export const projects = [
  {
    id: 'campusmesh', name: 'CampusMesh', short: 'A little more connected. A lot more campus.',
    category: 'Student Marketplace', disciplines: ['Product Design', 'Full-Stack Development'], filters: ['Design', 'Full-stack'],
    description: 'A student-focused marketplace designed to make campus exchanges and student-to-student interactions easier.',
    contribution: 'Product design, frontend development, and backend development.',
    url: `${links.github}/CampusMesh`, linkLabel: 'View on GitHub', theme: 'campus',
  },
  {
    id: 'clearhead', name: 'ClearHead', short: 'A little room for a clearer mind.',
    category: 'AI-powered Application', disciplines: ['Full-Stack Development', 'AI Integration'], filters: ['Full-stack', 'AI'],
    description: 'A completed full-stack project that combines web development with AI integration.',
    detail: 'A space to untangle thoughts into a clearer perspective, using an AI-powered journaling experience.',
    url: `${links.github}/ClearHead`, linkLabel: 'View on GitHub', theme: 'clarity',
  },
  {
    id: 'adaptui', name: 'AdaptUI', short: 'The web, a little more your way.',
    category: 'Accessibility', disciplines: ['Browser Extension', 'Frontend Development'], filters: ['Design', 'Full-stack'],
    description: "An accessibility-focused browser extension project exploring ways to make web experiences more adaptable to users' needs.",
    url: `${links.github}/AdaptUI`, linkLabel: 'View on GitHub', theme: 'adapt',
  },
  {
    id: 'splitgrid', name: 'SplitGrid', short: 'Shared plans. Simpler expenses.',
    category: 'Real-Time Collaboration', disciplines: ['Full-Stack Development'], filters: ['Full-stack'],
    description: 'A real-time expense-sharing platform designed to simplify shared expenses and debt settlement. Features include shareable groups, debt minimization, and real-time updates.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.IO'],
    url: `${links.github}/Expenses`, linkLabel: 'View on GitHub', theme: 'split',
  },
  {
    id: 'safescan', name: 'SafeScan', short: 'Know what goes into your everyday.',
    category: 'Product Concept', disciplines: ['UI/UX Design', 'Figma', 'Product Design'], filters: ['Design'],
    description: 'A product concept focused on barcode scanning and presenting product ingredients in a clear, accessible interface.',
    url: 'https://www.figma.com/design/Gk104dZnM486TBImFXejHX/SafeScan?node-id=0-1&t=rx0YmH8sXkl08gQI-1', linkLabel: 'Explore in Figma', theme: 'scan',
  },
  {
    id: 'medimatch', name: 'MediMatch', short: 'Connecting care to the people who need it.',
    category: 'Healthcare Prototype', disciplines: ['Independent Project', 'Healthcare'], filters: ['Full-stack', 'Design'],
    description: 'An independently developed healthcare project exploring digital patient-to-care matching.',
    url: `${links.github}/Medimatch`, linkLabel: 'View on GitHub', theme: 'medi',
  },
  {
    id: 'smartstore', name: 'AI Smart Store Assistant', short: 'Good discoveries start with a conversation.',
    category: 'AI Product Discovery', disciplines: ['AI Integration', 'Backend Development', 'Cloud Deployment'], filters: ['AI', 'Full-stack'],
    description: 'An AI-powered product discovery experience designed to help users explore products and receive recommendations.',
    tech: ['Node.js', 'Express', 'HTML', 'CSS', 'JavaScript', 'Docker', 'Google Cloud Run'],
    url: 'https://ai-smart-store-423447867140.us-central1.run.app/', linkLabel: 'Open live demo', theme: 'store',
  },
]

export const skills = [
  {name: 'Design & Product', icon: 'design', items: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Auto Layout', 'Design Systems', 'Product Thinking']},
  {name: 'Frontend Development', icon: 'frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vite', 'Tailwind CSS']},
  {name: 'Backend Development', icon: 'backend', items: ['Node.js', 'Express.js', 'Python', 'REST APIs', 'API Integration', 'Authentication']},
  {name: 'Databases', icon: 'database', items: ['MongoDB', 'SQLite', 'ChromaDB']},
  {name: 'AI & Intelligent Applications', icon: 'ai', items: ['LLM APIs', 'RAG', 'Prompt Engineering', 'AI Integration']},
  {name: 'Tools & Deployment', icon: 'tools', items: ['Git', 'GitHub', 'Postman', 'Docker', 'Linux', 'Google Cloud Run', 'AWS Basics']},
]

export const experience = [
  {
    company: 'Jarurat Care Foundation', role: 'UI/UX Design Intern', mark: 'jc', color: 'sage',
    description: 'Worked on healthcare-focused digital experiences, including dashboards for nutritionists and psychologists, therapy-related screens, patient workflows, and administrative interfaces.',
    focus: ['UI/UX design', 'Figma', 'Auto Layout', 'Design systems', 'Responsive design', 'Incorporating feedback'],
    areas: [
      { title: 'Care dashboards', description: 'Healthcare-focused dashboards for nutritionists and psychologists.', tags: ['Nutritionists', 'Psychologists'] },
      { title: 'Patient & therapy workflows', description: 'Therapy-related screens, patient workflows, and administrative interfaces.', tags: ['Patient journeys', 'Therapy screens', 'Administration'] },
      { title: 'Systems & refinement', description: 'Figma, Auto Layout, design systems, and responsive design, incorporating feedback into interface improvements.', tags: ['Design systems', 'Responsive design', 'Feedback'] },
    ],
  },
  {
    company: 'Mini Web Solutions / WE3.BUILD', role: 'Product Design · Frontend Development · Digital Content', mark: 'w3', color: 'clay',
    description: 'Collaborate on digital product experiences, website development, branding, and technology-focused content.',
    focus: ['Product thinking', 'Interface design', 'Frontend implementation', 'Visual storytelling', 'Content creation'],
    areas: [
      { title: 'Product & interface design', description: 'Collaborating on digital product experiences through product thinking and interface design.', tags: ['Product thinking', 'Interface design'] },
      { title: 'Frontend development', description: 'Website development and frontend implementation, connecting design with working digital experiences.', tags: ['Websites', 'Frontend implementation'] },
      { title: 'Brand & digital content', description: 'Branding, visual storytelling, content creation, and technology-focused content.', tags: ['Branding', 'Visual storytelling', 'Technology content'] },
    ],
  },
]
