import { useState, useMemo } from 'react';
import { CoverflowGallery, type CoverflowItem } from '@/components/ui/CoverflowGallery';
import { EVENTS, EVENT_CATEGORIES } from '@/data/events';
import FogEffect from '@/components/ui/FogEffect';
import { GOOGLE_FORM_URL } from '@/utils/constants';

export default function EventsShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    return activeCategory === 'all'
      ? EVENTS
      : EVENTS.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  // Format events into CoverflowItem objects
  const coverflowItems: CoverflowItem[] = useMemo(() => {
    return filteredEvents.map((event) => ({
      id: event.id,
      image: event.poster || '/posters/Code Red .png',
      title: event.name,
      category: event.category,
      prize: event.prize,
      description: event.description,
      icon: event.icon,
      team: event.team,
      registrationUrl: event.registrationUrl,
      hideRegister: event.hideRegister,
    }));
  }, [filteredEvents]);

  const handleRegisterClick = (item: CoverflowItem) => {
    const url = item.registrationUrl || GOOGLE_FORM_URL;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative min-h-screen py-16 sm:py-24 bg-void overflow-hidden flex flex-col items-center justify-center select-none" id="events">
      {/* Atmospheric Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/events-bg.jpg"
          alt="Events Atmosphere Background"
          className="w-full h-full object-cover object-center opacity-90 filter brightness-95 contrast-105"
        />
        {/* Soft Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/30 to-void/85" />
        <div className="vignette absolute inset-0" />
      </div>

      {/* Interactive Mouse Hover Fog Layer */}
      <FogEffect />

      {/* Section Header & Category Filters */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4 sm:px-6 mb-2 sm:mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 mb-3 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          CLASSIFIED ARENAS // 3D COVERFLOW
        </div>

        <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-wider text-white drop-shadow-2xl mb-4">
          THE BATTLE <span className="text-glow">BEGINS</span>
        </h2>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
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

      {/* Interactive 3D Glass Coverflow Carousel Stage */}
      <div className="relative z-10 w-full">
        <CoverflowGallery
          key={activeCategory}
          items={coverflowItems}
          onRegister={handleRegisterClick}
        />
      </div>
    </section>
  );
}
