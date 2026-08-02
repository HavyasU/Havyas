// ============================================
// Initial Page Preloader — Havyas U Branding
// ============================================
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 250);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18) + 10;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col items-center justify-center select-none"
        >
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Branding Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                Havyas U<span className="text-emerald-400">.</span>
              </h1>
            </motion.div>

            {/* Role Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-8"
            >
              Full Stack Developer
            </motion.p>

            {/* Progress Line */}
            <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Counter */}
            <span className="text-xs font-mono font-bold text-neutral-400">
              {Math.min(progress, 100)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
