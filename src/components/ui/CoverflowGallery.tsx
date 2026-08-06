import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CoverflowItem {
  id: string;
  image: string;
  title: string;
  category: string;
  prize?: string;
  description: string;
  icon?: string;
  team?: { min: number; max: number };
}

interface CoverflowGalleryProps {
  items: CoverflowItem[];
  onRegister: (item: CoverflowItem) => void;
  className?: string;
}

export function CoverflowGallery({ items, onRegister, className = '' }: CoverflowGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = items.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  if (!items || items.length === 0) return null;

  const activeItem = items[activeIndex] || items[0];

  // Dynamic ambient category glow
  const categoryGlowColors: Record<string, string> = {
    tech: 'rgba(220, 38, 38, 0.3)',
    design: 'rgba(168, 85, 247, 0.3)',
    fun: 'rgba(16, 185, 129, 0.3)',
  };

  const activeGlow = categoryGlowColors[activeItem.category] || categoryGlowColors.tech;

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-8 sm:py-12 overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Background Dynamic Ambient Color Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-60"
        style={{ background: activeGlow }}
      />

      {/* 3D Coverflow Perspective Stage */}
      <div className="relative w-full max-w-6xl h-[560px] sm:h-[620px] md:h-[660px] flex items-center justify-center [perspective:1200px]">
        {items.map((item, index) => {
          // Circular offset calculation
          let diff = (index - activeIndex) % total;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isActive = diff === 0;
          const absDiff = Math.abs(diff);

          // Render only visible spread range (-2 to +2)
          if (absDiff > 3) return null;

          // 3D Coverflow Transforms
          const scale = isActive ? 1 : 0.78;
          const rotateY = isActive ? 0 : diff < 0 ? 32 : -32;
          const translateX = isActive ? 0 : diff * (window.innerWidth < 640 ? 170 : 250);
          const translateZ = isActive ? 40 : -140;
          const translateY = isActive ? -12 : 16;
          const opacity = isActive ? 1 : Math.max(0.35, 0.7 - absDiff * 0.2);
          const zIndex = 30 - absDiff;
          const filterBlur = isActive ? 'blur(0px)' : 'blur(2px)';

          return (
            <motion.div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              initial={false}
              animate={{
                scale,
                rotateY,
                x: translateX,
                z: translateZ,
                y: translateY,
                opacity,
                filter: filterBlur,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }}
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              className={`absolute top-0 w-[290px] xs:w-[320px] sm:w-[370px] md:w-[400px] cursor-pointer rounded-[2rem] border border-white/15 bg-[#0c0c10]/85 backdrop-blur-[32px] overflow-hidden transition-shadow duration-500 ${
                isActive
                  ? 'shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(220,38,38,0.25)] border-t-white/30'
                  : 'shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-white/30'
              }`}
            >
              {/* Internal Glass Reflection Highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/50 pointer-events-none z-10" />

              {/* Poster Container - Full 1:1 Instagram Ratio (Never Cropped) */}
              <div className="relative w-full aspect-square overflow-hidden bg-black/80 border-b border-white/10 flex items-center justify-center p-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain object-center rounded-xl transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Content Section */}
              <div className="relative z-20 p-5 sm:p-6 text-center flex flex-col justify-between">
                <div>
                  {/* Event Title */}
                  <h3 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider text-white mb-3 line-clamp-1 drop-shadow-md">
                    {item.title}
                  </h3>

                  {/* Floating Glass Metadata Chips */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 flex-wrap font-mono text-[9px] sm:text-[10px]">
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-red-400 backdrop-blur-md shadow-sm font-semibold">
                      ⚡ {item.category.toUpperCase()}
                    </span>

                    {item.prize && (
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-amber-400 backdrop-blur-md shadow-sm font-semibold">
                        🏆 {item.prize}
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 backdrop-blur-md shadow-sm font-semibold">
                      👥 {item.team ? `${item.team.min}-${item.team.max}` : '1-4'}
                    </span>
                  </div>

                  {/* Event Description */}
                  <p className="text-zinc-300 text-xs font-light leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegister(item);
                  }}
                  className={`w-full py-2.5 sm:py-3 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:brightness-125 border border-red-400/60 shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  ENTER ARENA →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Glass Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6 z-30">
        <button
          onClick={handlePrev}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/15 text-white backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95"
          aria-label="Previous Slide"
          onMouseEnter={() => document.body.classList.add('cursor-hover')}
          onMouseLeave={() => document.body.classList.remove('cursor-hover')}
        >
          ◀
        </button>

        <span className="font-mono text-xs text-zinc-400 tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        <button
          onClick={handleNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/15 text-white backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95"
          aria-label="Next Slide"
          onMouseEnter={() => document.body.classList.add('cursor-hover')}
          onMouseLeave={() => document.body.classList.remove('cursor-hover')}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
