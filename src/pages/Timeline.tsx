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
  // DAY 1: Tech & Innovation
  {
    id: 't-3',
    phase: 'DAY 1',
    time: '10:00 AM · Tech Event 01',
    title: 'Code Red: Hunt, Hack & Fix',
    category: 'Tech',
    description: 'Put your coding skills to the test through technical quizzes, debugging rounds, and a thrilling finale on CodeChef. Every bug is a clue! Think fast, code faster, and rise to the top.',
    venue: 'Lab 101, Computer Dept.',
    prize: '₹10,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-4',
    phase: 'DAY 1',
    time: '12:00 PM · Tech Event 02',
    title: 'Egg Shield',
    category: 'Tech',
    description: 'Take on the ultimate engineering challenge by building a protective shield using the given materials to save your raw egg from drops off the 1st, 2nd, and 3rd floors!',
    venue: 'Quadrangle / Main Courtyard',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-5',
    phase: 'DAY 1',
    time: '02:00 PM · Tech Event 03',
    title: "The Mind Flayer's Maze (RoboTrack)",
    category: 'Tech',
    description: 'Build an autonomous robot and navigate a maze filled with twists, turns, and unexpected challenges. Precision, speed, and smart programming will lead you to victory.',
    venue: 'Robotics Arena, EC Dept.',
    prize: '₹10,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-6',
    phase: 'DAY 1',
    time: '04:00 PM · Innovation Talk',
    title: "Founder's Circle: where idea meets reality",
    category: 'Design',
    description: 'Hear directly from founders as they discuss entrepreneurship, innovation, and the realities of building a startup. Gain practical insights, ask questions, and learn from the journeys behind successful ventures.',
    venue: 'Auditorium Hall A',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  // DAY 2: Media, Clues & Strategy
  {
    id: 't-7',
    phase: 'DAY 2',
    time: '10:00 AM · Design Event 01',
    title: 'The Transmission: Every Frame tells a story (pitch verse)',
    category: 'Design',
    description: 'Creative Pitch Reel Challenge blends storytelling with innovation in an exciting showcase. Create compelling reels that captivate audiences, communicate impactful ideas, and leave a lasting impression.',
    venue: 'Media Studio / Seminar Hall',
    prize: '₹6,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-8',
    phase: 'DAY 2',
    time: '12:00 PM · Campus Hunt',
    title: 'The Upside Down: The Final Portal',
    category: 'Fun',
    description: 'A logic-based treasure hunt with puzzles, clues, and campus challenges. Decode, explore, and sprint across campus. Team up to uncover the Final Portal!',
    venue: 'Campus Grounds',
    prize: '₹8,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-9',
    phase: 'DAY 2',
    time: '02:30 PM · Strategy Game',
    title: 'The Traitors: System Breach Edition',
    category: 'Fun',
    description: 'System Breach Edition is a thrilling game of trust, strategy, and deception. Complete missions, expose the hidden Traitors and outsmart your opponents before the final system breach.',
    venue: 'Seminar Hall B',
    prize: '₹7,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-10',
    phase: 'DAY 2',
    time: '04:30 PM · Mystery Quest',
    title: 'Escape room',
    category: 'Fun',
    description: 'Follow the clues, solve mind-bending puzzles, and overcome each stage of this immersive adventure. Combine logic, speed and teamwork to outsmart the challenge and escape before time runs out.',
    venue: 'Block C Labs',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  // DAY 3: Chaos, Esports & Grand Finale
  {
    id: 't-11',
    phase: 'DAY 3',
    time: '10:00 AM · Chaos Arena',
    title: 'Hawkins Havoc',
    category: 'Fun',
    description: 'Take on fun mini-games while Chaos Cards introduce twists like blindfolds, no talking, or reversed instructions. Adapt fast, work as a team, and conquer the chaos!',
    venue: 'Open Amphitheatre',
    prize: '₹4,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-12',
    phase: 'DAY 3',
    time: '11:30 AM · Esports League',
    title: 'DemoGrounds (Battleground)',
    category: 'Fun',
    description: 'Battle across a multi-day BGMI league, earning points through eliminations and match placements to qualify for the Grand Finale!',
    venue: 'Gaming Zone / Main Stage',
    prize: '₹8,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-13',
    phase: 'DAY 3',
    time: '02:00 PM · Physical & Mental Challenge',
    title: 'Mind & Muscle',
    category: 'Fun',
    description: 'A perfect blend of brains, strength, and teamwork. Solve challenges, power through obstacles, and prove you have what it takes to conquer both mind and muscle.',
    venue: 'Sports Complex Grounds',
    prize: '₹5,000 Prize Pool',
    status: 'upcoming',
  },
  {
    id: 't-14',
    phase: 'FINALE',
    time: '05:00 PM · Grand Closing',
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

  // Filter items by active tab (All vs category)
  const filteredTimeline = useMemo(() => TIMELINE_DATA, []);

  useEffect(() => {
    document.title = 'Event Timeline | NEXORAE 2.0';

    // GSAP ScrollTrigger for vertical progress line illumination
    const ctx = gsap.context(() => {
      if (lineProgressRef.current && containerRef.current) {
        gsap.fromTo(
          lineProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 30%',
              end: 'bottom 80%',
              scrub: 0.3,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6" ref={containerRef}>
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full border border-glow/30 bg-glow/10 text-glow text-[10px] sm:text-xs tracking-[0.3em] uppercase font-mono mb-4 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse" />
            OFFICIAL EVENT SCHEDULE
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
            Follow the journey from registration to the 11 electrifying events
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
