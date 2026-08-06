import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GhostCursor from '@/components/ui/GhostCursor';

// Target Event Launch Date: Festival Kickoff (August 29, 2026 at 09:00:00 AM IST)
const TARGET_DATE = new Date('2026-08-29T09:00:00+05:30').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeRemaining(target: number): TimeLeft {
  const total = Math.max(0, target - new Date().getTime());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, '0');

  return (
    <div
      className="flex flex-col items-center group w-full sm:w-auto"
      onMouseEnter={() => document.body.classList.add('cursor-hover')}
      onMouseLeave={() => document.body.classList.remove('cursor-hover')}
    >
      <div className="glass-strong border border-glow/30 rounded-xl px-2 sm:px-6 py-3 sm:py-6 min-w-0 sm:min-w-[90px] md:min-w-[110px] w-full text-center relative overflow-hidden group-hover:border-glow transition-all duration-500">
        <div className="absolute inset-0 bg-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span
          className="font-mono text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-glow tracking-wider sm:tracking-widest relative z-10"
          style={{ textShadow: '0 0 25px rgba(220,38,38,0.6)' }}
        >
          {formatted}
        </span>
      </div>
      <span className="mt-2 sm:mt-3 text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.3em] text-muted font-mono truncate">
        {label}
      </span>
    </div>
  );
}

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeRemaining(TARGET_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(TARGET_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 overflow-hidden bg-void"
      id="countdown"
    >
      {/* GhostCursor Red Energy Trail Effect in Countdown Section */}
      <GhostCursor
        color="#d21515"
        brightness={2.5}
        edgeIntensity={0.1}
        trailLength={50}
        inertia={0.5}
        grainIntensity={0.05}
        bloomStrength={0.15}
        bloomRadius={1.0}
        bloomThreshold={0.025}
        zIndex={1}
      />

      {/* Top & Bottom Ambient Glow Dividers */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.2), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Red ambient backdrop pulse */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 md:mb-12"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted font-mono block mb-2">
            The Gate Opens In
          </span>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-white">
            Event <span className="text-glow">Countdown</span>
          </h2>
        </motion.div>

        {/* Counter Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-4 sm:flex items-center justify-center gap-2 sm:gap-6 md:gap-8 max-w-md sm:max-w-none mx-auto"
        >
          <TimeUnit value={timeLeft.days} label="Days" />
          <span className="font-mono text-2xl md:text-4xl text-glow-dim font-light -mt-6 hidden sm:inline">:</span>
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <span className="font-mono text-2xl md:text-4xl text-glow-dim font-light -mt-6 hidden sm:inline">:</span>
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <span className="font-mono text-2xl md:text-4xl text-glow-dim font-light -mt-6 hidden sm:inline">:</span>
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </motion.div>
      </div>
    </section>
  );
}
