import { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useIsTouch } from '@/hooks/useMediaQuery';
import { lerp } from '@/utils/math';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const isTouch = useIsTouch();
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (isTouch) return;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, mouse.x, 0.4);
      pos.current.y = lerp(pos.current.y, mouse.y, 0.4);
      ringPos.current.x = lerp(ringPos.current.x, mouse.x, 0.22);
      ringPos.current.y = lerp(ringPos.current.y, mouse.y, 0.22);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [mouse.x, mouse.y, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
    </>
  );
}
