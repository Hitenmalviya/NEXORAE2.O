export const SITE_CONFIG = {
  name: 'NEXORAE 2.0',
  tagline: 'Where Innovation Meets the Future',
  description: 'NEXORAE 2.0 — A premium tech fest by IEEE GCET Student Branch. 11 electrifying events across Tech, Design, and Fun.',
  organization: 'IEEE GCET Student Branch',
  year: 2026,
  eventCount: 11,
  categoryCount: 3,
  participantCount: '500+',
  prizePool: '₹70K+',
  email: 'ieee@gcet.edu',
  venue: 'GCET, Vallabh Vidyanagar',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_CONFIG = {
  preloaderDuration: 4,
  heroRevealDelay: 0.5,
  sectionRevealDuration: 1.2,
  staggerDelay: 0.08,
  pageTransitionDuration: 0.6,
} as const;

export const COLORS = {
  void: '#050505',
  voidLight: '#0a0a0a',
  surface: '#111111',
  surfaceElevated: '#1a1a1a',
  glow: '#dc2626',
  glowBright: '#ef4444',
  glowDim: '#991b1b',
  metallic: '#c0c0c0',
  muted: '#666666',
  dim: '#333333',
} as const;
