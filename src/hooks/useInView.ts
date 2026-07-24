import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  margin?: string;
  once?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, margin = '0px', once = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, margin, once]);

  return { ref, inView };
}

export function useCountUp(target: number, duration = 2, startOnView = true) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ once: true });
  const started = useRef(false);

  useEffect(() => {
    if ((!startOnView || inView) && !started.current) {
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // Expo ease out
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [inView, target, duration, startOnView]);

  return { count, ref };
}
