import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const socialIcons: Record<string, { icon: ReactNode; url: string }> = {
  instagram: {
    url: 'https://www.instagram.com/ieee_gcet_sb?igsh=MWcyY3E0MXh4NzV4OA==',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  linkedin: {
    url: 'https://www.linkedin.com/company/ieee-gcet-student-branch/',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  youtube: {
    url: 'https://youtube.com/@ieeegcet',
    icon: (
      <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
};

export default function Footer() {
  const contacts = [
    { name: 'Anushka Patel', phone: '+91 77790 44982' },
    { name: 'Aditya Patel', phone: '+91 93130 25460' },
    { name: 'Bhagya Shah', phone: '+91 87340 47216' },
  ];

  return (
    <footer className="relative pt-16 sm:pt-24 pb-8 px-4 sm:px-8 bg-void select-none overflow-hidden" id="contact">
      {/* Single Parent Background Image Layer — Stranger Things Alphabet Christmas Lights Wall */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/contact-bg.jpg"
          alt="Stranger Things Alphabet Lights Wall Background"
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-125 opacity-75 sm:opacity-85"
        />
        {/* Soft Static Dark Vignette & Top/Bottom Atmosphere Gradients */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void pointer-events-none" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Contact Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center gap-3 sm:gap-6 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-white drop-shadow-2xl"
              style={{
                textShadow: '0 0 20px rgba(220, 38, 38, 0.7), 0 0 40px rgba(239, 68, 68, 0.4)',
                fontFamily: "'ITC Benguiat', 'Cinzel Decorative', 'Playfair Display', serif",
              }}
            >
              CONTACT
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
          </div>

          <p className="text-center text-zinc-200 text-xs sm:text-sm md:text-base tracking-[0.15em] uppercase font-mono max-w-xl mx-auto px-2 drop-shadow-md">
            Got questions? Reach out to the IEEE GCET Student Branch team.
          </p>
        </div>

        {/* Brand Logo */}
        <div className="text-center mb-8 flex items-center justify-center">
          <Link
            to="/"
            className="inline-block group"
            onMouseEnter={() => document.body.classList.add('cursor-hover')}
            onMouseLeave={() => document.body.classList.remove('cursor-hover')}
          >
            <img
              src="/images/v1.png"
              alt="NEXORAE 2.0 Logo"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(220,38,38,0.85)] group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* 3 Contact Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          {contacts.map((contact) => (
            <div key={contact.name} className="flex flex-col items-center">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide font-display drop-shadow-md">
                {contact.name}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-zinc-300 tracking-wider mt-1 font-mono drop-shadow">
                ({contact.phone})
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Horizontal Line Divider */}
        <div className="w-full max-w-4xl mx-auto h-[1px] bg-white/20 mb-8 sm:mb-10" />

        {/* Social Icons in Center */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-10">
          {Object.entries(socialIcons).map(([key, item]) => (
            <a
              key={key}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 transition-colors duration-300 p-1.5 drop-shadow-md"
              aria-label={key}
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Bottom Center: Published by Hiten Malviya */}
        <div className="flex items-center justify-center pt-2 text-center">
          <p className="text-sm sm:text-base font-medium text-white tracking-wide drop-shadow-md text-center">
            Published by{' '}
            <a
              href="https://www.linkedin.com/in/hiten-malviya-537632318?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 underline underline-offset-4 transition-colors duration-300"
              onMouseEnter={() => document.body.classList.add('cursor-hover')}
              onMouseLeave={() => document.body.classList.remove('cursor-hover')}
            >
              Hiten Malviya
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
