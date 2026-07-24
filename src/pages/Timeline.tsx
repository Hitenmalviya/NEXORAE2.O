import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface TimelineItem {
  id: string;
  phase: string;
  time: string;
  title: string;
  category: 'Registration' | 'Tech' | 'Design' | 'Fun';
  description: string;
  venue?: string;
  prize?: string;
  status: 'completed' | 'current' | 'upcoming';
}

const TIMELINE_DATA: TimelineItem[] = [
  // PHASE 1: Portal Opening
  {
    id: 't-1',
    phase: 'PHASE 1',
    time: 'Pre-Event Phase',
    title: 'Registration & Identity Creation',
    category: 'Registration',
    description: 'Online registration goes live. Claim your unique NEXORAE ID and lock in IEEE member discounts.',
    venue: 'nexorae.in/register',
    status: 'completed',
  },
  {
    id: 't-2',
    phase: 'PHASE 1',
    time: 'Pre-Event Phase',
    title: 'Preparatory Bootcamps & Briefings',
    category: 'Registration',
    description: 'Exclusive strategy and tech prep sessions for registered participants across competitive coding and design.',
    venue: 'Online Stream & GCET Labs',
    status: 'current',
  },
  // DAY 1: Tech Showdown (4 Events)
  {
    id: 't-3',
    phase: 'DAY 1',
    time: '10:00 AM · Tech Event 01',
    title: 'Code Siege',
    category: 'Tech',
    description: 'The ultimate competitive coding arena. Solve complex algorithms under high pressure with zero margin for error.',
    venue: 'Lab 101, Computer Dept.',
    prize: '₹10,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-4',
    phase: 'DAY 1',
    time: '12:30 PM · Tech Event 02',
    title: 'Debug Dynasty',
    category: 'Tech',
    description: 'Decode, refactor, and fix intentionally broken production codebases before time runs out.',
    venue: 'Lab 102, Computer Dept.',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-5',
    phase: 'DAY 1',
    time: '02:30 PM · Tech Event 03',
    title: 'Cipher Hunt',
    category: 'Tech',
    description: 'Cryptographic challenge and puzzle hunt testing logical speed, decoding skills, and security concepts.',
    venue: 'Seminar Hall B',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-6',
    phase: 'DAY 1',
    time: '04:30 PM · Tech Event 04',
    title: 'Neural Nexus',
    category: 'Tech',
    description: 'Algorithmic maze navigation through technical trivia and rapid-fire logic traps.',
    venue: 'Lab 104',
    prize: '₹3,000 Prize Pool',
    status: 'upcoming',
  },
  // DAY 2: Design & Creativity (4 Events)
  {
    id: 't-7',
    phase: 'DAY 2',
    time: '10:00 AM · Design Event 01',
    title: 'Pixel Forge',
    category: 'Design',
    description: 'Intense UI/UX design marathon. Create responsive futuristic interfaces for real-world problems.',
    venue: 'Design Studio 2',
    prize: '₹8,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-8',
    phase: 'DAY 2',
    time: '12:00 PM · Design Event 02',
    title: 'Chromatic Clash',
    category: 'Design',
    description: 'High-stakes graphic design sprint emphasizing branding, composition, and visual impact.',
    venue: 'Design Studio 1',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-9',
    phase: 'DAY 2',
    time: '02:00 PM · Design Event 03',
    title: 'Canvas Blitz',
    category: 'Design',
    description: 'Fast-paced digital art sprint. Transform raw prompts into polished digital illustrations.',
    venue: 'Media Lab',
    prize: '₹3,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-10',
    phase: 'DAY 2',
    time: '04:00 PM · Design Event 04',
    title: 'Design Duel',
    category: 'Design',
    description: 'Head-to-head live design knockout battle judged in real-time by industry creative leads.',
    venue: 'Central Auditorium',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  // DAY 3: Fun, Chaos & Grand Finale (4 Events + Valedictory)
  {
    id: 't-11',
    phase: 'DAY 3',
    time: '10:00 AM · Fun Event 01',
    title: 'Mind Maze',
    category: 'Fun',
    description: 'Unpredictable team trivia, puzzle quests, and physical-digital mystery challenges.',
    venue: 'Open Amphitheatre',
    prize: '₹7,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-12',
    phase: 'DAY 3',
    time: '11:30 AM · Fun Event 02',
    title: 'Rapid Fire',
    category: 'Fun',
    description: 'Lightning-fast quiz and reflex arena with high energy, audience rounds, and instant prizes.',
    venue: 'Main Stage',
    prize: '₹3,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-13',
    phase: 'DAY 3',
    time: '01:30 PM · Fun Event 03',
    title: 'Alliance',
    category: 'Fun',
    description: 'Cross-functional team battle combining strategy, negotiation, and mini-challenges.',
    venue: 'Indoor Sports Complex',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-14',
    phase: 'DAY 3',
    time: '03:30 PM · Fun Event 04',
    title: 'Arena Royale',
    category: 'Fun',
    description: 'The flagship esports and gaming championship finale across multi-player battlegrounds.',
    venue: 'Gaming Arena / Main Stage',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-15',
    phase: 'FINALE',
    time: '05:30 PM · Grand Closing',
    title: 'Valedictory & Prize Distribution',
    category: 'Registration',
    description: 'Celebration of champions, trophies, certificate handover, and official reveal for next season.',
    venue: 'GCET Auditorium',
    prize: '₹70K+ Total Distributed',
    status: 'upcoming',
  },
];

const categoryColors: Record<string, string> = {
  Registration: 'text-glow border-glow/40 bg-glow/10',
  Tech: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  Design: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  Fun: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
};

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  const isReducedMotion = useMemo(() => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    document.title = 'Event Timeline | NEXORAE 2.0';
  }, []);

  // GSAP ScrollTrigger Progress Line Fill
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (lineProgressRef.current) {
        gsap.fromTo(
          lineProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top 25%',
              end: 'bottom 85%',
              scrub: 0.3,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-void text-white overflow-hidden pt-24 md:pt-32 pb-24 md:pb-32"
      id="timeline-page"
    >
      {/* Background Image Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100 scale-100"
          style={{ backgroundImage: 'url("/timeline-bg.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/40 to-void/85" />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-muted font-mono mb-3 sm:mb-4"
          >
            SCHEDULE
          </motion.p>

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
            Follow the journey from registration to the 12 electrifying events
          </motion.p>
        </div>

        {/* Timeline Axis & Cards Container */}
        <div className="relative my-6 sm:my-10">
          {/* Vertical Timeline Axis Line (Desktop: Center 50%, Mobile: Left 24px) */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/10 rounded-full">
            {/* Illuminated Red Progress Line */}
            <div
              ref={lineProgressRef}
              className="w-full h-full bg-gradient-to-b from-glow via-glow-bright to-glow shadow-[0_0_15px_#dc2626] origin-top scale-y-0"
            />
          </div>

          {/* Timeline Items List */}
          <div className="space-y-10 sm:space-y-20">
            {TIMELINE_DATA.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Central Node Marker (Mobile: Left 24px, Desktop: Center 50%) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                        item.status === 'completed'
                          ? 'bg-glow border-2 border-white shadow-[0_0_15px_#dc2626]'
                          : item.status === 'current'
                            ? 'bg-glow-bright border-2 border-glow shadow-[0_0_25px_#ef4444]'
                            : 'bg-surface border border-white/30'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'upcoming' ? 'bg-white/40' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Horizontal Branch Line connecting node to card on Mobile */}
                  <div className="md:hidden absolute left-6 top-1/2 w-6 h-[1px] bg-gradient-to-r from-glow/60 to-white/10 -translate-y-1/2 pointer-events-none z-10" />

                  {/* Card Container (Mobile: Full Width with Left Padding, Desktop: Alternating 46%) */}
                  <div
                    className={`w-full pl-14 sm:pl-16 md:pl-0 md:w-[46%] ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <div className="glass-strong p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-white/10 hover:border-glow/40 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                      {/* Top Header Row */}
                      <div
                        className={`flex items-center gap-2 sm:gap-3 mb-3 flex-wrap ${
                          isLeft ? 'md:justify-end' : 'md:justify-start'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono tracking-widest text-glow font-semibold">
                          {item.phase}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-[10px] font-mono tracking-wider text-muted">
                          {item.time}
                        </span>
                        <span
                          className={`ml-auto md:ml-0 px-2 sm:px-2.5 py-0.5 text-[8px] sm:text-[9px] uppercase tracking-widest font-mono rounded-full border ${categoryColors[item.category]}`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider text-white group-hover:text-glow-bright transition-colors duration-300 mb-2 sm:mb-3">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted text-xs sm:text-sm font-light leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Footer Info Row */}
                      <div
                        className={`flex items-center gap-4 pt-3 border-t border-white/10 text-[10px] font-mono text-dim flex-wrap ${
                          isLeft ? 'md:justify-end' : 'md:justify-start'
                        }`}
                      >
                        {item.venue && (
                          <span className="flex items-center gap-1 text-white/70">
                            📍 {item.venue}
                          </span>
                        )}
                        {item.prize && (
                          <span className="flex items-center gap-1 text-glow font-bold">
                            🏆 {item.prize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
