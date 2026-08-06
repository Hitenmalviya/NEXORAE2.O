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
      team: event.team,
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
    <section className="relative min-h-screen py-16 sm:py-24 bg-void overflow-hidden flex flex-col items-center justify-center select-none" id="events">
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

      {/* Unified Apple VisionOS Glass Showcase Window */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2rem] sm:rounded-[3rem] border border-white/15 bg-[#0a0a0d]/70 backdrop-blur-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(220,38,38,0.12)] overflow-hidden transition-all duration-700 p-6 sm:p-10 md:p-12 border-t-white/25">
          
          {/* Internal Glass Highlight Sweep */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/40 pointer-events-none" />

          {/* Dynamic Category Ambient Light Glow (Red / Purple / Emerald) */}
          <div
            className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 opacity-40 ${
              activeEvent?.category === 'tech'
                ? 'bg-red-600'
                : activeEvent?.category === 'design'
                ? 'bg-purple-600'
                : 'bg-emerald-600'
            }`}
          />

          {/* Card Header & Category Filter Pills */}
          <div className="relative z-10 text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              ARENA SHOWCASE // CLASSIFIED
            </div>

            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white drop-shadow-2xl mb-4">
              THE BATTLE <span className="text-glow">BEGINS</span>
            </h2>

            {/* Category Pills inside Glass Container */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] uppercase font-mono tracking-[0.2em] rounded-full border transition-all duration-300 backdrop-blur-xl ${
                    activeCategory === cat.id
                      ? 'bg-red-600/80 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] scale-105'
                      : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                  }`}
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive WebGL Circular Gallery Carousel (Top Section of Glass Container) */}
          <div className="w-full h-[320px] sm:h-[380px] md:h-[420px] relative my-2 z-10 flex items-center justify-center">
            <CircularGallery
              key={activeCategory}
              items={galleryItems}
              bend={2.5}
              scrollEase={0.04}
              onActiveIndexChange={setActiveIndex}
            />
          </div>

          {/* Apple Glass Separator Line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-6 sm:my-8" />

          {/* Information Section (Bottom Section of Glass Container) */}
          {activeEvent && (
            <div className="relative z-20 text-center max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEvent.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Event Title */}
                  <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mb-4 drop-shadow-2xl">
                    {activeEvent.title}
                  </h3>

                  {/* Floating Glass Metadata Chips */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap font-mono text-[10px] sm:text-xs">
                    <span className="px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-red-400 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] tracking-wider font-semibold">
                      {activeEvent.icon} {activeEvent.category.toUpperCase()} ARENA
                    </span>

                    {activeEvent.prize && (
                      <span className="px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-amber-400 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] tracking-wider font-semibold">
                        🏆 {activeEvent.prize} PRIZE
                      </span>
                    )}

                    <span className="px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] tracking-wider font-semibold">
                      👥 {activeEvent.team ? `${activeEvent.team.min}-${activeEvent.team.max}` : '1-4'} OPERATIVES
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-300 text-xs sm:text-base font-light leading-relaxed max-w-2xl mx-auto mb-8 tracking-wide">
                    {activeEvent.description}
                  </p>

                  {/* Apple-Inspired VisionOS Glass CTA Button */}
                  <button
                    onClick={handleRegisterClick}
                    className="px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-white bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:brightness-125 border border-red-400/60 shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 backdrop-blur-xl inline-flex items-center justify-center gap-2 group"
                    onMouseEnter={() => document.body.classList.add('cursor-hover')}
                    onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                  >
                    ENTER ARENA
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
