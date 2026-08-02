"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  subscribeToWorks,
  subscribeToServices,
  subscribeToExperiences,
  subscribeToTestimonials,
  subscribeToEducation,
  subscribeToResumeUrl,
  addInquiry,
} from "@/lib/firestore";
import type {
  Work,
  Service,
  Experience,
  Testimonial,
  Education,
} from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string>("/havyasU_Resume.pdf");

  // Projects filtering
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

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

    const unsubServices = subscribeToServices(setServices);
    const unsubWorks = subscribeToWorks((data) => {
      setWorks(data);
      const cats = Array.from(
        new Set(data.map((w) => w.category).filter(Boolean)),
      );
      setCategories(cats);
    });
    const unsubExp = subscribeToExperiences(setExperiences);
    const unsubTestimonials = subscribeToTestimonials(setTestimonials);
    const unsubEdu = subscribeToEducation(setEducationList);
    const unsubResume = subscribeToResumeUrl(setResumeUrl);

    return () => {
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
    { dependencies: [mounted, works, experiences] }
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
      const serviceCards = gsap.utils.toArray(".service-card");
      if (serviceCards.length > 0 && document.querySelector(".services-grid")) {
        gsap.fromTo(
          serviceCards,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".services-grid",
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
    { dependencies: [mounted, services, works] }
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
    <div className="w-full">
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
              <h2 className="stat-number" data-target="3">
                0+
              </h2>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number" data-target="15">
                0+
              </h2>
              <p>Projects Delivered</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number" data-target="10">
                0+
              </h2>
              <p>Happy Clients</p>
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
         Education & Experience Sections
         ============================================ */}
      {/* ============================================
         Education Section
         ============================================ */}
      <section id="education" className="section education-section section-alt">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            Academic foundations and credentials
          </p>
          <div
            className="education-grid-new"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {educationList.length === 0 ? (
              <p className="text-text-secondary italic text-center col-span-full">
                No education credentials added yet.
              </p>
            ) : (
              educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="education-card"
                  style={{
                    background: "var(--bg-card)",
                    padding: "2.5rem 2rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    transition: "var(--transition)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <span
                        className="edu-year"
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--nav-text-active)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {edu.year}
                      </span>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          marginTop: "0.5rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <h4
                        style={{
                          fontSize: "1rem",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                          marginTop: "0.25rem",
                        }}
                      >
                        {edu.institution}
                      </h4>
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "#ffffff",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="fa-solid fa-graduation-cap"
                        style={{ fontSize: "1.25rem" }}
                      ></i>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {edu.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============================================
         Work Experience Section (Timeline)
         ============================================ */}
      <section id="experience" className="section experience-section">
        <div className="container">
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            My professional journey and industry contributions
          </p>

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
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="section-title">Technical Expertise</h2>
            <p className="section-subtitle">
              Technologies, frameworks, and modern tools I leverage to engineer
              high-performance web & mobile software applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Frontend & Mobile */}
            <div className="p-8 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-color">
                  <div className="w-10 h-10 rounded-xl bg-text-primary/5 border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                    <i className="fa-solid fa-code"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
                      Frontend & Mobile
                    </h3>
                    <span className="text-xs text-text-secondary font-medium">
                      UI/UX & Native Systems
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
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
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-semibold text-text-primary bg-bg-section-alt border border-border-color rounded-lg hover:border-text-primary hover:bg-text-primary/10 hover:scale-105 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Backend & Architecture */}
            <div className="p-8 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-color">
                  <div className="w-10 h-10 rounded-xl bg-text-primary/5 border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                    <i className="fa-solid fa-server"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
                      Backend & Core Logic
                    </h3>
                    <span className="text-xs text-text-secondary font-medium">
                      APIs & Microservices
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
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
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-semibold text-text-primary bg-bg-section-alt border border-border-color rounded-lg hover:border-text-primary hover:bg-text-primary/10 hover:scale-105 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Database & Dev Tools */}
            <div className="p-8 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-color">
                  <div className="w-10 h-10 rounded-xl bg-text-primary/5 border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                    <i className="fa-solid fa-database"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
                      Database & Cloud Tools
                    </h3>
                    <span className="text-xs text-text-secondary font-medium">
                      Data Storage & Deployment
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
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
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-semibold text-text-primary bg-bg-section-alt border border-border-color rounded-lg hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
                    >
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
         Services Section
         ============================================ */}
      <section id="services" className="section services-section">
        <div className="container">
          <h2 className="section-title">What I Do</h2>
          <p className="section-subtitle">
            Comprehensive solutions for your digital needs
          </p>
          <div className="services-grid">
            {services.length === 0 ? (
              <p className="text-text-secondary italic text-center col-span-full">
                No services configured yet.
              </p>
            ) : (
              services.map((service, index) => {
                const cardIndex = index % 4; // Cycle fallback
                const hasCustomImage =
                  service.imageUrl && service.imageUrl.trim() !== "";
                const effectiveType = hasCustomImage
                  ? "custom_image"
                  : service.mockupType ||
                    (cardIndex === 0
                      ? "search"
                      : cardIndex === 1
                        ? "store"
                        : cardIndex === 2
                          ? "invoice"
                          : "calendar");

                return (
                  <div
                    key={service.id}
                    className={`service-card card-style-${cardIndex}`}
                  >
                    <div className="service-card-top">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>

                    {/* Service Visual Mockup Area */}
                    <div className="service-mockup">
                      {effectiveType === "custom_image" && service.imageUrl ? (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                          />
                        </div>
                      ) : effectiveType === "search" ? (
                        /* 1. Website Design Graphic (Search & Code Browser Mockup) */
                        <div className="mockup-search-container">
                          <div className="mockup-search-bar">
                            <i className="fa-solid fa-globe"></i>
                            <span>havyas.in</span>
                            <div className="mockup-cursor">|</div>
                          </div>
                          <div className="mockup-tags">
                            <span className="active">.dev</span>
                            <span>.com</span>
                            <span>.tech</span>
                            <span>.in</span>
                          </div>
                        </div>
                      ) : effectiveType === "store" ? (
                        /* 2. Graphic Design Graphic (Branding & Design Canvas Mockup) */
                        <div className="mockup-graphic-design">
                          <div className="design-canvas">
                            <div className="color-palette">
                              <span
                                className="color-swatch sw-1"
                                title="#00A2C5"
                              ></span>
                              <span
                                className="color-swatch sw-2"
                                title="#EAB308"
                              ></span>
                              <span
                                className="color-swatch sw-3"
                                title="#EC4899"
                              ></span>
                              <span
                                className="color-swatch sw-4"
                                title="#10B981"
                              ></span>
                            </div>
                            <div className="font-specimen">
                              <span className="font-title">Aa</span>
                              <span className="font-subtitle">
                                Branding & Typography
                              </span>
                            </div>
                          </div>
                          <div className="badge badge-design">
                            <i className="fa-solid fa-palette"></i> Branding
                          </div>
                          <div className="badge badge-vector">
                            <i className="fa-solid fa-bezier-curve"></i> Vector
                          </div>
                        </div>
                      ) : effectiveType === "invoice" ? (
                        /* 3. Applications Graphic (Mobile & Web App Interface Mockup) */
                        <div className="mockup-phone-app">
                          <div className="phone-screen">
                            <div className="phone-header-app">
                              <span className="app-name">Mobile App</span>
                              <span className="status-dot"></span>
                            </div>
                            <div className="app-body-stub">
                              <div className="app-card-stub">
                                <i className="fa-solid fa-bolt"></i>
                                <span>Realtime API</span>
                              </div>
                            </div>
                            <div className="app-nav-bar">
                              <i className="fa-solid fa-house active"></i>
                              <i className="fa-solid fa-chart-pie"></i>
                              <i className="fa-solid fa-user"></i>
                            </div>
                          </div>
                          <div className="badge badge-notification">
                            <i className="fa-solid fa-bell"></i> Push Active
                          </div>
                        </div>
                      ) : (
                        /* 4. Project Design Graphic (Presentation & Pitch Deck Mockup) */
                        <div className="mockup-project-deck">
                          <div className="presentation-card">
                            <div className="deck-header">
                              <span className="deck-title">Project Deck</span>
                              <i className="fa-solid fa-diagram-project"></i>
                            </div>
                            <div className="deck-preview">
                              <div className="deck-bar b1"></div>
                              <div className="deck-bar b2"></div>
                            </div>
                            <div className="deck-slide-dots">
                              <span className="s-dot active"></span>
                              <span className="s-dot"></span>
                              <span className="s-dot"></span>
                            </div>
                          </div>
                          <div className="booking-toast">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Design Approved</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ============================================
         Projects Section
         ============================================ */}
      {/* ============================================
         Projects Section
         ============================================ */}
      <section id="projects" className="section projects-section section-alt">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            Curated selection of high-impact digital experiences, web
            applications, and brand platforms
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {works.length === 0 ? (
              <p className="text-text-secondary italic text-center col-span-full py-8">
                No projects loaded yet.
              </p>
            ) : (
              works.slice(0, 4).map((work) => {
                return (
                  <div
                    key={work.id}
                    className="project-card-new group"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Canvas Backdrop Frame (Matching Charcoal Canvas for All Projects) */}
                    <div
                      className="project-canvas-frame"
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "21 / 9",
                        borderRadius: "16px",
                        background: "#0f172a",
                        padding: "1.5rem 1.5rem 0 1.5rem",
                        overflow: "hidden",
                        marginBottom: "1.2rem",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      {/* Inner Mockup Image with Rounded Top & Light Reflect Shadow */}
                      <div
                        className="project-inner-mockup"
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          borderRadius: "5px 5px 0 0",
                          overflow: "hidden",
                          border: "2px solid #ffffff",
                          borderBottom: 0,
                          boxShadow:
                            "0 20px 40px -10px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15)",
                          transition:
                            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <img
                          src={work.coverImageUrl || "/images/connectimage.png"}
                          alt={work.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            objectPosition: "top",
                            display: "block",
                          }}
                        />
                      </div>

                      {/* Hover Overlay with Live Demo and GitHub links */}
                      <div
                        className="project-hover-overlay"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0, 0, 0, 0.65)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "1rem",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 10,
                          borderRadius: "16px",
                        }}
                      >
                        <a
                          href={work.liveUrl || "https://havyas.in"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "0.6rem 1.2rem",
                            borderRadius: "30px",
                            background: "#ffffff",
                            color: "#000000",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                          }}
                        >
                          <i className="fa-solid fa-up-right-from-square"></i>{" "}
                          Live Demo
                        </a>
                        <a
                          href={work.githubUrl || "https://github.com/HavyasU"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "0.6rem 1.2rem",
                            borderRadius: "30px",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                          }}
                        >
                          <i className="fa-brands fa-github"></i> GitHub
                        </a>
                      </div>
                    </div>

                    {/* Card Metadata */}
                    <div
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        {/* Title & Arrow Link */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.3rem",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "1.3rem",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                            }}
                          >
                            {work.title}
                          </h3>
                          <span
                            style={{
                              fontSize: "1.2rem",
                              color: "var(--text-secondary)",
                              fontWeight: 300,
                            }}
                          >
                            ↗
                          </span>
                        </div>

                        {/* Subtitle / Client */}
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            marginBottom: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {work.client || work.category}
                        </p>

                        {/* Tags Pill List */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginBottom: "1.2rem",
                          }}
                        >
                          {work.tags?.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.65rem",
                                borderRadius: "4px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid var(--border-color)",
                                color: "var(--text-secondary)",
                                fontWeight: 500,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Case Study Page Link Button */}
                      <Link
                        href={`/projects/${work.id}`}
                        className="btn btn-primary"
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "center",
                          padding: "0.8rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          borderRadius: "8px",
                        }}
                      >
                        View Case Study &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Link
              href="/projects"
              className="btn btn-secondary"
              style={{
                padding: "1rem 2rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                borderRadius: "30px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
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
        <section id="testimonials" className="section">
          <div className="container">
            <h2 className="section-title">Testimonials</h2>
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonialIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ minHeight: "120px" }}
                >
                  <p className="testimonial-quote-text">
                    &ldquo;{testimonials[activeTestimonialIdx].quote}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <img
                  src={
                    testimonials[activeTestimonialIdx].avatarUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo"
                  }
                  alt={testimonials[activeTestimonialIdx].clientName}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid var(--border-color)",
                  }}
                />
                <div style={{ textAlign: "left" }}>
                  <h4
                    style={{
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {testimonials[activeTestimonialIdx].clientName}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {testimonials[activeTestimonialIdx].company}
                  </p>
                </div>
              </div>

              {/* Slider Dots */}
              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  justifyContent: "center",
                  marginTop: "2.5rem",
                }}
              >
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background:
                        activeTestimonialIdx === idx
                          ? "var(--text-primary)"
                          : "var(--border-color)",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  ></button>
                ))}
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
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Contact Details & Status */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest font-extrabold text-text-secondary block mb-2">
                    Let's Connect
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                    Get In Touch
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed mt-3">
                    Have a project in mind, need technical consulting, or want
                    to discuss full-stack & mobile development opportunities?
                    Feel free to reach out.
                  </p>
                </div>

                {/* Status Badge */}
                <div className="p-4 rounded-xl bg-bg-card border border-border-color flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      Available for New Projects
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      Freelance & Contract Work
                    </span>
                  </div>
                </div>

                {/* Direct Contact Cards */}
                <div className="space-y-4 pt-2">
                  <a
                    href="mailto:havyasu2005@gmail.com"
                    className="p-5 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-text-primary/5 border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary block font-medium">
                          Email Me
                        </span>
                        <span className="text-sm font-bold text-text-primary">
                          havyasu2005@gmail.com
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all">
                      &rarr;
                    </span>
                  </a>

                  <a
                    href="https://api.whatsapp.com/send?phone=7483989780&text=Hey%2C%20I%20would%20like%20to%20connect%20with%20you%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-bg-card border border-border-color hover:border-text-primary/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-text-primary/5 border border-border-color flex items-center justify-center text-text-primary text-lg group-hover:bg-text-primary group-hover:text-bg-body transition-all">
                        <i className="fa-brands fa-whatsapp"></i>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary block font-medium">
                          WhatsApp Direct
                        </span>
                        <span className="text-sm font-bold text-text-primary">
                          +91 7483989780
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>

              {/* Right Column: Standalone Form Card */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 rounded-2xl bg-bg-card border border-border-color shadow-2xl">
                  <div className="mb-6 pb-4 border-b border-border-color">
                    <h3 className="text-xl font-bold text-text-primary">
                      Send a Message
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Fill out the form below and I'll respond within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl bg-bg-body border border-border-color text-text-primary placeholder:text-text-secondary/70 text-sm focus:outline-none focus:border-text-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                        Your Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        required
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl bg-bg-body border border-border-color text-text-primary placeholder:text-text-secondary/70 text-sm focus:outline-none focus:border-text-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                        Message
                      </label>
                      <textarea
                        placeholder="Tell me about your project or inquiry..."
                        required
                        rows={4}
                        {...register("message")}
                        className="w-full px-4 py-3 rounded-xl bg-bg-body border border-border-color text-text-primary placeholder:text-text-secondary/70 text-sm focus:outline-none focus:border-text-primary transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-text-primary text-bg-body font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </button>

                    {isSubmitSuccessful && (
                      <p className="text-xs text-emerald-400 font-semibold text-center pt-2">
                        ✓ Message sent successfully! I'll get back to you soon.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
