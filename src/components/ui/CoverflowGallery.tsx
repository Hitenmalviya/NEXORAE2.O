import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';


export interface CoverflowItem {
  id: string;
  image: string;
  title: string;
  category: string;
  prize?: string;
  description: string;
  icon?: string;
  team?: { min: number; max: number };
  registrationUrl?: string;
  hideRegister?: boolean;
}

interface CoverflowGalleryProps {
  items: CoverflowItem[];
  onRegister: (item: CoverflowItem) => void;
  className?: string;
}

export function CoverflowGallery({ items, onRegister, className = '' }: CoverflowGalleryProps) {
  // Continuous floating-point position (fractional index into items array)
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const total = items.length;

  // Drag state refs (avoid re-renders during drag)
  const dragState = useRef({
    startX: 0,
    startPosition: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    isActive: false,
    hasMoved: false,
  });

  // Animation frame ref for momentum
  const momentumRaf = useRef<number>(0);

  // Card width used for drag-to-index conversion
  const getCardWidth = useCallback(() => {
    return window.innerWidth < 640 ? 300 : 400;
  }, []);

  // Wrap position into [0, total) range
  const wrapPosition = useCallback((pos: number): number => {
    const wrapped = ((pos % total) + total) % total;
    return wrapped;
  }, [total]);

  // Get the snapped (nearest integer) index
  const getSnappedIndex = useCallback((pos: number): number => {
    return Math.round(wrapPosition(pos));
  }, [wrapPosition]);

  // Animate to nearest card with spring-like easing
  const snapToNearest = useCallback((fromPos: number, initialVelocity: number = 0) => {
    cancelAnimationFrame(momentumRaf.current);

    // Project forward based on velocity to determine target
    const projection = fromPos + initialVelocity * 0.3;
    const targetIndex = Math.round(projection);

    let current = fromPos;
    let velocity = initialVelocity;
    const stiffness = 0.08;
    const damping = 0.78;

    const animate = () => {
      const displacement = targetIndex - current;
      const springForce = displacement * stiffness;
      velocity = (velocity + springForce) * damping;
      current += velocity;

      // Settle when close enough
      if (Math.abs(displacement) < 0.002 && Math.abs(velocity) < 0.001) {
        setPosition(wrapPosition(targetIndex));
        return;
      }

      setPosition(current);
      momentumRaf.current = requestAnimationFrame(animate);
    };

    momentumRaf.current = requestAnimationFrame(animate);
  }, [wrapPosition]);

  // Navigate functions
  const handleNext = useCallback(() => {
    cancelAnimationFrame(momentumRaf.current);
    const currentSnapped = getSnappedIndex(position);
    snapToNearest(position, 0);
    // Override: animate from current to next
    const target = currentSnapped + 1;
    let current = position;
    let vel = 0;
    const stiff = 0.1;
    const damp = 0.75;

    const anim = () => {
      const disp = target - current;
      vel = (vel + disp * stiff) * damp;
      current += vel;
      if (Math.abs(disp) < 0.002 && Math.abs(vel) < 0.001) {
        setPosition(wrapPosition(target));
        return;
      }
      setPosition(current);
      momentumRaf.current = requestAnimationFrame(anim);
    };
    cancelAnimationFrame(momentumRaf.current);
    momentumRaf.current = requestAnimationFrame(anim);
  }, [position, getSnappedIndex, wrapPosition]);

  const handlePrev = useCallback(() => {
    cancelAnimationFrame(momentumRaf.current);
    const currentSnapped = getSnappedIndex(position);
    const target = currentSnapped - 1;
    let current = position;
    let vel = 0;
    const stiff = 0.1;
    const damp = 0.75;

    const anim = () => {
      const disp = target - current;
      vel = (vel + disp * stiff) * damp;
      current += vel;
      if (Math.abs(disp) < 0.002 && Math.abs(vel) < 0.001) {
        setPosition(wrapPosition(target));
        return;
      }
      setPosition(current);
      momentumRaf.current = requestAnimationFrame(anim);
    };
    cancelAnimationFrame(momentumRaf.current);
    momentumRaf.current = requestAnimationFrame(anim);
  }, [position, getSnappedIndex, wrapPosition]);

  // Click-to-center a side card
  const handleCardClick = useCallback((index: number) => {
    if (dragState.current.hasMoved) return;

    cancelAnimationFrame(momentumRaf.current);
    const currentSnapped = getSnappedIndex(position);

    // Find shortest circular distance
    let diff = index - (currentSnapped % total);
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const target = currentSnapped + diff;
    let current = position;
    let vel = 0;
    const stiff = 0.1;
    const damp = 0.75;

    const anim = () => {
      const disp = target - current;
      vel = (vel + disp * stiff) * damp;
      current += vel;
      if (Math.abs(disp) < 0.002 && Math.abs(vel) < 0.001) {
        setPosition(wrapPosition(target));
        return;
      }
      setPosition(current);
      momentumRaf.current = requestAnimationFrame(anim);
    };
    momentumRaf.current = requestAnimationFrame(anim);
  }, [position, total, getSnappedIndex, wrapPosition]);

  // ─── Pointer (Touch + Mouse) Drag Handling ───
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore if clicking a button or link
    if ((e.target as HTMLElement).closest('button, a')) return;

    cancelAnimationFrame(momentumRaf.current);
    const ds = dragState.current;
    ds.startX = e.clientX;
    ds.startPosition = position;
    ds.lastX = e.clientX;
    ds.lastTime = performance.now();
    ds.velocity = 0;
    ds.isActive = true;
    ds.hasMoved = false;

    setIsDragging(true);

    // Capture pointer for smooth tracking even outside element
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [position]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds.isActive) return;

    const now = performance.now();
    const dx = e.clientX - ds.lastX;
    const dt = Math.max(1, now - ds.lastTime);

    // Track velocity (smoothed)
    ds.velocity = ds.velocity * 0.6 + (dx / dt) * 0.4;
    ds.lastX = e.clientX;
    ds.lastTime = now;

    const totalDx = e.clientX - ds.startX;

    if (Math.abs(totalDx) > 5) {
      ds.hasMoved = true;
    }

    // Convert pixel drag to fractional index offset
    const cardW = getCardWidth();
    const indexOffset = -totalDx / cardW;
    setPosition(ds.startPosition + indexOffset);
  }, [getCardWidth]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds.isActive) return;

    ds.isActive = false;
    setIsDragging(false);

    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    // Convert pixel velocity to index velocity (negative because drag direction is inverted)
    const cardW = getCardWidth();
    const indexVelocity = -(ds.velocity * 16) / cardW; // Scale to ~per-frame

    snapToNearest(position, indexVelocity);
  }, [position, getCardWidth, snapToNearest]);

  // ─── Keyboard navigation ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(momentumRaf.current);
  }, []);

  if (!items || items.length === 0) return null;

  // Current active index (nearest integer)
  const activeIndex = ((Math.round(position) % total) + total) % total;
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
      <div
        ref={stageRef}
        className="relative w-full max-w-6xl h-[510px] sm:h-[560px] md:h-[600px] flex items-center justify-center [perspective:1200px] touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {items.map((item, index) => {
          // Circular offset: find shortest distance from current position to this index
          let diff = index - position;
          // Normalize into [-total/2, total/2] for infinite wrapping
          diff = ((diff % total) + total + total / 2) % total - total / 2;

          const absDiff = Math.abs(diff);

          // Render only visible spread range
          if (absDiff > 3) return null;

          const isActive = absDiff < 0.5;

          // Smooth interpolated 3D transforms
          const scale = 1 - absDiff * 0.15; // active=1, side≈0.85
          const rotateY = diff * -25; // Perspective rotation proportional to offset
          const cardSpacing = window.innerWidth < 640 ? 200 : 280;
          const translateX = diff * cardSpacing;
          const translateZ = -absDiff * 120;
          const translateY = absDiff * 20 - (isActive ? 12 : 0);
          const opacity = Math.max(0.3, 1 - absDiff * 0.3);
          const zIndex = 30 - Math.round(absDiff * 10);
          const filterBlur = `blur(${Math.min(absDiff * 1.5, 3)}px)`;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleCardClick(index)}
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
              transition={
                isDragging
                  ? { type: 'tween', duration: 0.05, ease: 'linear' }
                  : { type: 'spring', stiffness: 280, damping: 26, mass: 0.7 }
              }
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
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
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Content Section */}
              <div className="relative z-20 p-5 sm:p-6 text-center flex flex-col justify-between">
                <div>
                  {/* Event Title */}
                  <h3 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider text-white mb-2 line-clamp-1 drop-shadow-md">
                    {item.title}
                  </h3>

                  {/* Event Description */}
                  <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed mb-5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* CTA Button / Status Badge */}
                {item.hideRegister ? (
                  <div
                    className="w-full py-2.5 sm:py-3 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 bg-white/[0.04] border border-white/10 select-none text-center"
                  >
                    OPEN FOR ALL
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegister(item);
                    }}
                    className={`w-full py-2.5 sm:py-3 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] block text-center ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:brightness-125 border border-red-400/60 shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98] cursor-hover'
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    }`}
                    onMouseEnter={() => document.body.classList.add('cursor-hover')}
                    onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                  >
                    ENTER ARENA →
                  </button>
                )}
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
