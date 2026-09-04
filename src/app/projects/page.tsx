// ============================================
// Projects List Page
// ============================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { subscribeToWorks } from "@/lib/firestore";
import { seedWorks } from "@/lib/seedData";
import type { Work } from "@/types";
import PageTransition from "@/components/motion/PageTransition";

const initialWorks: Work[] = seedWorks.map((w, i) => ({ id: String(i + 1), ...w }));
const initialCategories: string[] = Array.from(new Set(seedWorks.map((w) => w.category).filter(Boolean)));

export default function ProjectsPage() {
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToWorks((data) => {
      if (data && data.length > 0) {
        setWorks(data);
        const cats = Array.from(
          new Set(data.map((w) => w.category).filter(Boolean)),
        );
        setCategories(cats);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredWorks =
    activeCategory === "all"
      ? works
      : works.filter((w) => w.category === activeCategory);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-color pb-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
              All Projects
            </h1>
            <p className="text-text-secondary text-base mt-2">
              Browse the complete list of freelance works, products, and
              personal projects.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all ${
                activeCategory === "all"
                  ? "bg-text-primary border-text-primary text-bg-body"
                  : "border-border-color text-text-secondary hover:border-text-primary hover:text-text-primary"
              }`}
            >
              All Works
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all ${
                  activeCategory === cat
                    ? "bg-text-primary border-text-primary text-bg-body"
                    : "border-border-color text-text-secondary hover:border-text-primary hover:text-text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Projects */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-text-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredWorks.length === 0 ? (
                <p className="text-text-secondary italic text-center col-span-full py-12">
                  No projects found.
                </p>
              ) : (
                filteredWorks.map((work) => {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={work.id}
                      className="project-card-new group flex flex-col justify-between"
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
                            border: "12px solid #ffffff",
                            borderInline: "12px solid #ffffff",
                            borderBottom: "0px",

                            overflow: "hidden",
                            boxShadow:
                              "0 20px 40px -10px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15)",
                            transition:
                              "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <img
                            src={
                              work.coverImageUrl || "/images/connectimage.png"
                            }
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
                            href={
                              work.githubUrl || "https://github.com/HavyasU"
                            }
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
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
