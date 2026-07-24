import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  once?: boolean;
}

export default function RevealText({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.8,
  once = true,
}: RevealTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-50px' });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      clipPath: direction === 'up' ? 'inset(100% 0 0 0)' : direction === 'down' ? 'inset(0 0 100% 0)' : 'none',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      clipPath: 'inset(0% 0 0 0)',
    },
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Character-by-character split text reveal
interface SplitRevealProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
}

export function SplitReveal({
  text,
  className = '',
  charClassName = '',
  delay = 0,
  stagger = 0.04,
}: SplitRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-label={text}>
      <div aria-hidden="true">
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            className={`inline-block ${charClassName}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
