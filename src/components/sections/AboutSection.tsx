import { motion } from 'framer-motion';
import FogEffect from '@/components/ui/FogEffect';

export default function AboutSection() {
  return (
    <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28 px-4 sm:px-6 overflow-hidden bg-void select-none" id="about">
      {/* Background Image Layer — Demogorgon Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/about-bg.jpg"
          alt="About Us Background"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105 opacity-85 sm:opacity-90"
        />
        {/* Ambient Dark Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-vignette opacity-75 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-transparent to-void/90 pointer-events-none" />
      </div>

      {/* Dynamic Animated Fog & Spores Layer */}
      <FogEffect />

      {/* Main Content Area - Positioned distinctly between Top-Right & Middle-Right */}
      <div className="relative z-10 max-w-[1400px] mx-auto md:ml-auto md:mr-4 lg:mr-8 xl:mr-16 text-left px-4 sm:px-6">
        <div className="max-w-2xl md:ml-auto">
          {/* Main Title with subtle red glow */}
          <motion.h2
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.08em] text-white mb-6 sm:mb-8 text-left drop-shadow-md"
            style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.4), 0 0 30px rgba(220, 38, 38, 0.2)' }}
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            ABOUT US
          </motion.h2>

          {/* Text Paragraphs */}
          <motion.div
            className="space-y-6 text-gray-100 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose text-left font-normal drop-shadow-lg"
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>
              Following the remarkable success of its inaugural edition, <span className="text-red-500 font-bold tracking-wide">NEXORAE 2.0</span> returns as the premier national-level techno-cultural fest organised by the <span className="text-white font-bold">IEEE GCET Student Branch</span>. Building on the momentum of its debut, which attracted <span className="text-red-400 font-bold">400+ participants</span> across technical expos, workshops, cultural showcases, and a high-intensity 24-hour national hackathon, this edition aims to reach even greater heights.
            </p>
            <p>
              Backed by <span className="text-white font-bold">six active IEEE societies</span>, <span className="text-red-500 font-bold tracking-wide">NEXORAE 2.0</span> brings together hundreds of bright minds, offering sponsors a unique opportunity to connect with next-generation tech talent while maximising their outreach within a dynamic campus community.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
