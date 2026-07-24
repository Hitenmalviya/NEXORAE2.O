import { useEffect, useRef } from 'react';

export default function FogEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const handleResize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Fog puff particle class
    interface FogParticle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      maxAlpha: number;
      alphaSpeed: number;
      color: string;
    }

    interface Spore {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      pulse: number;
    }

    const fogParticles: FogParticle[] = [];
    const fogCount = window.innerWidth < 768 ? 12 : 24;

    const colors = [
      'rgba(180, 20, 20, ',
      'rgba(220, 38, 38, ',
      'rgba(120, 15, 25, ',
      'rgba(60, 5, 10, ',
      'rgba(200, 50, 40, '
    ];

    for (let i = 0; i < fogCount; i++) {
      const radius = Math.random() * 220 + 130;
      const x = Math.random() * canvas.width;
      const y = canvas.height * 0.2 + Math.random() * (canvas.height * 0.8);
      fogParticles.push({
        x,
        y,
        originX: x,
        originY: y,
        radius,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.12,
        alpha: Math.random() * 0.05 + 0.03,
        maxAlpha: Math.random() * 0.12 + 0.05,
        alphaSpeed: (Math.random() * 0.001 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const spores: Spore[] = [];
    const sporeCount = window.innerWidth < 768 ? 15 : 35;
    for (let i = 0; i < sporeCount; i++) {
      spores.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.35 - 0.1,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.4 + 0.15,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Interactive Cursor Glow Aura
      if (mouseX > -500 && mouseY > -500) {
        const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180);
        cursorGlow.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
        cursorGlow.addColorStop(0.5, 'rgba(185, 28, 28, 0.06)');
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Fog Puffs with Cursor Interaction Physics
      for (const p of fogParticles) {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha >= p.maxAlpha || p.alpha <= 0.01) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Mouse repelling physics
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactRadius = 220;

        if (dist < interactRadius && dist > 0) {
          const force = (interactRadius - dist) / interactRadius;
          p.x += (dx / dist) * force * 4;
          p.y += (dy / dist) * force * 4;
          p.alpha = Math.min(0.2, p.alpha + force * 0.02);
        }

        // Screen boundary wraparound
        if (p.x - p.radius > canvas.width) p.x = -p.radius;
        if (p.x + p.radius < 0) p.x = canvas.width + p.radius;
        if (p.y - p.radius > canvas.height) p.y = canvas.height * 0.2;
        if (p.y + p.radius < canvas.height * 0.1) p.y = canvas.height;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color + p.alpha + ')');
        grad.addColorStop(0.5, p.color + (p.alpha * 0.35) + ')');
        grad.addColorStop(1, p.color + '0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render spores/embers floating in fog with Cursor Interactive Swirl Physics
      for (const s of spores) {
        s.x += s.vx;
        s.y += s.vy;
        s.pulse += 0.03;

        // Mouse interaction for spores
        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sporeInteractRadius = 160;

        if (dist < sporeInteractRadius && dist > 0) {
          const force = (sporeInteractRadius - dist) / sporeInteractRadius;
          s.x += (dx / dist) * force * 5;
          s.y += (dy / dist) * force * 5;
        }

        if (s.y < -10) {
          s.y = canvas.height + 10;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;

        const currentAlpha = Math.max(0.08, s.alpha + Math.sin(s.pulse) * 0.2);

        ctx.fillStyle = `rgba(255, 120, 100, ${currentAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {/* CSS Ambient Fog Layers */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none animate-fog-drift-1"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.08) 50%, transparent 80%)',
          filter: 'blur(50px)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-15 mix-blend-color-dodge pointer-events-none animate-fog-drift-2"
        style={{
          background: 'radial-gradient(ellipse at 20% 90%, rgba(239, 68, 68, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 85%, rgba(185, 28, 28, 0.15) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />

      {/* HTML5 Canvas Interactive Particle Fog */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
