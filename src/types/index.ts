export interface Event {
  id: string;
  name: string;
  category: 'tech' | 'design' | 'fun';
  difficulty: 'easy' | 'medium' | 'hard';
  prize?: string;
  description: string;
  poster: string | null;
  team?: { min: number; max: number };
  icon: string;
  registrationUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface GlimpseItem {
  id: string;
  type: 'video' | 'image';
  src: string;
  caption: string;
  subtitle?: string;
}

export interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

export type CursorState = 'default' | 'hover' | 'click' | 'video' | 'explore' | 'register' | 'text';

export interface AudioConfig {
  enabled: boolean;
  volume: number;
}
