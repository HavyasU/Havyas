import type { Service, Work, Experience, Testimonial, Education } from "@/types";

export const seedServices: Omit<Service, "id">[] = [
  {
    title: "Website Design",
    description:
      "Visually captivating, high-performance responsive websites tailored to elevate your brand and maximize audience engagement.",
    iconName: "fa-code",
    order: 1,
    mockupType: "custom_image",
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
    deliverables: [
      "Custom Responsive Layouts",
      "Next.js & React Architecture",
      "SEO & Core Web Vitals Optimization",
      "Interactive Micro-Animations",
      "Content Management Ready",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Mobile & Web Apps",
    description:
      "Robust, scalable web applications and cross-platform mobile apps engineered with clean code and real-time capabilities.",
    iconName: "fa-mobile-screen",
    order: 2,
    mockupType: "custom_image",
    imageUrl:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
    deliverables: [
      "Cross-Platform Mobile Apps (iOS/Android)",
      "Single Page Web Applications",
      "Real-Time WebSocket Sync",
      "State Management & Offline Support",
      "Secure Authentication & Roles",
    ],
    technologies: ["React Native", "Node.js", "Express", "Redux Toolkit", "Socket.io"],
  },
  {
    title: "UI/UX & Branding",
    description:
      "Distinctive brand identities, wireframes, and design systems that create memorable impressions and intuitive user journeys.",
    iconName: "fa-pen-nib",
    order: 3,
    mockupType: "custom_image",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    deliverables: [
      "Wireframing & Interactive Prototyping",
      "Design System & Component Kits",
      "Logo & Visual Brand Identity",
      "Typography & Color Hierarchies",
      "User Research & Flow Optimization",
    ],
    technologies: ["Figma", "Adobe Suite", "Design Systems", "Prototyping", "Vector Art"],
  },
  {
    title: "Backend & APIs",
    description:
      "High-throughput server architectures, RESTful & GraphQL microservices, and database modeling built for scale.",
    iconName: "fa-server",
    order: 4,
    mockupType: "custom_image",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    deliverables: [
      "RESTful & WebSocket API Endpoints",
      "Database Schema Design & Query Tuning",
      "JWT & OAuth Security Implementation",
      "Third-Party Service Integrations",
      "Serverless & Microservice Deployments",
    ],
    technologies: ["Node.js", "Express.js", "Python / Flask", "MongoDB", "MySQL / Firebase"],
  },
  {
    title: "Maintenance & DevOps",
    description:
      "Continuous performance audits, cloud deployments, automated testing, and ongoing code maintenance to ensure 99.9% uptime.",
    iconName: "fa-gauge-high",
    order: 5,
    mockupType: "custom_image",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    deliverables: [
      "Lighthouse Performance Tuning (90+ Scores)",
      "Automated CI/CD Deployment Pipelines",
      "Security Audits & Vulnerability Patching",
      "Database Backups & Cloud Monitoring",
      "Legacy Code Refactoring & Bug Resolution",
    ],
    technologies: ["Vercel", "Git & GitHub", "Docker", "Cloudinary", "Postman"],
  },
];

export const seedWorks: Omit<Work, "id">[] = [
  {
    title: "Holistic Healer",
    description:
      "An elegant, earth-toned editorial landing page for a holistic therapy and wellness practice.",
    category: "UI Design",
    coverImageUrl: "/images/holistic_healer.png",
    client: "TheraStudio",
    specs: "Next.js, TailwindCSS, Framer Motion",
    tags: ["Branding", "Web Design", "Minimalism"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 1,
    caseStudy:
      "# Holistic Healer Case Study\n\n### The Goal\nDesign a calming, premium online home for holistic medicine practitioners.\n\n### Approach\nUsed soft earthy tones (olive, beige) combined with elegant serif typography and dynamic scroll-triggered layouts to invoke a sense of calm and professionalism.\n\n### Outcome\nA responsive, ultra-premium web design prototype.",
  },
  {
    title: "Wellness Retreat",
    description:
      "A high-end editorial website layout designed for luxury wellness retreats and nature spas.",
    category: "UI Design",
    coverImageUrl: "/images/wellness_retreat.png",
    client: "Aura Spas",
    specs: "Next.js, TailwindCSS, GSAP ScrollTrigger",
    tags: ["Luxurious", "Layout", "Animation"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 2,
    caseStudy:
      "# Wellness Retreat Layout\n\n### The Goal\nEstablish an immersive, nature-inspired design language for a spa retreat booking portal.\n\n### Implementation\nCreated a dark forest green environment accented by golden highlights and smooth, flowing image hover parallax effects.",
  },
  {
    title: "Mr. Minoru",
    description:
      "An artistic and illustrative portfolio showcasing creative developer projects and custom character graphics.",
    category: "Creative Dev",
    coverImageUrl: "/images/mr_minoru.png",
    client: "Minoru Studios",
    specs: "React, Three.js, Spline, Tailwind",
    tags: ["Illustration", "Creative", "Interactive"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 3,
    caseStudy:
      "# Mr. Minoru Creative Portfolio\n\n### The Goal\nBuild a highly interactive, playful visual portfolio using modern web animation libraries.\n\n### Implementation\nUtilized custom SVG morphing, vibrant blue backgrounds, and organic floating layouts for a highly memorable brand experience.",
  },
  {
    title: "Reseda Photography",
    description:
      "A minimalist, photography-centric editorial landing page showcasing LA-based photo shoots and portfolios.",
    category: "Photography Portfolio",
    coverImageUrl: "/images/reseda.png",
    client: "Sona Parazi",
    specs: "Next.js, TailwindCSS, Lenis Scroll",
    tags: ["Photography", "Minimalism", "Portfolio"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 4,
    caseStudy:
      "# Reseda - Fine Art Photography\n\n### The Goal\nDesign a layout where fine art photography is the primary focus, utilizing large bold typography and asymmetrical grids.\n\n### Result\nA striking, modern minimalist interface that functions as an online gallery.",
  },
  {
    title: "BBQ Is Life",
    description:
      "A vibrant, high-energy e-commerce storefront for a premium BBQ restaurant and catering brand.",
    category: "E-Commerce",
    coverImageUrl: "/images/bbq_is_life.png",
    client: "Smokehouse Grill",
    specs: "Next.js, Stripe, TailwindCSS",
    tags: ["E-Commerce", "Food & Beverage", "Stripe"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 5,
    caseStudy:
      "# BBQ Is Life E-Commerce\n\n### The Goal\nDevelop a fun, high-conversion menu and merchandise checkout portal for a busy local smokehouse.\n\n### Execution\nImplemented a bold color palette (orange-red/yellow) with skewed image frames and optimized cart flows.",
  },
  {
    title: "Elevated Spatial Design",
    description:
      "A sleek, high-end portfolio site for a modern luxury interior design and architecture studio.",
    category: "Architecture & Design",
    coverImageUrl: "/images/spatial_design.png",
    client: "Luxe Spaces",
    specs: "Next.js, GSAP, Framer Motion",
    tags: ["Interior", "Architecture", "Luxury"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 6,
    caseStudy:
      "# Elevated Spatial Design Portfolio\n\n### The Goal\nPresent architectural concepts and spatial layout renders in an clean, high-fashion grid.\n\n### Result\nA beautiful, responsive site using refined slate and taupe palettes to highlight premium interior photographs.",
  },
  {
    title: "Salon Emmeline",
    description:
      "A sophisticated editorial booking website for a boutique beauty and hair styling salon.",
    category: "Lifestyle & Beauty",
    coverImageUrl: "/images/salon_emmeline.png",
    client: "Salon Emmeline",
    specs: "Next.js, Firebase Auth, TailwindCSS",
    tags: ["Lifestyle", "Booking", "Editorial"],
    githubUrl: "https://github.com/HavyasU",
    liveUrl: "https://havyas.in",
    order: 7,
    caseStudy:
      "# Salon Emmeline Booking\n\n### The Goal\nDesign a warm, welcoming, and elegant layout for a hair salon's service menu and scheduling.\n\n### Outcome\nA seamless user flow from exploring styling categories to booking appointments.",
  },
];

export const seedEducation: Omit<Education, "id">[] = [
  {
    degree: "Bachelor of Technology in Computer Science",
    institution: "Sahyadri College of Engineering & Management",
    year: "2021 - 2025",
    description:
      "Focused on Data Structures, Web Engineering, Database Management, and Software System Architecture.",
    order: 1,
  },
  {
    degree: "Pre-University Course (PCMB)",
    institution: "St. Aloysius Pre-University College",
    year: "2019 - 2021",
    description: "Graduated with distinction in Science stream.",
    order: 2,
  },
];

export const seedExperiences: Omit<Experience, "id">[] = [
  {
    role: "Full Stack Freelancer",
    company: "Self-employed",
    duration: "2023 - Present",
    description:
      "Developing custom web portals and applications for regional clients. Specializing in building secure, responsive frontends (React, Tailwind) connected to scalable databases (Firebase, MongoDB, SQL).",
    order: 1,
  },
  {
    role: "Frontend UI Intern",
    company: "Tech Solutions India",
    duration: "Jun 2024 - Dec 2024",
    description:
      "Worked on designing and building client dashboards. Co-authored web components using Bootstrap and React. Enhanced layout responsiveness, leading to a 15% increase in user retention rates.",
    order: 2,
  },
];

export const seedTestimonials: Omit<Testimonial, "id">[] = [
  {
    clientName: "Rahul Kamath",
    company: "Swwadishta Foods",
    quote:
      "Havyas delivered a stunning application for our delivery restaurant. The integration of Stripe is flawless, and the layout looks incredible.",
    rating: 5,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  },
  {
    clientName: "Shruthi Rai",
    company: "Apex Designs",
    quote:
      "Extremely professional developer. He converted our Figma designs into pixel-perfect code and helped us deploy everything to our servers. Highly recommend him!",
    rating: 5,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shruthi",
  },
];
