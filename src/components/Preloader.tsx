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
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Smooth progress counter simulation
    const startTime = Date.now();
    const duration = 1100; // ms for a snappy, premium feel

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(
        100,
        Math.floor((elapsed / duration) * 100)
      );

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setLoading(false);
          document.body.style.overflow = "";
        }, 300);
      }
    }, 25);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            opacity: 0.95,
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#050811] text-white flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Ambient Background Glows */}
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -top-20 -left-20 animate-pulse" />
          <div className="absolute w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -bottom-20 -right-20 animate-pulse" />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
            {/* Branding Name */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-1 mb-2"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
                Havyas U<span className="text-emerald-400">.</span>
              </h1>
            </motion.div>

            {/* Role Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-8"
            >
              Full Stack Developer
            </motion.p>

            {/* Progress Track & Bar */}
            <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden relative mb-4 p-[1px] backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Counter & Status */}
            <div className="flex items-center justify-between w-full max-w-xs text-xs font-mono text-neutral-400">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                {progress < 40
                  ? "Initializing..."
                  : progress < 85
                  ? "Loading assets..."
                  : "Ready"}
              </span>
              <span className="font-bold text-white font-mono">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
