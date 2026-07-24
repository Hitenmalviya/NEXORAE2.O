import type { NavLink } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events', isRoute: true },
  { label: 'About', href: '/#about' },
  { label: 'Timeline', href: '/timeline', isRoute: true },
  { label: 'My Nexorae', href: '/dashboard', isRoute: true },
];

export const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://www.instagram.com/ieee_gcet_sb?igsh=MWcyY3E0MXh4NzV4OA==', icon: 'instagram' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/ieee-gcet-student-branch/', icon: 'linkedin' },
] as const;
