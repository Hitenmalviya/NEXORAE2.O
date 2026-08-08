import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistrationGate } from '@/context/RegistrationGateContext';
import { GOOGLE_FORM_URL } from '@/utils/constants';

export default function RegistrationGate() {
  const { isOpen, closeGate, verifyAndProceed } = useRegistrationGate();

  const handleCreateIdClick = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGate}
            className="absolute inset-0 bg-black/85 backdrop-blur-[6px]"
          />

          {/* CRT Scanline styling overlay for popup */}
          <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-10 z-[10000]" />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-md bg-void-light border border-red-950/80 rounded-lg p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,0.2)] overflow-hidden z-[10001]"
          >
            {/* Ambient Red Glow Behind Content */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-red-950/20 filter blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-red-950/20 filter blur-[80px] pointer-events-none" />

            {/* Subtle Grid texture overlay inside modal */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Close Button */}
            <button
              onClick={closeGate}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.08]"
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Warning & Info */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Visual Eyebrow Icon / Shield */}
              <div className="w-12 h-12 rounded-full border border-red-800/40 bg-red-950/30 flex items-center justify-center text-red-500 text-xl font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)] mb-4 select-none">
                !
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500/90 mb-2">
                SECURITY PROTOCOL
              </span>

              <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-4 stranger-things-title">
                Get Your NEXORAE ID First
              </h3>

              <p className="text-zinc-400 font-body text-xs md:text-sm leading-relaxed mb-8 max-w-sm">
                To register for any NEXORAE event, you must first create your NEXORAE ID. Your NEXORAE ID is required for event registrations.
              </p>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handleCreateIdClick}
                  className="w-full py-3 text-xs font-mono uppercase tracking-[0.2em] font-bold text-white bg-red-600 border border-red-500 hover:bg-red-500 hover:border-red-400 rounded transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  Create NEXORAE ID
                </button>

                <button
                  onClick={verifyAndProceed}
                  className="w-full py-3 text-xs font-mono uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-white border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 rounded transition-all duration-300"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  Already Have an ID?
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
