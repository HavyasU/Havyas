"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/motion/PageTransition";
import {
  subscribeToWorks,
  subscribeToServices,
  subscribeToExperiences,
  subscribeToTestimonials,
  subscribeToEducation,
  subscribeToResumeUrl,
  addInquiry,
} from "@/lib/firestore";
import {
  seedServices,
  seedWorks,
  seedExperiences,
  seedTestimonials,
  seedEducation,
} from "@/lib/seedData";
import type {
  Work,
  Service,
  Experience,
  Testimonial,
  Education,
} from "@/types";

gsap.registerPlugin(ScrollTrigger);

const initialWorks: Work[] = seedWorks.map((w, i) => ({ id: String(i + 1), ...w }));
const initialServices: Service[] = seedServices.map((s, i) => ({ id: String(i + 1), ...s }));
const initialExperiences: Experience[] = seedExperiences.map((e, i) => ({ id: String(i + 1), ...e }));
const initialTestimonials: Testimonial[] = seedTestimonials.map((t, i) => ({ id: String(i + 1), ...t }));
const initialEducation: Education[] = seedEducation.map((e, i) => ({ id: String(i + 1), ...e }));
const initialCategories: string[] = Array.from(new Set(seedWorks.map((w) => w.category).filter(Boolean)));

const defaultServiceImages = [
  "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
];

function getServiceIcon(title: string, index: number, existingIcon?: string): string {
  if (
    existingIcon &&
    existingIcon !== "fa-code" &&
    existingIcon.trim() !== ""
  ) {
    return existingIcon;
  }
  const t = (title || "").toLowerCase();
  if (t.includes("web") || t.includes("site")) return "fa-laptop-code";
  if (t.includes("app") || t.includes("mobile") || t.includes("android") || t.includes("ios"))
    return "fa-mobile-screen-button";
  if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("brand"))
    return "fa-palette";
  if (t.includes("api") || t.includes("backend") || t.includes("server"))
    return "fa-server";
  if (t.includes("devops") || t.includes("cloud") || t.includes("maint"))
    return "fa-gauge-high";

  const fallbackIcons = [
    "fa-laptop-code",
    "fa-mobile-screen-button",
    "fa-palette",
    "fa-server",
    "fa-gauge-high",
  ];
  return fallbackIcons[index % fallbackIcons.length];
}

function getEnrichedService(service: Service, index: number): Service {
  const seedMatch =
    seedServices[index] ||
    seedServices.find(
      (s) => s.title.toLowerCase().trim() === service.title.toLowerCase().trim()
    );
  return {
    ...service,
    iconName: getServiceIcon(
      service.title,
      index,
      service.iconName || seedMatch?.iconName
    ),
    imageUrl:
      service.imageUrl && service.imageUrl.trim() !== ""
        ? service.imageUrl
        : seedMatch?.imageUrl ||
          defaultServiceImages[index % defaultServiceImages.length],
    deliverables:
      service.deliverables && service.deliverables.length > 0
        ? service.deliverables
        : seedMatch?.deliverables || [
            "Full custom architecture & development",
            "Mobile-first responsive optimization",
            "Performance & Core Web Vitals compliance",
            "Comprehensive testing & production deployment",
          ],
    technologies:
      service.technologies && service.technologies.length > 0
        ? service.technologies
        : seedMatch?.technologies || [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
          ],
  };
}

