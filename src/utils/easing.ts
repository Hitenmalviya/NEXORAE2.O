export const easings = {
  power4Out: 'power4.out',
  power4InOut: 'power4.inOut',
  expoOut: 'expo.out',
  expoInOut: 'expo.inOut',
  backOut: 'back.out(1.7)',
  elasticOut: 'elastic.out(1, 0.3)',
  customSmooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  customSnap: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const spring = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14, mass: 1 },
  snappy: { type: 'spring' as const, stiffness: 300, damping: 20, mass: 0.8 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10, mass: 0.5 },
  slow: { type: 'spring' as const, stiffness: 80, damping: 20, mass: 1.5 },
};
