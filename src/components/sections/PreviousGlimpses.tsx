import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import DomeGallery from '@/components/ui/DomeGallery';

import img1 from '@/assets/WhatsApp Image 2026-07-24 at 10.58.43 PM (1).jpeg';
import img2 from '@/assets/WhatsApp Image 2026-07-24 at 10.58.43 PM (2).jpeg';
import img3 from '@/assets/WhatsApp Image 2026-07-24 at 10.58.43 PM.jpeg';
import img4 from '@/assets/WhatsApp Image 2026-07-24 at 11.02.15 PM.jpeg';
import img5 from '@/assets/WhatsApp Image 2026-07-24 at 11.02.33 PM.jpeg';
import img6 from '@/assets/WhatsApp Image 2026-07-24 at 11.03.15 PM.jpeg';
import img7 from '@/assets/WhatsApp Image 2026-07-24 at 11.03.16 PM.jpeg';
import img8 from '@/assets/WhatsApp Image 2026-07-24 at 11.03.28 PM.jpeg';
import img9 from '@/assets/WhatsApp Image 2026-07-24 at 11.03.56 PM.jpeg';
import img10 from '@/assets/WhatsApp Image 2026-07-24 at 11.04.16 PM.jpeg';
import img11 from '@/assets/WhatsApp Image 2026-07-24 at 11.04.56 PM.jpeg';

// Uploaded local photos for 3D DomeGallery
const DOME_PHOTOS = [
  { src: img1, alt: 'NEXORAE Glimpse 1' },
  { src: img2, alt: 'NEXORAE Glimpse 2' },
  { src: img3, alt: 'NEXORAE Glimpse 3' },
  { src: img4, alt: 'NEXORAE Glimpse 4' },
  { src: img5, alt: 'NEXORAE Glimpse 5' },
  { src: img6, alt: 'NEXORAE Glimpse 6' },
  { src: img7, alt: 'NEXORAE Glimpse 7' },
  { src: img8, alt: 'NEXORAE Glimpse 8' },
  { src: img9, alt: 'NEXORAE Glimpse 9' },
  { src: img10, alt: 'NEXORAE Glimpse 10' },
  { src: img11, alt: 'NEXORAE Glimpse 11' },
];

export default function PreviousGlimpses() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntersected, setIsIntersected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (!isIntersected) {
          setIsIntersected(true);
        }
        // Force state update sync before playing
        setTimeout(() => {
          videoRef.current?.play().catch(() => {});
        }, 50);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative bg-void py-12 sm:py-20 overflow-hidden" id="glimpses">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto text-center mb-8 sm:mb-16 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase">
            Previous <span className="text-glow">Glimpses</span>
          </h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <p className="text-muted text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light max-w-xl mx-auto">
          Relive the electrifying moments and highlights from previous editions
        </p>
      </div>

      {/* 1. Single Highlight Video Placeholder */}
      <div className="max-w-[1100px] mx-auto mb-12 sm:mb-24 px-4 sm:px-6" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden glass-strong border border-glow/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] group"
        >
          {/* Video Aspect Ratio Wrapper */}
          <div className="relative aspect-video w-full bg-surface flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop"
              playsInline
              autoPlay={isIntersected}
              preload={isIntersected ? "auto" : "none"}
              muted
              loop
            >
              {isIntersected && <source src="/videos/glimpses.mp4" type="video/mp4" />}
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>

      {/* 2. Photo Gallery Header & Full Screen 3D Dome Gallery Container */}
      <div className="w-full mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 px-6"
        >
          <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-wider text-white">
            Dome <span className="text-glow">Memories</span>
          </h3>
        </motion.div>

        {/* Full Screen Dome Gallery Interactive Container (Edge-to-Edge) */}
        {/* Note: Photos can be added/customized by editing the DOME_PHOTOS array at the top of this file */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-[320px] sm:h-[80vh] md:h-[85vh] sm:min-h-[450px] relative overflow-hidden"
        >
          <DomeGallery
            images={DOME_PHOTOS}
            fit={0.65}
            fitBasis="auto"
            minRadius={320}
            maxRadius={1200}
            padFactor={0.15}
            overlayBlurColor="#050505"
            maxVerticalRotationDeg={12}
            dragSensitivity={18}
            dragDampening={0.8}
            openedImageWidth="min(88vw, 380px)"
            openedImageHeight="min(65vh, 500px)"
            imageBorderRadius="16px"
            openedImageBorderRadius="24px"
            grayscale={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