function getInitialCached<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`cache_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
    }
  } catch {}
  return fallback;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>(() =>
    getInitialCached("services", initialServices)
  );
  const [works, setWorks] = useState<Work[]>(() =>
    getInitialCached("works", initialWorks)
  );
  const [experiences, setExperiences] = useState<Experience[]>(() =>
    getInitialCached("experiences", initialExperiences)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    getInitialCached("testimonials", initialTestimonials)
  );
  const [educationList, setEducationList] = useState<Education[]>(() =>
    getInitialCached("education", initialEducation)
  );
  const [resumeUrl, setResumeUrl] = useState<string>("/havyasU_Resume.pdf");

  // Projects filtering
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(initialCategories);

  // Testimonials active slide
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Inquiry form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: { name: "", email: "", message: "" },
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const unsubServices = subscribeToServices((data) => {
      if (data && data.length > 0) {
        setServices((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          try {
            localStorage.setItem("cache_services", JSON.stringify(data));
          } catch {}
          return data;
        });
      }
    });
    const unsubWorks = subscribeToWorks((data) => {
      if (data && data.length > 0) {
        setWorks((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          try {
            localStorage.setItem("cache_works", JSON.stringify(data));
          } catch {}
          return data;
        });
        const cats = Array.from(
          new Set(data.map((w) => w.category).filter(Boolean)),
        );
        setCategories(cats);
      }
    });
    const unsubExp = subscribeToExperiences((data) => {
      if (data && data.length > 0) {
        setExperiences((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          try {
            localStorage.setItem("cache_experiences", JSON.stringify(data));
          } catch {}
          return data;
        });
      }
    });
    const unsubTestimonials = subscribeToTestimonials((data) => {
      if (data && data.length > 0) {
        setTestimonials((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          try {
            localStorage.setItem("cache_testimonials", JSON.stringify(data));
          } catch {}
          return data;
        });
      }
    });
    const unsubEdu = subscribeToEducation((data) => {
      if (data && data.length > 0) {
        setEducationList((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          try {
            localStorage.setItem("cache_education", JSON.stringify(data));
          } catch {}
          return data;
        });
      }
    });
    const unsubResume = subscribeToResumeUrl(setResumeUrl);

    // Refresh ScrollTrigger smoothly once layout is settled
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      unsubServices();
      unsubWorks();
      unsubExp();
      unsubTestimonials();
      unsubEdu();
      unsubResume();
    };
  }, []);

  // Hero Intro GSAP Animation (Runs ONCE on mount)
  useGSAP(
    () => {
      if (!mounted) return;

      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }
      );
      tl.fromTo(
        ".hero-image-wrapper",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
    },
    { dependencies: [mounted] }
  );

  // Stats Counter ScrollTrigger Animation
  useGSAP(
    () => {
      if (!mounted) return;

      const statItems = gsap.utils.toArray(".stat-number");
      statItems.forEach((item: any) => {
        const targetVal = parseInt(item.getAttribute("data-target") || "0", 10);
        const obj = { count: 0 };
        gsap.to(obj, {
          count: targetVal,
          duration: 2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            item.innerText = Math.floor(obj.count) + "+";
          },
        });
      });
    },
    { dependencies: [mounted] }
  );

  // Section ScrollTrigger Reveal Animations
  useGSAP(
    () => {
      if (!mounted) return;

      // Animate section headings
      const sections = gsap.utils.toArray<HTMLElement>("section");
      sections.forEach((sec) => {
        const title = sec.querySelector(".section-title");
        const subtitle = sec.querySelector(".section-subtitle");
        if (title || subtitle) {
          gsap.fromTo(
            [title, subtitle].filter(Boolean),
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // Animate Service Cards
      const serviceCards = gsap.utils.toArray(".service-deck-card, .service-card");
      if (serviceCards.length > 0 && document.querySelector(".services-deck, .services-grid")) {
        gsap.fromTo(
          serviceCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: document.querySelector(".services-deck") || ".services-grid",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate Project Cards
      const projectCards = gsap.utils.toArray(".project-card-new");
      if (projectCards.length > 0 && document.querySelector(".projects-grid")) {
        gsap.fromTo(
          projectCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".projects-grid",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { dependencies: [mounted] }
  );

  const onSubmit = async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    try {
      await addInquiry(data);
      reset();
    } catch (e) {
      console.error(e);
      alert("Could not submit inquiry. Check your console.");
    }
  };

  const filteredWorks =
    activeCategory === "all"
      ? works
      : works.filter((w) => w.category === activeCategory);

  return (
    <PageTransition>
      {/* ============================================
         Hero Section
         ============================================ */}
      <section id="about" ref={heroRef} className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="greeting">Hey there, I&apos;m</span>
            <h1 className="hero-name">Havyas U</h1>
            <h2 className="hero-title">Full Stack Developer</h2>
            <p className="hero-description">
              Crafting robust and scalable web applications from Mangalore,
              Karnataka. Currently pursuing MCA at Nitte University.
            </p>
            <div className="hero-buttons">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn btn-primary"
              >
                Download CV{" "}
                <i
                  className="fa-solid fa-download"
                  style={{ marginLeft: "6px" }}
                ></i>
              </a>
              <a href="#contact" className="btn btn-secondary">
                Let&apos;s Talk
              </a>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image">
              <img src="/images/havyasRai.jpg" alt="Havyas U" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
         Stats Section
         ============================================ */}
      <section ref={statsRef} className="stats-section section-alt">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon-box">
                <i className="fa-solid fa-code-commit"></i>
              </div>
              <div>
                <h2 className="stat-number" data-target="3">
                  0+
                </h2>
                <p>Years Experience</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-box">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div>
                <h2 className="stat-number" data-target="15">
                  0+
                </h2>
                <p>Projects Delivered</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-box">
                <i className="fa-solid fa-award"></i>
              </div>
              <div>
                <h2 className="stat-number" data-target="10">
                  0+
                </h2>
                <p>Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
         Design Proof & Styles Showcase (Before Education)
         ============================================ */}
      <section className="section showcase-section overflow-hidden py-12">
        <div>
          <div className="ui-showcase-marquee">
            {/* Row 1: Slides Left */}
            <div className="marquee-wrapper">
              <div className="marquee-row marquee-left">
                {works.length === 0 ? (
                  <p className="text-text-secondary italic text-center py-4">
                    No design proofs loaded yet.
                  </p>
                ) : (
                  [...works, ...works, ...works].map((work, idx) => (
                    <div
                      className="showcase-card"
                      key={`proof-r1-${work.id}-${idx}`}
                    >
                      <div className="browser-top-bar">
                        <div className="browser-dots">
                          <span className="dot dot-red"></span>
                          <span className="dot dot-yellow"></span>
                          <span className="dot dot-green"></span>
                        </div>
                        <div className="browser-url">
                          havyas.in/
                          {work.title.toLowerCase().replace(/\s+/g, "-")}
                        </div>
                      </div>
                      <div className="showcase-image-container">
                        <img
                          src={work.coverImageUrl || "/images/connectimage.png"}
                          alt={work.title}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Row 2: Slides Right */}
            <div className="marquee-wrapper">
              <div className="marquee-row marquee-right">
                {works.length === 0 ? (
                  <p className="text-text-secondary italic text-center py-4">
                    No design proofs loaded yet.
                  </p>
                ) : (
                  [...works, ...works, ...works].reverse().map((work, idx) => (
                    <div
                      className="showcase-card"
                      key={`proof-r2-${work.id}-${idx}`}
                    >
                      <div className="browser-top-bar">
                        <div className="browser-dots">
                          <span className="dot dot-red"></span>
                          <span className="dot dot-yellow"></span>
                          <span className="dot dot-green"></span>
                        </div>
                        <div className="browser-url">
                          havyas.in/
                          {work.title.toLowerCase().replace(/\s+/g, "-")}
                        </div>
                      </div>
                      <div className="showcase-image-container">
                        <img
                          src={work.coverImageUrl || "/images/connectimage.png"}
                          alt={work.title}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
         Education Section
         ============================================ */}
      <section id="education" className="section education-section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fa-solid fa-graduation-cap"></i> Academics
            </span>
            <h2 className="section-title">Education</h2>
            <p className="section-subtitle">
              Academic foundations, technical degrees, and ongoing computer science research
            </p>
          </div>

          <div className="education-grid">
            {educationList.length === 0 ? (
              <p className="text-text-secondary italic text-center col-span-full">
                No education history added yet.
              </p>
            ) : (
              educationList.map((edu) => (
                <div key={edu.id} className="education-card">
                  <div>
                    <div className="education-card-header">
                      <div>
                        <span className="edu-year-badge">{edu.year}</span>
                        <h3>{edu.degree}</h3>
                        <h4>
                          <i className="fa-solid fa-building-columns text-xs opacity-70"></i>
                          {edu.institution}
                        </h4>
                      </div>
                      <div className="edu-icon-box">
                        <i className="fa-solid fa-graduation-cap"></i>
                      </div>
                    </div>
                    <p>{edu.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============================================
         Work Experience Section
         ============================================ */}
      <section id="experience" className="section experience-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fa-solid fa-briefcase"></i> Career Journey
            </span>
            <h2 className="section-title">Work Experience</h2>
            <p className="section-subtitle">
              Professional engineering roles, software development impact, and industry contributions
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            {experiences.length === 0 ? (
              <p className="text-text-secondary italic text-center">
                No work experience loaded yet.
              </p>
            ) : (
              experiences.map((exp, index) => {
                const isLeft = index % 2 === 0;
                const roleLower = exp.role.toLowerCase();
                let iconClass = "fa-briefcase";
                if (
                  roleLower.includes("developer") ||
                  roleLower.includes("engineer") ||
                  roleLower.includes("programmer")
                ) {
                  iconClass = "fa-code";
                } else if (
                  roleLower.includes("design") ||
                  roleLower.includes("ui") ||
                  roleLower.includes("ux")
                ) {
                  iconClass = "fa-palette";
                } else if (roleLower.includes("intern")) {
                  iconClass = "fa-laptop-code";
                }

                return (
                  <div
                    className={`timeline-item ${isLeft ? "left" : "right"}`}
                    key={exp.id}
                  >
                    <div className="timeline-dot"></div>
                    <div className="timeline-card">
                      <div className="timeline-card-header">
                        <div className="timeline-title-group">
                          <h3>{exp.role}</h3>
                          <span className="timeline-company">
                            <i className="fa-solid fa-building text-xs opacity-70 mr-1.5"></i>
                            {exp.company}
                          </span>
                        </div>
                        <div className="timeline-icon-box">
                          <i className={`fa-solid ${iconClass}`}></i>
                        </div>
                      </div>
                      <span className="timeline-duration">{exp.duration}</span>
                      <p className="timeline-description">{exp.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ============================================
      {/* ============================================
         Tech Stack / Skills
         ============================================ */}
      <section id="skills" className="section skills-section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fa-solid fa-code"></i> Tech Stack
            </span>
            <h2 className="section-title">Technical Expertise</h2>
            <p className="section-subtitle">
              Core technologies, frameworks, and modern tools leveraged to architect high-performance web & mobile systems
            </p>
          </div>

          <div className="skills-grid">
            {/* 1. Frontend & Mobile */}
            <div className="skill-category">
              <div>
                <div className="skill-category-header">
                  <div className="skill-icon-box">
                    <i className="fa-solid fa-code"></i>
                  </div>
                  <div>
                    <h3>Frontend & Mobile</h3>
                    <span className="skill-category-subtitle">
                      Responsive UI/UX & Native Systems
                    </span>
                  </div>
                </div>
                <div className="skill-tags">
                  {[
                    "React Native",
                    "Next.js",
                    "React.js",
                    "TypeScript",
                    "JavaScript (ES6+)",
                    "Tailwind CSS",
                    "HTML5 / CSS3",
                    "Sass",
                    "Redux Toolkit",
                  ].map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Backend & Architecture */}
            <div className="skill-category">
              <div>
                <div className="skill-category-header">
                  <div className="skill-icon-box">
                    <i className="fa-solid fa-server"></i>
                  </div>
                  <div>
                    <h3>Backend & Core Logic</h3>
                    <span className="skill-category-subtitle">
                      Scalable APIs & Microservices
                    </span>
                  </div>
                </div>
                <div className="skill-tags">
                  {[
                    "Node.js",
                    "Express.js",
                    "Python",
                    "Flask",
                    "RESTful APIs",
                    "Socket.io",
                    "JWT Auth",
                    "Middleware Engine",
                  ].map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Database & Dev Tools */}
            <div className="skill-category">
              <div>
                <div className="skill-category-header">
                  <div className="skill-icon-box">
                    <i className="fa-solid fa-database"></i>
                  </div>
                  <div>
                    <h3>Database & Cloud</h3>
                    <span className="skill-category-subtitle">
                      Persistent Storage, DevOps & CI/CD
                    </span>
                  </div>
                </div>
                <div className="skill-tags">
                  {[
                    "MongoDB",
                    "Firebase / Firestore",
                    "MySQL",
                    "SQLite",
                    "Git / GitHub",
                    "Vercel",
                    "Cloudinary",
                    "Postman",
                  ].map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
         Services Section (3-Card Grid)
         ============================================ */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fa-solid fa-compass-drafting"></i> Solutions
            </span>
            <h2 className="section-title">What I Can Do</h2>
            <p className="section-subtitle">
              Comprehensive end-to-end solutions engineered to transform concepts into high-impact digital experiences
            </p>
          </div>

          <div className="services-deck">
            {services.length === 0 ? (
              <p className="text-text-secondary italic text-center col-span-full py-8">
                No services configured yet.
              </p>
            ) : (
              services.slice(0, 3).map((rawService, index) => {
                const service = getEnrichedService(rawService, index);
                return (
                  <a
                    key={service.id || `srv-${index}`}
                    href="#contact"
                    className="service-deck-card"
                    onClick={() => {
                      setTimeout(() => {
                        const msgInput = document.querySelector(
                          'textarea[name="message"]'
                        ) as HTMLTextAreaElement | null;
                        if (msgInput) {
                          msgInput.value = `Hi Havyas, I would like to inquire about your ${service.title} service.`;
                          msgInput.focus();
                        }
                      }, 200);
                    }}
                    aria-label={`Inquire about ${service.title}`}
                  >
                    {/* Top Row: Icon + Number + Action Arrow */}
                    <div className="service-deck-header">
                      <div className="service-deck-icon-box">
                        <i className={`fa-solid ${service.iconName || "fa-code"}`}></i>
                      </div>
                      <div className="service-deck-actions">
                        <span className="service-deck-num">0{index + 1}</span>
                        <div className="service-deck-arrow-btn" aria-hidden="true">
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </div>
                      </div>
                    </div>

                    {/* Visual Media Frame */}
                    <div className="service-deck-frame">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="service-deck-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Content Area */}
                    <div className="service-deck-content">
                      <span className="service-deck-subtag">Service &middot; 0{index + 1}</span>
                      <h3 className="service-deck-heading">{service.title}</h3>
                      <p className="service-deck-paragraph">{service.description}</p>

                      <div className="service-deck-link">
                        <span>Get Started</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ============================================
         Projects Section
         ============================================ */}
      <section id="projects" className="section projects-section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fa-solid fa-rocket"></i> Portfolio
            </span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              Curated selection of high-impact digital experiences, web applications, and brand platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {works.length === 0 ? (
              <p className="text-text-secondary italic text-center col-span-full py-8">
                No projects loaded yet.
              </p>
            ) : (
              works.slice(0, 4).map((work) => {
                return (
                  <div
                    key={work.id}
                    className="project-card-new group flex flex-col justify-between"
                  >
                    {/* Canvas Frame */}
                    <div className="project-canvas-frame">
                      {/* Inner Mockup Image */}
                      <div className="project-inner-mockup">
                        <img
                          src={work.coverImageUrl || "/images/connectimage.png"}
                          alt={work.title}
                          className="w-full h-full object-cover object-top block"
                          loading="lazy"
                        />
                      </div>

                      {/* Hover Overlay with Live Demo and GitHub links */}
                      <div
                        className="project-hover-overlay"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0, 0, 0, 0.7)",
                          backdropFilter: "blur(4px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.6rem",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 10,
                          borderRadius: "12px",
                        }}
                      >
                        <a
                          href={work.liveUrl || "https://havyas.in"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="showcase-link-btn primary"
                        >
                          <i className="fa-solid fa-up-right-from-square"></i>{" "}
                          Live Demo
                        </a>
                        <a
                          href={work.githubUrl || "https://github.com/HavyasU"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="showcase-link-btn"
                        >
                          <i className="fa-brands fa-github"></i> GitHub
                        </a>
                      </div>
                    </div>

                    {/* Card Metadata */}
                    <div className="flex-grow flex flex-col justify-between pt-0.5">
                      <div>
                        {/* Title & Arrow Link */}
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-text-primary tracking-tight">
                            {work.title}
                          </h3>
                          <span className="text-base text-text-secondary font-light">
                            ↗
                          </span>
                        </div>

                        {/* Subtitle / Client */}
                        <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
                          {work.client || work.category}
                        </p>

                        {/* Tags Pill List */}
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                          {work.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-bg-section-alt border border-border-color text-text-secondary font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Case Study Page Link Button */}
                      <Link
                        href={`/projects/${work.id}`}
                        className="btn btn-primary w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider block"
                      >
                        View Case Study &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="btn btn-secondary px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm"
            >
              Explore All Projects & Case Studies (
              {works.length > 4 ? works.length : 7}+ Works){" "}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
         Testimonials Section
         ============================================ */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="section testimonials-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">
                <i className="fa-solid fa-comment-dots"></i> Endorsements
              </span>
              <h2 className="section-title">Client Feedback</h2>
              <p className="section-subtitle">
                Testimonials from collaborators, engineering teams, and project stakeholders
              </p>
            </div>

            <div className="testimonial-spotlight-card">
              <div className="testimonial-top-row">
                <div className="testimonial-quote-icon-box">
                  <i className="fa-solid fa-quote-left"></i>
                </div>
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonialIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ minHeight: "70px" }}
                >
                  <p className="testimonial-quote-text">
                    &ldquo;{testimonials[activeTestimonialIdx].quote}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="testimonial-author-wrapper">
                <img
                  src={
                    testimonials[activeTestimonialIdx].avatarUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo"
                  }
                  alt={testimonials[activeTestimonialIdx].clientName}
                  className="testimonial-avatar"
                />
                <div className="testimonial-author-info">
                  <h4 className="testimonial-author-name">
                    {testimonials[activeTestimonialIdx].clientName}
                  </h4>
                  <p className="testimonial-author-role">
                    {testimonials[activeTestimonialIdx].company}
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="testimonial-nav-controls">
                <button
                  type="button"
                  className="testimonial-nav-btn"
                  onClick={() =>
                    setActiveTestimonialIdx((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous testimonial"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>

                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className="testimonial-dot-pill"
                      style={{
                        background:
                          activeTestimonialIdx === idx
                            ? "var(--text-primary)"
                            : "var(--border-color)",
                        width: activeTestimonialIdx === idx ? "22px" : "6px",
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                    ></button>
                  ))}
                </div>

                <button
                  type="button"
                  className="testimonial-nav-btn"
                  onClick={() =>
                    setActiveTestimonialIdx((prev) =>
                      prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next testimonial"
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
         Contact Section
         ============================================ */}
      <section id="contact" className="section contact-section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fa-solid fa-paper-plane"></i> Get In Touch
            </span>
            <h2 className="section-title">Let&apos;s Build Something Great</h2>
            <p className="section-subtitle">
              Have a project in mind, need technical consulting, or exploring software collaborations? Reach out today.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Contact & Availability */}
              <div className="lg:col-span-5 space-y-6">
                {/* Availability Badge Card */}
                <div className="p-6 rounded-2xl bg-bg-card border border-border-color shadow-sm flex items-center gap-4">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <span className="text-sm font-bold text-text-primary block">
                      Available for New Projects
                    </span>
                    <span className="text-xs text-text-secondary">
                      Full-Stack Web, Native Mobile & Architecture Consulting
                    </span>
                  </div>
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-4">
                  <a
                    href="mailto:havyasu2005@gmail.com"
                    className="p-5 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary transition-all flex items-center justify-between group shadow-sm hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg-section-alt border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary block font-semibold uppercase tracking-wider">
                          Email Me
                        </span>
                        <span className="text-sm font-bold text-text-primary">
                          havyasu2005@gmail.com
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all">
                      &rarr;
                    </span>
                  </a>

                  <a
                    href="https://api.whatsapp.com/send?phone=7483989780&text=Hey%2C%20I%20would%20like%20to%20connect%20with%20you%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary transition-all flex items-center justify-between group shadow-sm hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg-section-alt border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                        <i className="fa-brands fa-whatsapp"></i>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary block font-semibold uppercase tracking-wider">
                          WhatsApp Direct
                        </span>
                        <span className="text-sm font-bold text-text-primary">
                          +91 7483989780
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>

              {/* Right Column: Inquiry Form Card */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 rounded-2xl bg-bg-card border border-border-color shadow-sm">
                  <div className="mb-6 pb-4 border-b border-border-color">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">
                      Send a Message
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Fill out the form below and I&apos;ll respond within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl bg-bg-section-alt border border-border-color text-text-primary placeholder:text-text-secondary/60 text-sm focus:outline-none focus:border-text-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        required
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl bg-bg-section-alt border border-border-color text-text-primary placeholder:text-text-secondary/60 text-sm focus:outline-none focus:border-text-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                        Message
                      </label>
                      <textarea
                        placeholder="Tell me about your project, timeline, or inquiry..."
                        required
                        rows={4}
                        {...register("message")}
                        className="w-full px-4 py-3 rounded-xl bg-bg-section-alt border border-border-color text-text-primary placeholder:text-text-secondary/60 text-sm focus:outline-none focus:border-text-primary transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider block shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </button>

                    {isSubmitSuccessful && (
                      <p className="text-xs text-emerald-500 font-semibold text-center pt-2">
                        ✓ Message sent successfully! I&apos;ll get back to you soon.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
