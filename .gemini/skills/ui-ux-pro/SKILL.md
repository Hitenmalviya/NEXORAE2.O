---
name: ui-ux-pro
description: Professional UI/UX Design System & Master Frontend Engineering Skill. Provides comprehensive principles, color theory, typography scale, micro-interactions, Framer Motion/GSAP animations, glassmorphism design systems, accessibility (WCAG AA), responsive breakpoints, and cinematic web application guidelines. Activate this skill whenever designing, building, auditing, or polishing user interfaces, frontend components, or visual web experiences.
---

# UI/UX Pro Master Skill & Design Guidelines

This skill provides an exhaustive framework for creating world-class, premium, production-grade Web UIs and UX design systems.

---

## 1. Visual Aesthetics & Design System Principles

### A. Color Palette & Lighting
- **Harmonious Palettes**: Avoid default pure red (`#ff0000`), pure blue (`#0000ff`), or plain grey (`#808080`). Use curated HSL/OKLCH scales or deep rich voids (e.g., `#050505`, `#0a0a0a`, `#111111`).
- **Accent Glow & Atmosphere**: Utilize multi-layered drop shadows and glows (e.g., `text-shadow`, `box-shadow: 0 0 30px rgba(..., 0.5)`).
- **Glassmorphism**: Use backdrop blurs with subtle semi-transparent borders:
  ```css
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```

### B. Typography & Hierarchy
- **Font Pairings**: Combine bold display headings (Serif or Display sans) with crisp body typography (Inter, System Sans) and monospace for stats/code (JetBrains Mono).
- **Scale & Contrast**:
  - `Display / Hero`: `clamp(3rem, 10vw, 8rem)` with tight line-height (`0.85` - `0.95`).
  - `Headings`: High contrast, tracked letter spacing (`tracking-[0.04em]` to `tracking-[0.1em]`).
  - `Body`: `14px` - `16px`, line-height `1.6`, muted secondary text (`#a1a1aa`, `#71717a`).
  - `Eyebrow / Overline`: `10px` - `12px`, uppercase, wide tracking (`tracking-[0.3em]`).

---

## 2. Micro-Interactions & Animation Guidelines

### A. Motion Curves & Durations
- **Easing**: Use cubic-bezier curves for fluid physics:
  - Enter: `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out)
  - Interactive Hover: `duration-300` to `duration-500`
- **Hover Feedback**:
  - Scale effects: `hover:scale-[1.02]` or `hover:-translate-y-1`
  - Border transitions: `transition-all duration-500`
  - Custom cursor state triggers (`cursor-hover` class toggles)

### B. Scroll-Driven Stories & Canvas
- Use `GSAP ScrollTrigger` or Framer Motion for scroll-linked timelines.
- Render high-particle atmospheres (embers, smoke, stars) on `HTML5 Canvas` with `requestAnimationFrame` to ensure zero layout shift (CLS) and steady 60fps performance.

---

## 3. UX Best Practices & Component States

Every component must handle 5 distinct states:
1. **Default State**: Polished, minimal, visually distinct.
2. **Hover / Focus State**: Clear interactive affordance with glow, border shift, or subtle elevation.
3. **Active / Loading State**: Skeleton loaders, pulsing indicators, disabled button states with loading spinners.
4. **Empty State**: Purposeful illustration or icon, helpful explanatory message, primary call-to-action.
5. **Error State**: Non-destructive, inline alerts with clear correction paths.

---

## 4. Responsive Design & Accessibility (a11y)

- **Mobile First & Responsive Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Touch Friendly**: Touch targets minimum `44px` x `44px` on mobile screens.
- **Accessibility**:
  - WCAG AA contrast ratio minimum (4.5:1 for normal text).
  - Proper ARIA attributes (`aria-expanded`, `aria-label`, `aria-hidden`).
  - Respect `prefers-reduced-motion: reduce`.

---

## 5. UI/UX Quality Checklist

Before finalizing any UI implementation, verify:
- [ ] No generic default browser styling or raw unstyled inputs.
- [ ] Smooth hover transitions on all interactive elements.
- [ ] High contrast legibility for all text over image backgrounds.
- [ ] Zero horizontal overflow on mobile screens (`overflow-x-hidden`).
- [ ] Clear loading and feedback states for all user actions.
