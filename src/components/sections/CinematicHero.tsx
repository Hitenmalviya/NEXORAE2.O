import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/utils/constants';

export default function CinematicHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating crimson embers background loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
    }

    const embers: Ember[] = [];
    const count = window.innerWidth < 768 ? 30 : 60;

    for (let i = 0; i < count; i++) {
      embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 2.0 + 0.6,
        opacity: Math.random() * 0.5 + 0.2,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const ember of embers) {
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.life++;

        if (ember.life > ember.maxLife || ember.y < -10) {
          ember.x = Math.random() * canvas.width;
          ember.y = canvas.height + 10;
          ember.life = 0;
        }

        const lifeRatio = ember.life / ember.maxLife;
        const alpha = ember.opacity * (lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1);

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] py-16 sm:py-0 bg-void overflow-hidden flex items-center justify-center select-none" id="hero">
      {/* Stable Background Image */}
      <div className="absolute inset-0 z-0 opacity-90">
        <img
          src="/hero-bg.jpg"
          alt="NEXORAE Hero Background"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Soft Dark Vignette Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/30 to-void/85 pointer-events-none" />
        <div className="vignette absolute inset-0 pointer-events-none" />
      </div>

      {/* Floating Embers Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl pointer-events-auto mt-12 sm:mt-0"
      >
        {/* Organization Eyebrow */}
        <p className="text-[9px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted mb-3 sm:mb-4 font-mono">
          {SITE_CONFIG.organization} PRESENTS
        </p>

        {/* Elegant Cinematic Title Frame & Typography */}
        <div className="relative inline-flex flex-col items-center select-none my-2 sm:my-3 max-w-full">
          {/* Subtle Top Framing Bar */}
          <div className="w-[95%] relative h-[2px] bg-gradient-to-r from-transparent via-red-600/80 to-transparent mb-2">
            <div className="absolute left-0 top-0 h-3 w-[2px] bg-red-600/80" />
            <div className="absolute right-0 top-0 h-3 w-[2px] bg-red-600/80" />
          </div>

          {/* Main Title: NEXORAE */}
          <h1 className="font-black text-[clamp(2.2rem,11vw,8.5rem)] leading-none tracking-[0.04em] stranger-things-title flex items-center justify-center">
            <span className="inline-flex items-baseline">
              <span className="text-[1.2em] font-extrabold -mr-[0.02em]">N</span>
              <span>EXORA</span>
              <span className="text-[1.2em] font-extrabold -ml-[0.02em]">E</span>
            </span>
          </h1>

          {/* Elegant Sub-title Line: 2.0 */}
          <div className="w-[95%] flex items-center justify-center gap-2 sm:gap-6 mt-1.5 sm:mt-2">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-red-600/20" />
            <span className="font-black text-[clamp(1.4rem,7vw,4.8rem)] stranger-things-title tracking-wider px-2 inline-block">
              2.0
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-red-600/60 to-red-600/20" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] sm:text-sm md:text-base text-muted tracking-[0.18em] sm:tracking-[0.25em] uppercase mb-6 sm:mb-8 font-light max-w-xl mx-auto px-2">
          WHERE INNOVATION MEETS THE FUTURE
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-col sm:flex-row w-full max-w-xs sm:max-w-none mx-auto mb-8 sm:mb-10">
          <a
            href="#events"
            className="group relative w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-center overflow-hidden border border-red-600/40 text-white rounded-sm transition-all duration-300 hover:border-red-500 glass-strong"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            <span className="absolute inset-0 bg-glow/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 font-medium">Explore Events</span>
          </a>
          <a
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-center border border-white/20 text-white hover:border-white/50 transition-all duration-300 rounded-sm glass"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            Register Now
          </a>
        </div>
      </motion.div>
    </section>
  );
}
