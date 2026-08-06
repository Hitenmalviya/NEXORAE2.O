import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TimelineItem {
  id: string;
  day: 'Day 1' | 'Day 2' | 'Day 3';
  date: string;
  time: string;
  title: string;
  organizer?: string;
  category: 'Registration' | 'Tech' | 'Design' | 'Fun';
  description: string;
  venue?: string;
  status: 'completed' | 'current' | 'upcoming';
}

const TIMELINE_DATA: TimelineItem[] = [
  // DAY 1: 15 SEPTEMBER
  {
    id: 't-1',
    day: 'Day 1',
    date: '15 September',
    time: '10:00 to 11:00',
    title: 'Inauguration',
    category: 'Registration',
    organizer: 'NEXORAE Core',
    description: 'Official opening ceremony of NEXORAE 2.0. Unveiling the portal, keynotes, and grand festival kickoff.',
    venue: 'Main Auditorium',
    status: 'upcoming',
  },
  {
    id: 't-2',
    day: 'Day 1',
    date: '15 September',
    time: '11:00 to 12:30',
    title: "Mind Flayer's Maze",
    category: 'Tech',
    organizer: 'RAS',
    description: 'Build an autonomous robot and navigate a maze filled with twists, turns, and unexpected challenges.',
    venue: 'Foyer',
    status: 'upcoming',
  },
  {
    id: 't-3',
    day: 'Day 1',
    date: '15 September',
    time: '11:00 to 1:00',
    title: "Founder's Circle",
    category: 'Design',
    organizer: 'WIE',
    description: 'Hear directly from founders as they discuss entrepreneurship, innovation, and the realities of building a startup.',
    venue: 'Audi',
    status: 'upcoming',
  },
  {
    id: 't-4',
    day: 'Day 1',
    date: '15 September',
    time: '2:00 to 4:30',
    title: 'Hawkins Havoc',
    category: 'Fun',
    organizer: 'IASPES',
    description: 'Take on fun mini-games while Chaos Cards introduce twists like blindfolds, no talking, or reversed instructions.',
    venue: 'Seminar',
    status: 'upcoming',
  },
  {
    id: 't-5',
    day: 'Day 1',
    date: '15 September',
    time: '2:00 to 5:00',
    title: 'The Upside Down',
    category: 'Fun',
    organizer: 'CS & SPS',
    description: 'A logic-based treasure hunt with puzzles, clues, and campus challenges. Decode, explore, and sprint across campus.',
    venue: 'Audi',
    status: 'upcoming',
  },
  {
    id: 't-6',
    day: 'Day 1',
    date: '15 September',
    time: '5:00 to 8:00',
    title: 'Street Lit',
    category: 'Fun',
    organizer: 'Cultural Society',
    description: 'Electrifying street performances, live musical showcases, dance battles, and high-energy cultural vibes.',
    venue: 'Open Amphitheatre',
    status: 'upcoming',
  },

  // DAY 2: 16 SEPTEMBER
  {
    id: 't-7',
    day: 'Day 2',
    date: '16 September',
    time: '10:00 to 1:00',
    title: 'Code Red',
    category: 'Tech',
    organizer: 'CS',
    description: 'Put your coding skills to the test through technical quizzes, debugging rounds, and competitive programming.',
    venue: 'Seminar',
    status: 'upcoming',
  },
  {
    id: 't-8',
    day: 'Day 2',
    date: '16 September',
    time: '10:00 to 1:00',
    title: 'Operation: Fragile Gate',
    category: 'Tech',
    organizer: 'RAS',
    description: 'Engineering drop challenge by building protective shields to save raw egg payloads from multi-floor drops.',
    venue: 'Parking and ground',
    status: 'upcoming',
  },
  {
    id: 't-9',
    day: 'Day 2',
    date: '16 September',
    time: '2:00 to 5:00',
    title: 'Demogrounds',
    category: 'Fun',
    organizer: 'SPS',
    description: 'Battle across a high-intensity esports league, earning points through eliminations and placement matches.',
    venue: 'Labs',
    status: 'upcoming',
  },
  {
    id: 't-10',
    day: 'Day 2',
    date: '16 September',
    time: '2:00 to 5:00',
    title: 'Mind and Muscle',
    category: 'Fun',
    organizer: 'SIGHT',
    description: 'A perfect blend of brains, strength, and physical endurance. Solve challenges and power through obstacles.',
    venue: 'Front lawn',
    status: 'upcoming',
  },
  {
    id: 't-11',
    day: 'Day 2',
    date: '16 September',
    time: '5:00 to 8:00',
    title: 'Cultural Night',
    category: 'Fun',
    organizer: 'Cultural Society',
    description: 'An unforgettable evening of stage acts, music, dance performances, and star entertainment.',
    venue: 'Main Stage',
    status: 'upcoming',
  },

  // DAY 3: 17 SEPTEMBER
  {
    id: 't-12',
    day: 'Day 3',
    date: '17 September',
    time: '10:00 to 1:00',
    title: 'The Traitors',
    category: 'Fun',
    organizer: 'IASPES',
    description: 'A thrilling game of trust, strategy, and deception. Complete missions, expose hidden Traitors and outsmart opponents.',
    venue: 'Audi',
    status: 'upcoming',
  },
  {
    id: 't-13',
    day: 'Day 3',
    date: '17 September',
    time: '10:00 to 1:00',
    title: 'Demogrounds',
    category: 'Fun',
    organizer: 'SPS',
    description: 'The final esports battleground stage where qualifying top teams compete for the ultimate championship title.',
    venue: 'Labs',
    status: 'upcoming',
  },
  {
    id: 't-14',
    day: 'Day 3',
    date: '17 September',
    time: '11:30 to 1:00',
    title: 'PitchFrame',
    category: 'Design',
    organizer: 'WIE',
    description: 'Creative Pitch Reel Challenge blending visual storytelling with innovation in an exciting showcase.',
    venue: 'Seminar',
    status: 'upcoming',
  },
  {
    id: 't-15',
    day: 'Day 3',
    date: '17 September',
    time: '2:00 to 5:00',
    title: 'Escape Room',
    category: 'Fun',
    organizer: 'SIGHT',
    description: 'Follow clues, solve mind-bending puzzles, and combine logic, speed and teamwork to escape before time runs out.',
    venue: 'A323 classroom',
    status: 'upcoming',
  },
  {
    id: 't-16',
    day: 'Day 3',
    date: '17 September',
    time: '7:00 to 11:00',
    title: 'Sahiyaro',
    category: 'Fun',
    organizer: 'NEXORAE Finale',
    description: 'Grand finale Garba, DJ night & celebration bringing NEXORAE 2.0 to an unforgettable close.',
    venue: 'Festival Grounds',
    status: 'upcoming',
  },
];

