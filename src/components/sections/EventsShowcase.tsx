import { useState, useMemo } from 'react';
import { CircularGallery } from '@/components/ui/CircularGallery';
import { EVENTS, EVENT_CATEGORIES } from '@/data/events';
import FogEffect from '@/components/ui/FogEffect';

export default function EventsShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    return activeCategory === 'all'
      ? EVENTS
      : EVENTS.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  // Gallery items formatted for CircularGallery (Instagram 1:1 ratio square posters)
  const galleryItems = useMemo(() => {
    return filteredEvents.map((event) => ({
      image: event.poster || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
      title: event.name,
      id: event.id,
    }));
  }, [filteredEvents]);

  return (
    <section className="relative min-h-screen py-20 bg-void overflow-hidden flex flex-col justify-center select-none" id="events">
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
      <div className="relative z-10 max-w-[1400px] mx-auto text-center px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-6 mb-4">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.1em] uppercase drop-shadow-lg">
            THE BATTLE <span className="text-glow">BEGINS</span>
          </h2>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>
        <p className="text-zinc-300 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light max-w-xl mx-auto mb-6 sm:mb-8 drop-shadow">
          12 ARENAS • COUNTLESS POSSIBILITIES • CHOOSE WISELY
        </p>

        {/* Category Filter Tabs with Horizontal Scroll on Mobile */}
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2 px-2 gap-2 sm:gap-3 flex-nowrap sm:flex-wrap max-w-full">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] rounded-full border transition-all duration-300 font-mono whitespace-nowrap shrink-0 ${
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
      <div className="w-full h-[450px] sm:h-[500px] md:h-[600px] relative my-2 sm:my-4 z-10 flex items-center justify-center">
        <CircularGallery
          key={activeCategory}
          items={galleryItems}
          bend={2.8}
          scrollEase={0.04}
        />
      </div>
    </section>
  );
}
