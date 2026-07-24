import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/Hero';
import CountdownSection from '@/components/sections/CountdownSection';
import EventsShowcase from '@/components/sections/EventsShowcase';
import PreviousGlimpses from '@/components/sections/PreviousGlimpses';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  useEffect(() => {
    document.title = 'NEXORAE 2.0 | IEEE GCET Student Branch';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Hero />
      <CountdownSection />
      <EventsShowcase />
      <PreviousGlimpses />
      <AboutSection />
      <ContactSection />
    </motion.div>
  );
}
