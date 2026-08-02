import type { Service, Work, Experience, Testimonial } from "@/types";

export const seedServices: Omit<Service, "id">[] = [
  {
    title: "Website Design",
    description:
      "Visually appealing, user-centric websites that elevate your brand and create lasting impressions.",
    iconName: "fa-code",
    order: 1,
    mockupType: "search",
  },
  {
    title: "Graphic Design",
    description:
      "Stunning visuals and branding materials that resonate with your audience and tell your story.",
    iconName: "fa-pen-nib",
    order: 2,
    mockupType: "store",
  },
  {
    title: "Applications",
    description:
      "Seamless, impactful, and user-friendly mobile and web applications tailored to your requirements.",
    iconName: "fa-mobile-screen",
    order: 3,
    mockupType: "invoice",
  },
  {
    title: "Project Design",
    description:
      "Compelling visuals and structured presentations to showcase your academic or professional projects.",
    iconName: "fa-diagram-project",
    order: 4,
    mockupType: "calendar",
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
