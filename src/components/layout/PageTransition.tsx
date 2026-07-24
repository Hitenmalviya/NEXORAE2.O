import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Wipe transition variant — full viewport wipe
export function WipeTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div className={`relative overflow-hidden ${className}`}>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Wipe overlay */}
      <motion.div
        className="fixed inset-0 z-[9990] bg-void pointer-events-none"
        initial={{ clipPath: 'inset(0 0 0 0)' }}
        animate={{ clipPath: 'inset(0 0 100% 0)' }}
        exit={{ clipPath: 'inset(0 0 0 0)' }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      />
    </motion.div>
  );
}
