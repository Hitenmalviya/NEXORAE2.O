import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS, EVENT_CATEGORIES } from '@/data/events';
import type { Event } from '@/types';
import { GOOGLE_FORM_URL } from '@/utils/constants';

const categoryBadges: Record<string, { label: string; tag: string; border: string; glow: string }> = {
  tech: {
    label: 'TECH PROTOCOL',
    tag: 'SEC-A // HARDWARE & CODE',
    border: 'border-red-900/40 group-hover:border-red-600/70',
    glow: 'from-red-950/30 via-zinc-950/90 to-black/95 shadow-[0_0_30px_rgba(220,38,38,0.1)]',
  },
  design: {
    label: 'CREATIVE VECTOR',
    tag: 'SEC-B // UI/UX & VISUALS',
    border: 'border-purple-900/40 group-hover:border-purple-600/70',
    glow: 'from-purple-950/30 via-slate-950/90 to-black/95 shadow-[0_0_30px_rgba(168,85,247,0.1)]',
  },
  fun: {
    label: 'CHAOS ARENA',
    tag: 'SEC-C // STRATEGY & REACTION',
    border: 'border-emerald-900/40 group-hover:border-emerald-600/70',
    glow: 'from-emerald-950/25 via-zinc-950/90 to-black/95 shadow-[0_0_30px_rgba(16,185,129,0.1)]',
  },
};

const difficultyLabel: Record<string, { text: string; color: string }> = {
  easy: { text: 'LEVEL 01 // BEGINNER', color: 'text-emerald-400/90 border-emerald-500/30 bg-emerald-950/20' },
  medium: { text: 'LEVEL 02 // INTERMEDIATE', color: 'text-amber-400/90 border-amber-500/30 bg-amber-950/20' },
  hard: { text: 'LEVEL 03 // ADVANCED CLEARANCE', color: 'text-red-400/90 border-red-500/30 bg-red-950/20' },
};

