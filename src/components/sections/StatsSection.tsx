import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '@/hooks/useInView';

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}

function StatItem({ value, suffix = '', prefix = '', label, delay = 0 }: StatItemProps) {
  const { count, ref } = useCountUp(value, 2);
  const labelRef = useRef(null);
  const inView = useInView(labelRef, { once: true });

  return (
    <div
      className="text-center group"
      onMouseEnter={() => document.body.classList.add('cursor-hover')}
      onMouseLeave={() => document.body.classList.remove('cursor-hover')}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2"
        style={{ textShadow: '0 0 30px rgba(220,38,38,0.3)' }}
      >
        <span className="text-glow">{prefix}</span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
          className="text-white"
        >
          {count}
        </motion.span>
        <span className="text-glow">{suffix}</span>
      </div>
      <div
        ref={labelRef}
        className="text-[10px] uppercase tracking-[0.3em] text-muted font-mono"
      >
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineInView = useInView(sectionRef, { once: true });

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Subtle divider lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={lineInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.15), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={lineInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.02) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <StatItem value={12} label="Events" delay={0} />
          <StatItem value={3} label="Categories" delay={0.1} />
          <StatItem value={500} suffix="+" label="Participants" delay={0.2} />
          <StatItem value={70} prefix="₹" suffix="K+" label="Prize Pool" delay={0.3} />
        </div>
      </div>
    </section>
  );
}
