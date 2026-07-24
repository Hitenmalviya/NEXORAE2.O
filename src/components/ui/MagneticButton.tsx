import { useRef, type ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useIsTouch } from '@/hooks/useMediaQuery';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isTouch = useIsTouch();

  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => document.body.classList.add('cursor-hover')}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// Magnetic anchor variant
interface MagneticLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
  strength?: number;
  target?: string;
  rel?: string;
}

export function MagneticLink({
  children,
  className = '',
  href,
  strength = 0.3,
  target,
  rel,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isTouch = useIsTouch();

  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => document.body.classList.add('cursor-hover')}
      target={target}
      rel={rel}
    >
      {children}
    </motion.a>
  );
}
