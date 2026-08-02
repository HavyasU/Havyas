// ============================================
// TypeScript Type Definitions for Portfolio
// ============================================

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // fontawesome class, e.g. "fa-code"
  order: number;
  mockupType?: 'search' | 'store' | 'invoice' | 'calendar' | 'custom_image' | string;
  imageUrl?: string; // Custom image graphic URL
  createdAt?: Date;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  category: 'freelance' | 'products' | 'personal' | string;
  coverImageUrl: string;
  client: string;
  specs: string;
  tags: string[];
  caseStudy?: string; // Optional case study write-up
  githubUrl?: string;
  liveUrl?: string;
  order?: number;
  createdAt?: Date;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
  order?: number;
  createdAt?: Date;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string; // e.g., "2025 - Present"
  description: string; // markdown or bullet text
  order: number;
  createdAt?: Date;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  quote: string;
  rating: number; // 1-5
  avatarUrl: string;
  createdAt?: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt?: Date;
}
