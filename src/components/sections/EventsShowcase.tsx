import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularGallery } from '@/components/ui/CircularGallery';
import { EVENTS, EVENT_CATEGORIES } from '@/data/events';
import FogEffect from '@/components/ui/FogEffect';
import { GOOGLE_FORM_URL } from '@/utils/constants';

export default function EventsShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    return activeCategory === 'all'
      ? EVENTS
      : EVENTS.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  // Gallery items formatted for CircularGallery (Instagram 1:1 ratio square posters)
  const galleryItems = useMemo(() => {
    return filteredEvents.map((event) => ({
      image: event.poster || '/posters/Code Red .png',
      title: event.name,
      id: event.id,
      description: event.description,
      category: event.category,
      prize: event.prize,
      icon: event.icon,
    }));
  }, [filteredEvents]);

  const activeEvent = galleryItems[activeIndex] || galleryItems[0];

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveIndex(0);
  };

  const handleRegisterClick = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative min-h-screen py-12 sm:py-20 bg-void overflow-hidden flex flex-col justify-center select-none" id="events">
      {/* Uploaded Atmospheric Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/events-bg.jpg"
          alt="Events Atmosphere Background"
          className="w-full h-full object-cover object-center opacity-90 filter brightness-95 contrast-105"
        />
        {/* Soft Dark Overlay to ensure perfect contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/30 to-void/85" />
        <div className="vignette absolute inset-0" />
      </div>

      {/* Interactive Mouse Hover Fog & Spores Layer */}
      <FogEffect />

      {/* Section Header */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto text-center px-4 sm:px-6 mb-4 sm:mb-6 overflow-hidden">
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-3 sm:mb-4">
          <div className="hidden sm:block flex-1 h-px bg-white/[0.08]" />
          <h2 className="font-display text-xl sm:text-3xl md:text-5xl font-bold tracking-[0.05em] sm:tracking-[0.1em] uppercase drop-shadow-lg text-white">
            THE BATTLE <span className="text-glow">BEGINS</span>
          </h2>
          <div className="hidden sm:block flex-1 h-px bg-white/[0.08]" />
        </div>

        <p className="text-zinc-300 text-[10px] sm:text-xs md:text-sm tracking-wider sm:tracking-[0.2em] uppercase font-light max-w-xl mx-auto mb-6 sm:mb-8 drop-shadow px-2 break-words">
          11 ARENAS • COUNTLESS POSSIBILITIES • CHOOSE WISELY
        </p>

        {/* Category Filter Tabs with Horizontal Scroll on Mobile */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 px-2 gap-2 sm:gap-3 flex-nowrap sm:flex-wrap max-w-full w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 text-[10px] uppercase tracking-wider sm:tracking-[0.2em] rounded-full border transition-all duration-300 font-mono whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-glow border-glow text-white shadow-[0_0_25px_rgba(220,38,38,0.4)] scale-105'
                  : 'border-white/20 text-zinc-300 hover:text-white hover:border-white/40 glass-strong'
              }`}
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* WebGL Circular Bending Gallery Stage */}
      <div className="w-full h-[380px] sm:h-[450px] md:h-[480px] relative my-1 sm:my-2 z-10 flex items-center justify-center">
        <CircularGallery
          key={activeCategory}
          items={galleryItems}
          bend={2.8}
          scrollEase={0.04}
          onActiveIndexChange={setActiveIndex}
        />
      </div>

      {/* Active Event Info & Description Card overlay */}
      {activeEvent && (
        <div className="relative z-20 max-w-2xl mx-auto px-4 w-full mt-2 sm:mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-strong p-4 sm:p-6 rounded-xl border border-glow/30 shadow-[0_0_35px_rgba(220,38,38,0.15)] text-center relative overflow-hidden backdrop-blur-md"
            >
              {/* Subtle top glow bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-glow to-transparent" />

              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <span className="text-xl">{activeEvent.icon}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border border-red-500/40 bg-red-950/30 text-red-400">
                  {activeEvent.category} ARENA
                </span>
                {activeEvent.prize && (
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-950/30 text-amber-400 font-bold">
                    PRIZE: {activeEvent.prize}
                  </span>
                )}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mb-2 drop-shadow">
                {activeEvent.title}
              </h3>

              <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto mb-4 line-clamp-3">
                {activeEvent.description}
              </p>

              <button
                onClick={handleRegisterClick}
                className="px-5 py-2 text-xs font-mono uppercase tracking-[0.2em] font-bold text-white bg-red-600 hover:bg-red-500 border border-red-400 rounded-md transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                onMouseEnter={() => document.body.classList.add('cursor-hover')}
                onMouseLeave={() => document.body.classList.remove('cursor-hover')}
              >
                ENTER ARENA →
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
