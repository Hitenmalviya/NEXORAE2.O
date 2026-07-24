import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', glowOnHover = true, onClick }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass rounded-xl relative overflow-hidden transition-all duration-500 ${
        glowOnHover && isHovered ? 'border-white/10' : ''
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        document.body.classList.add('cursor-hover');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        document.body.classList.remove('cursor-hover');
      }}
      onClick={onClick}
      whileHover={glowOnHover ? { y: -2 } : {}}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Mouse-tracked spotlight */}
      {glowOnHover && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(220,38,38,0.05), transparent 60%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
