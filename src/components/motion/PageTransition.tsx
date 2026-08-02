'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}
