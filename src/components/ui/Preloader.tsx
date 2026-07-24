import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = lettersRef.current?.querySelectorAll('.preloader-char');
    if (!letters) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        setTimeout(onComplete, 600);
      },
    });

    // Phase 1: Letters assemble
    tl.fromTo(
      letters,
      { y: 40, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      }
    );

    // Phase 2: Progress counter
    tl.to({}, {
      duration: 2,
      onUpdate: function () {
        const p = Math.round(this.progress() * 100);
        setProgress(p);
      },
    }, '-=0.3');

    // Phase 3: Scale up and blur out
    tl.to(lettersRef.current, {
      scale: 1.2,
      opacity: 0,
      filter: 'blur(20px)',
      duration: 0.6,
      ease: 'power4.inOut',
    });

    tl.to(progressRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power4.inOut',
    }, '<');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
              style={{
                background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* NEXORAE Letters */}
          <div ref={lettersRef} className="flex gap-1 sm:gap-3 md:gap-4 mb-12" style={{ perspective: '600px' }}>
            {'NEXORAE'.split('').map((char, i) => (
              <span
                key={i}
                className="preloader-char inline-block font-display font-black text-[clamp(2.5rem,8vw,6rem)] uppercase tracking-[0.12em] text-white opacity-0"
                style={{
                  textShadow: '0 0 20px rgba(220,38,38,0.5), 0 0 60px rgba(220,38,38,0.2)',
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Progress */}
          <div ref={progressRef} className="flex flex-col items-center gap-4">
            {/* Progress bar */}
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-glow"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Percentage */}
            <span className="font-mono text-xs text-muted tracking-[0.3em]">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>

          {/* Version badge */}
          <div className="absolute bottom-8 text-[10px] text-dim uppercase tracking-[0.3em] font-mono">
            2.0
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
