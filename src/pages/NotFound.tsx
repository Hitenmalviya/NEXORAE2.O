import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 | NEXORAE 2.0';
  }, []);

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.04) 0%, transparent 60%)',
        }}
      />
      <div className="vignette absolute inset-0 pointer-events-none" />

      <div className="text-center relative z-10">
        <motion.div
          className="font-display text-[clamp(8rem,25vw,16rem)] font-black leading-none opacity-[0.06] select-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.06 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          404
        </motion.div>

        <motion.div
          className="-mt-12 md:-mt-20 relative z-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted font-mono mb-4">
            Error 404
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-wider mb-4">
            Page Not Found
          </h1>
          <p className="text-muted text-sm max-w-md mx-auto mb-10">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/"
              className="group relative px-8 py-3.5 text-xs uppercase tracking-[0.2em] overflow-hidden border border-glow/40 text-white rounded-sm transition-all duration-500 hover:border-glow"
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              <span className="absolute inset-0 bg-glow translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10">Go Home</span>
            </Link>
            <Link
              to="/events"
              className="px-8 py-3.5 text-xs uppercase tracking-[0.2em] border border-white/10 text-muted hover:text-white hover:border-white/30 transition-all duration-500 rounded-sm"
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              View Events
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
