import { useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { GOOGLE_FORM_URL } from '@/utils/constants';
import FogEffect from '@/components/ui/FogEffect';

export default function CinematicHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const reveal = revealRef.current;
    if (!hero || !reveal) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let visible = false;
    let animId: number;

    const animate = () => {
      x += (mouseX - x) * 0.35;
      y += (mouseY - y) * 0.35;

      if (reveal) {
        reveal.style.setProperty('--x', `${x}px`);
        reveal.style.setProperty('--y', `${y}px`);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const updatePosition = (clientX: number, clientY: number) => {
      const rect = hero.getBoundingClientRect();
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;

      if (!visible) {
        x = mouseX;
        y = mouseY;
        visible = true;
        reveal.classList.add('active');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleLeave = () => {
      visible = false;
      reveal.classList.remove('active');
    };

    hero.addEventListener('mousemove', handleMouseMove, { passive: true });
    hero.addEventListener('mouseleave', handleLeave, { passive: true });
    hero.addEventListener('touchstart', handleTouchStart, { passive: true });
    hero.addEventListener('touchmove', handleTouchMove, { passive: true });
    hero.addEventListener('touchend', handleLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleLeave);
      hero.removeEventListener('touchstart', handleTouchStart);
      hero.removeEventListener('touchmove', handleTouchMove);
      hero.removeEventListener('touchend', handleLeave);
    };
  }, []);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 70, damping: 12 },
    },
  };

  const handleEnterClick = () => {
    const nextSection = document.getElementById('events') || document.getElementById('countdown');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="st-hero" ref={heroRef} id="hero">
      {/* Interactive Fire Mask Layer */}
      <div className="fire-reveal" ref={revealRef} />

      {/* Dynamic Animated Fog & Glowing Particles Spores Layer */}
      <FogEffect />

      {/* Main Content Overlay */}
      <motion.div
        className="st-hero-content"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="st-center-container">
          <motion.div className="st-logo-wrapper" variants={item}>
            <img
              src="/images/nexorae-logo.png"
              alt="NEXORAE 2.0 - Innovation Beyond Horizons"
              className="st-logo-img"
            />
          </motion.div>

          {/* Centered Event Information Line */}
          <motion.p
            variants={item}
            className="font-mono text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/90 text-center my-4 sm:my-5 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]"
          >
            15–17 SEPT 2026 • GCET, ANAND
          </motion.p>

          <div className="st-buttons-container">
            <motion.button
              className="st-btn group relative overflow-hidden font-mono"
              variants={item}
              onClick={handleEnterClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Smooth Rising Red Glow Loading Background Effect */}
              <span className="absolute inset-0 bg-gradient-to-t from-red-700 via-red-600 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              
              {/* Top Glowing Shimmer Accent Line */}
              <span className="absolute top-0 left-0 w-full h-[2px] bg-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

              <span className="relative z-10 font-medium tracking-wider uppercase">
                Explore the Arena
              </span>
            </motion.button>

            <motion.a
              href="https://forms.gle/k81miQEECdH54Yra9"
              target="_blank"
              rel="noopener noreferrer"
              className="st-btn-secondary group relative overflow-hidden font-mono"
              variants={item}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-red-800/80 via-red-600/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              <span className="relative z-10 font-medium tracking-wider uppercase">
                Register Now
              </span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