const categoryColors: Record<string, string> = {
  Registration: 'text-glow border-glow/40 bg-glow/10',
  Tech: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  Design: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  Fun: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
};

const DAY_OPTIONS = [
  { id: 'ALL', label: 'All Days', date: '15-17 Sept' },
  { id: 'Day 1', label: 'Day 1', date: '15 Sept' },
  { id: 'Day 2', label: 'Day 2', date: '16 Sept' },
  { id: 'Day 3', label: 'Day 3', date: '17 Sept' },
];

export default function Timeline() {
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  // Filter items by active Day tab
  const filteredTimeline = useMemo(() => {
    if (selectedDay === 'ALL') return TIMELINE_DATA;
    return TIMELINE_DATA.filter((item) => item.day === selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    document.title = 'Event Schedule & Timeline | NEXORAE 2.0';
  }, []);

  return (
    <div className="relative min-h-screen bg-void pt-28 sm:pt-36 pb-20 sm:pb-32 overflow-hidden select-none" id="timeline-page">
      {/* Stranger Things Atmospheric Background Image Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 filter brightness-90 contrast-105"
          style={{ backgroundImage: 'url("/timeline-bg.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/50 to-void/90" />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full border border-glow/30 bg-glow/10 text-glow text-[10px] sm:text-xs tracking-[0.3em] uppercase font-mono mb-4 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse" />
            15 - 17 SEPTEMBER SCHEDULE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-black text-[clamp(2.2rem,8vw,5.5rem)] uppercase tracking-[0.06em] leading-[0.95] mb-4 sm:mb-6 select-none"
            style={{
              fontFamily: "'ITC Benguiat', 'Cinzel Decorative', 'Playfair Display', serif",
            }}
          >
            <span className="text-white drop-shadow-md">EVENT </span>
            <span
              className="text-glow-bright"
              style={{
                WebkitTextStroke: '1.5px #dc2626',
                textShadow: '0 0 30px #dc2626, 0 0 70px rgba(220,38,38,0.7), 0 0 110px rgba(220,38,38,0.3)',
              }}
            >
              TIMELINE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-base text-muted tracking-[0.15em] uppercase font-light max-w-xl mx-auto px-2"
          >
            16 Thrilling Events across 3 Days of Innovation, Strategy & Chaos
          </motion.p>
        </div>

        {/* Day Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center items-center gap-2 sm:gap-4 mb-12 sm:mb-16 flex-wrap"
        >
          {DAY_OPTIONS.map((tab) => {
            const isActive = selectedDay === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDay(tab.id)}
                className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm tracking-wider transition-all duration-300 flex flex-col items-center border ${isActive
                  ? 'bg-glow/20 border-glow text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                  : 'bg-surface/60 border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-surface'
                  }`}
              >
                <span className="font-bold uppercase tracking-widest">{tab.label}</span>
                <span className="text-[10px] text-muted tracking-normal mt-0.5">{tab.date}</span>
                {isActive && (
                  <motion.div
                    layoutId="dayTabIndicator"
                    className="absolute inset-0 rounded-xl border border-glow shadow-[inset_0_0_12px_rgba(220,38,38,0.3)] pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Timeline Axis & Cards Container */}
        <div className="relative my-6 sm:my-10">
          {/* Vertical Timeline Axis Line (Desktop: Center 50%, Mobile: Left 24px) */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/10 rounded-full">
            {/* Illuminated Red Line */}
            <div
              className="w-full h-full bg-gradient-to-b from-glow via-glow-bright to-glow shadow-[0_0_15px_#dc2626]"
            />
          </div>

          {/* Timeline Items List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-16"
            >
              {filteredTimeline.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                  >
                    {/* Timeline Central Node Marker */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-glow-bright border-2 border-glow shadow-[0_0_20px_#ef4444] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                      </div>
                    </div>

                    {/* Horizontal Branch Line connecting node on Mobile */}
                    <div className="md:hidden absolute left-6 top-1/2 w-6 h-[1px] bg-gradient-to-r from-glow/60 to-white/10 -translate-y-1/2 pointer-events-none z-10" />

                    {/* Card Container */}
                    <div
                      className={`w-full pl-14 sm:pl-16 md:pl-0 md:w-[46%] ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                        }`}
                    >
                      <div className="glass-strong p-5 sm:p-7 rounded-xl sm:rounded-2xl border border-white/10 hover:border-glow/50 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.6)] group relative overflow-hidden">
                        {/* Glow accent corner on hover */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-glow/10 rounded-full blur-xl group-hover:bg-glow/25 transition-all duration-500 pointer-events-none" />

                        {/* Top Header Row */}
                        <div
                          className={`flex items-center gap-2 sm:gap-2.5 mb-3 flex-wrap ${isLeft ? 'md:justify-end' : 'md:justify-start'
                            }`}
                        >
                          <span className="px-2 py-0.5 rounded bg-glow/20 border border-glow/30 text-[10px] font-mono tracking-wider text-glow-bright font-bold uppercase">
                            {item.day} · {item.date}
                          </span>

                          <span className="text-[11px] font-mono tracking-wider text-white font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            ⏰ {item.time}
                          </span>

                          <span
                            className={`px-2 sm:px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-mono rounded-full border ${categoryColors[item.category]}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        {/* Title & Organizer Tag */}
                        <div className="mb-2 sm:mb-3">
                          <h3 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider text-white group-hover:text-glow-bright transition-colors duration-300">
                            {item.title}
                          </h3>
                          {item.organizer && (
                            <div
                              className={`text-xs font-mono text-glow/90 mt-0.5 tracking-wider font-semibold ${isLeft ? 'md:text-right' : 'md:text-left'
                                }`}
                            >
                              Organized by: <span className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px]">{item.organizer}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-muted text-xs sm:text-sm font-light leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Footer Info Row */}
                        <div
                          className={`flex items-center gap-4 pt-3 border-t border-white/10 text-[11px] font-mono text-dim flex-wrap ${isLeft ? 'md:justify-end' : 'md:justify-start'
                            }`}
                        >
                          {item.venue && (
                            <span className="flex items-center gap-1 text-white/80 font-medium">
                              📍 {item.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