function ClassifiedEventCard({
  event,
  index,
  onRegister,
  isFeatured = false,
}: {
  event: any;
  index: number;
  onRegister: (e: any) => void;
  isFeatured?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const categoryConfig = categoryBadges[event.category] || categoryBadges.tech;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const formattedNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => document.body.classList.add('cursor-hover')}
      onMouseLeave={() => document.body.classList.remove('cursor-hover')}
      className={`group relative rounded-lg border bg-gradient-to-b ${categoryConfig.glow} ${categoryConfig.border} transition-all duration-500 flex flex-col justify-between overflow-hidden h-[780px] w-full`}
    >
      {/* Slow red/blue light sweep effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(220,38,38,0.12), transparent 70%)`,
        }}
      />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header Row */}
      <div className="relative z-10 p-4 sm:p-6 pb-3 border-b border-white/[0.06] flex items-start justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
            <span className="font-mono text-xl sm:text-2xl font-black text-red-500/60 group-hover:text-red-500 group-hover:scale-105 transition-all duration-300">
              #{formattedNumber}
            </span>
            <span className="text-lg sm:text-xl">{event.icon}</span>
            {event.difficulty && difficultyLabel[event.difficulty] && (
              <span className={`px-2 py-0.5 text-[8px] sm:text-[9px] uppercase font-mono tracking-widest border rounded ${difficultyLabel[event.difficulty].color}`}>
                {difficultyLabel[event.difficulty].text}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.2em] sm:tracking-[0.25em] text-zinc-500">
            {categoryConfig.tag}
          </span>
        </div>

        <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-widest text-zinc-400 border border-white/10 px-2 py-0.5 sm:py-1 rounded bg-black/40 shrink-0">
          OPEN
        </span>
      </div>

      {/* Event Poster Container - Fixed Poster Height (Zero Cropping) */}
      {event.poster && (
        <div className="relative z-10 w-full h-[350px] shrink-0 overflow-hidden border-b border-white/[0.06] bg-[#090909] flex items-center justify-center">
          <img
            src={event.poster}
            alt={event.name}
            className="w-full h-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-700 brightness-95 contrast-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Main Body */}
      <div className="relative z-10 p-4 sm:p-6 flex-grow flex flex-col justify-between overflow-hidden">
        <div>
          <h3
            className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-zinc-100 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 mb-2 sm:mb-3"
            style={{
              minHeight: '72px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.name}
          </h3>
          <p
            className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed mb-4"
            style={{
              minHeight: '96px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 font-mono text-xs min-h-[52px]">
          {event.team && (
            <div>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-zinc-500 block mb-0.5 sm:mb-1">Squad Size</span>
              <span className="text-zinc-300 text-xs sm:text-sm font-bold">
                {event.team.min === event.team.max
                  ? `${event.team.min} Operative`
                  : `${event.team.min}-${event.team.max} Operatives`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-black/60 border-t border-white/[0.06] flex items-center justify-between gap-2 mt-auto shrink-0">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors truncate">
          SECTOR #{formattedNumber}
        </span>

        {event.hideRegister ? (
          <span className="px-3.5 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-zinc-500 border border-white/10 bg-white/[0.04] rounded select-none shrink-0">
            OPEN FOR ALL
          </span>
        ) : (
          <button
            onClick={() => onRegister(event)}
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-red-400 bg-red-950/40 border border-red-700/50 rounded group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0"
          >
            ENTER ARENA →
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Events() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    document.title = 'Classified Arenas | NEXORAE 2.0';
  }, []);

  const handleRegisterClick = (event: Event) => {
    const url = event.registrationUrl || GOOGLE_FORM_URL;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredEvents = useMemo(() => {
    return activeCategory === 'all'
      ? EVENTS
      : EVENTS.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      {/* CRT Scanline & Subtle Noise Overlay Style */}
      <style>{`
        .crt-scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.3)
          );
          background-size: 100% 4px;
        }
      `}</style>

      {/* Atmospheric Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
        {/* Main Landscape Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 scale-100 filter brightness-110 contrast-105"
          style={{ backgroundImage: 'url("/events-bg.jpg")' }}
        />

        {/* Atmospheric Red (Left) and Blue (Right) Dual Color Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-transparent to-blue-950/30 mix-blend-color-dodge" />

        {/* Dark Top/Bottom Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/75 via-[#050505]/45 to-[#050505]/85" />
        <div className="vignette absolute inset-0" />

        {/* CRT Scanlines Overlay */}
        <div className="crt-scanlines absolute inset-0 opacity-20" />
      </div>

      <motion.main
        className="relative z-10 min-h-screen pt-28 md:pt-36 pb-32 text-zinc-100 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <section className="px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Hero Section */}
            <div className="relative mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-white/10 overflow-hidden">
              {/* Oversized Background Number "11" */}
              <div
                className="absolute -top-6 sm:-top-20 left-0 text-[8rem] xs:text-[12rem] sm:text-[18rem] md:text-[22rem] font-black text-white/[0.03] font-mono leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                11
              </div>

              <div className="relative z-10 max-w-3xl">
                {/* Monospace Eyebrow */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-[9px] sm:text-xs font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-red-500/90 mb-3 sm:mb-4 flex items-center gap-2"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  CLASSIFIED // ALL EVENTS
                </motion.p>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="font-display text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider leading-[0.95] mb-4 sm:mb-6 drop-shadow-2xl"
                >
                  THE ARENA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-red-500">
                    IS OPEN
                  </span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-mono text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.25em] text-zinc-400 uppercase font-light leading-relaxed max-w-lg"
                >
                  11 challenges. 1 dimension. No way back.
                </motion.p>
              </div>

              {/* System Stats Bar */}
              <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4 font-mono text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">SYSTEM LOG:</span>
                  <span>11 ACTIVE ARENAS DETECTED</span>
                </div>
              </div>
            </div>

            {/* Fictional System Interface Filters */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 flex-nowrap sm:flex-wrap mb-8 sm:mb-12 max-w-full"
            >
              {EVENT_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const filterLabels: Record<string, string> = {
                  all: '[ ALL SIGNALS ]',
                  tech: '[ TECH PROTOCOLS ]',
                  design: '[ CREATIVE VECTORS ]',
                  fun: '[ CHAOS ARENA ]',
                };

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.25em] rounded transition-all duration-300 shrink-0 whitespace-nowrap ${isActive
                        ? 'bg-red-950/40 border border-red-600/80 text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.25)] scale-105'
                        : 'bg-black/40 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                      }`}
                    onMouseEnter={() => document.body.classList.add('cursor-hover')}
                    onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                  >
                    {filterLabels[cat.id] || `[ ${cat.label.toUpperCase()} ]`}
                  </button>
                );
              })}
            </motion.div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <ClassifiedEventCard
                  key={event.id}
                  event={event}
                  index={i}
                  isFeatured={i === 0 && activeCategory === 'all'}
                  onRegister={handleRegisterClick}
                />
              ))}
            </div>
          </div>
        </section>
      </motion.main>
    </>
  );
}
