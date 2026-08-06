import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/data/navigation';
import { GOOGLE_FORM_URL } from '@/utils/constants';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  // Scroll behavior: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 50);
      setHidden(currentY > lastScrollY.current && currentY > 100);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Animate mobile menu
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-all duration-500 ${
          isScrolled
            ? 'bg-void/90 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="relative z-[51] flex items-center gap-2.5 group py-1"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            {/* Desktop Emblem */}
            <img
              src="/images/ll.webp"
              alt="NEXORAE 2.0 Emblem"
              className="hidden md:block h-12 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(220,38,38,0.7)] group-hover:scale-105 transition-transform duration-300"
            />
            {/* Mobile Emblem */}
            <img
              src="/images/lw.webp"
              alt="NEXORAE 2.0 Emblem"
              className="block md:hidden h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(220,38,38,0.7)] group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-bold text-sm sm:text-base uppercase tracking-[0.1em] stranger-things-title hidden xs:inline-block">
              NEXORAE<span className="text-glow">E</span> <span className="text-xs font-mono text-glow-bright ml-0.5">2.0</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`relative text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 group ${
                    location.pathname === link.href ? 'text-white' : 'text-muted hover:text-white'
                  }`}
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-glow transition-all duration-300 ${
                      location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Register CTA */}
          <a
            href="https://forms.gle/k81miQEECdH54Yra9"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-5 py-2 text-[10px] uppercase tracking-[0.2em] border border-glow/30 text-glow hover:bg-glow hover:text-white transition-all duration-300 rounded-sm"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            Register
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative z-[51] w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMobileOpen}
          >
            <motion.span
              className="block w-6 h-[1.5px] bg-white origin-center"
              animate={isMobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-[1.5px] bg-white"
              animate={isMobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-[1.5px] bg-white origin-center"
              animate={isMobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-40 w-[min(320px,85vw)] bg-void-light/95 backdrop-blur-2xl border-l border-white/[0.04] md:hidden flex flex-col justify-center px-10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="space-y-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={link.href}
                      className={`block text-2xl font-display tracking-wider ${
                        location.pathname === link.href ? 'text-glow' : 'text-white/70'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-12 pt-8 border-t border-white/[0.06]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 text-xs uppercase tracking-[0.2em] border border-glow text-glow hover:bg-glow hover:text-white transition-all duration-300"
                >
                  Register Now
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
