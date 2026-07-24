import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '@/data/navigation';
import { SITE_CONFIG } from '@/utils/constants';

const socialIcons: Record<string, ReactNode> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
};

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact | NEXORAE 2.0';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formState);
    setSubmitted(true);
  };

  return (
    <motion.main
      className="min-h-screen pt-24 md:pt-32 pb-24 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.p
          className="text-[10px] uppercase tracking-[0.35em] text-muted mb-6 font-mono"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Get in Touch
        </motion.p>

        <motion.h1
          className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.04em] uppercase leading-[0.95] mb-16"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Let's <span className="text-glow">Connect</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="glass rounded-xl p-8 space-y-6">
                {(['name', 'email', 'subject'] as const).map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={formState[field]}
                      onChange={(e) => setFormState({ ...formState, [field]: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent transition-colors"
                      placeholder={field}
                      required
                      id={`contact-${field}`}
                    />
                    <label
                      htmlFor={`contact-${field}`}
                      className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}

                <div className="relative">
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={5}
                    className="w-full bg-transparent border-b border-white/10 pb-3 pt-6 text-sm text-white outline-none focus:border-glow peer placeholder-transparent resize-none transition-colors"
                    placeholder="Message"
                    required
                    id="contact-message-page"
                  />
                  <label
                    htmlFor="contact-message-page"
                    className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-muted transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-glow"
                  >
                    Message
                  </label>
                </div>

                <button
                  type="submit"
                  className="group relative w-full py-4 text-xs uppercase tracking-[0.2em] overflow-hidden border border-glow/30 text-white rounded-sm transition-all duration-500 hover:border-glow"
                  onMouseEnter={() => document.body.classList.add('cursor-hover')}
                  onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                >
                  <span className="absolute inset-0 bg-glow translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <span className="relative z-10">Send Message</span>
                </button>
              </form>
            ) : (
              <div className="glass rounded-xl p-12 text-center">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="font-display text-xl font-bold tracking-wider mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted text-sm">We'll get back to you as soon as possible.</p>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="space-y-8"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-glow rounded-xl p-8">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 font-mono">
                Organized by
              </div>
              <div className="font-display text-2xl font-bold tracking-wider mb-1">
                IEEE <span className="text-glow">GCET</span>
              </div>
              <div className="text-sm text-muted">Student Branch</div>
            </div>

            <div className="glass rounded-xl p-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4 font-mono">Venue</h3>
              <p className="text-white/80 leading-relaxed">
                G H Patel College of Engineering & Technology<br />
                Vallabh Vidyanagar, Gujarat, India
              </p>
            </div>



            <div className="glass rounded-xl p-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4 font-mono">Social</h3>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center border border-white/[0.06] rounded-full text-muted hover:text-glow hover:border-glow/30 transition-all duration-300"
                    aria-label={social.name}
                    onMouseEnter={() => document.body.classList.add('cursor-hover')}
                    onMouseLeave={() => document.body.classList.remove('cursor-hover')}
                  >
                    {socialIcons[social.icon]}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
