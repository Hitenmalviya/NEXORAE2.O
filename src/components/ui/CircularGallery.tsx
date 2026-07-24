import { useEffect, useRef } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';

export interface CircularGalleryItem {
  image: string;
  title: string;
  [key: string]: any;
}

interface CircularGalleryProps {
  items: CircularGalleryItem[];
  bend?: number;
  scrollEase?: number;
  className?: string;
  onActiveIndexChange?: (index: number) => void;
}

export function CircularGallery({
  items,
  bend = 3,
  scrollEase = 0.04,
  className = '',
  onActiveIndexChange,
}: CircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !items || items.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof window === 'undefined' || !window.WebGLRenderingContext) {
      return;
    }

    let renderer: Renderer;
    let gl: Renderer['gl'];
    let camera: Camera;
    let scene: Transform;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      gl = renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.setAttribute('tabindex', '0');
      canvas.setAttribute('role', 'region');
      canvas.setAttribute('aria-label', 'Scrollable gallery of events');
      root.appendChild(canvas);

      camera = new Camera(gl, { fov: 45 });
      camera.position.set(0, 0, 10);
      scene = new Transform();
    } catch (err) {
      console.warn('WebGL init failed for CircularGallery', err);
      return;
    }

    const vertex = `
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uSpeed;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.z += sin(p.x * 0.6 + uTime * 0.0002) * 0.05;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      uniform sampler2D tMap;
      uniform float uAlpha;
      varying vec2 vUv;
      void main() {
        vec4 tex = texture2D(tMap, vUv);
        gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
      }
    `;

    // Adaptive Instagram Post 1:1 Ratio (Responsive plane dimensions for mobile & desktop)
    const isMobile = window.innerWidth < 768;
    const planeWidth = isMobile ? 3.4 : 2.7;
    const planeHeight = isMobile ? 3.4 : 2.7;
    const gap = isMobile ? 0.5 : 0.75;
    const itemSpan = planeWidth + gap;
    const total = items.length;
    const loopWidth = itemSpan * total;

    const meshes = items.map((item, i) => {
      const geometry = new Plane(gl, { widthSegments: 20, heightSegments: 1 });
      const texture = new Texture(gl, { generateMipmaps: false });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        texture.image = img;
      };
      img.src = item.image;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: texture },
          uTime: { value: 0 },
          uAlpha: { value: 1 },
        },
        transparent: true,
      });

      const mesh = new Mesh(gl, { geometry, program });
      mesh.scale.set(planeWidth, planeHeight, 1);
      mesh.setParent(scene);
      (mesh as any).userData = {
        baseX: i * itemSpan,
        originalIndex: i,
        hoverScale: 1.0,
        targetScale: 1.0,
      };
      return mesh;
    });

    const scroll = { current: 0, target: 0, ease: scrollEase };
    let isDown = false;
    let start = 0;
    const mousePos = { x: -9999, y: -9999 };

    function onDown(e: MouseEvent | TouchEvent) {
      isDown = true;
      start = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (root) root.style.cursor = 'grabbing';
    }

    function onMove(e: MouseEvent | TouchEvent) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (root) {
        const rect = root.getBoundingClientRect();
        mousePos.x = clientX - rect.left;
        mousePos.y = clientY - rect.top;
      }

      if (!isDown) return;
      const sensitivity = isMobile ? 0.018 : 0.012;
      const delta = (start - clientX) * sensitivity;
      scroll.target += delta;
      start = clientX;
    }

    function onUp() {
      isDown = false;
      if (root) root.style.cursor = 'grab';
    }

    function onWheel(e: WheelEvent) {
      scroll.target += (e.deltaY || e.deltaX) * 0.0025;
    }

    function onMouseLeave() {
      mousePos.x = -9999;
      mousePos.y = -9999;
    }

    root.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    root.addEventListener('mouseleave', onMouseLeave);
    root.addEventListener('touchstart', onDown, { passive: true });
    root.addEventListener('touchmove', onMove, { passive: true });
    root.addEventListener('touchend', onUp);
    root.addEventListener('wheel', onWheel, { passive: true });

    function resize() {
      if (!root || !renderer || !camera) return;
      const rect = root.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      camera.perspective({ aspect: rect.width / rect.height });
    }

    window.addEventListener('resize', resize);
    resize();

    let raf: number;
    let lastCenteredIndex = -1;

    function update(t: number) {
      scroll.current += (scroll.target - scroll.current) * scroll.ease;

      // Convert mouse position to 3D world space coordinates
      let worldMouseX = -9999;
      let worldMouseY = -9999;

      if (root && mousePos.x !== -9999) {
        const rect = root.getBoundingClientRect();
        const fovRad = (45 * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(fovRad / 2) * 10;
        const visibleWidth = visibleHeight * (rect.width / rect.height);

        worldMouseX = ((mousePos.x / rect.width) * 2 - 1) * (visibleWidth / 2);
        worldMouseY = -((mousePos.y / rect.height) * 2 - 1) * (visibleHeight / 2);
      }

      let closestDist = Infinity;
      let closestItemIndex = 0;
      let isAnyHovered = false;

      meshes.forEach((mesh) => {
        const meshData = (mesh as any).userData;
        let x = meshData.baseX - scroll.current;
        // wrap into continuous loop
        x = ((x % loopWidth) + loopWidth) % loopWidth;
        if (x > loopWidth / 2) x -= loopWidth;

        mesh.position.x = x;
        // shallow arc bend
        const norm = x / (loopWidth / 2);
        const bendFactor = isMobile ? bend * 0.35 : bend;
        mesh.position.y = -Math.pow(Math.abs(norm), 2) * bendFactor * 0.6;
        mesh.rotation.z = -norm * 0.12;
        mesh.program.uniforms.uTime.value = t;

        const fade = 1 - Math.min(1, Math.abs(norm) * 1.15);
        mesh.program.uniforms.uAlpha.value = Math.max(0.15, fade);

        // Check if cursor hovers over card mesh
        const isHovered =
          Math.abs(worldMouseX - mesh.position.x) < planeWidth * 0.52 &&
          Math.abs(worldMouseY - mesh.position.y) < planeHeight * 0.52;

        if (isHovered) {
          isAnyHovered = true;
          meshData.targetScale = 1.22; // Smooth 22% pop scale
        } else {
          meshData.targetScale = 1.0;
        }

        // Smoothly lerp hover pop scale
        meshData.hoverScale += (meshData.targetScale - meshData.hoverScale) * 0.12;
        const finalScaleX = planeWidth * meshData.hoverScale;
        const finalScaleY = planeHeight * meshData.hoverScale;
        mesh.scale.set(finalScaleX, finalScaleY, 1);

        // Bring popped mesh slightly forward in Z
        mesh.position.z = (meshData.hoverScale - 1.0) * 1.2;

        // Find centered item
        const distFromCenter = Math.abs(x);
        if (distFromCenter < closestDist) {
          closestDist = distFromCenter;
          closestItemIndex = meshData.originalIndex;
        }
      });

      if (root && !isDown) {
        root.style.cursor = isAnyHovered ? 'pointer' : 'grab';
      }

      if (closestItemIndex !== lastCenteredIndex) {
        lastCenteredIndex = closestItemIndex;
        if (onActiveIndexChangeRef.current) {
          onActiveIndexChangeRef.current(closestItemIndex);
        }
      }

      renderer.render({ scene, camera });
      raf = requestAnimationFrame(update);
    }

    raf = requestAnimationFrame(update);

    // Gentle autoplay drift
    const idleDrift = setInterval(() => {
      if (!isDown) scroll.target += 0.04;
    }, 45);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(idleDrift);
      window.removeEventListener('resize', resize);
      root.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      root.removeEventListener('mouseleave', onMouseLeave);
      root.removeEventListener('touchstart', onDown);
      root.removeEventListener('touchmove', onMove);
      root.removeEventListener('touchend', onUp);
      root.removeEventListener('wheel', onWheel);
      if (renderer && renderer.gl && renderer.gl.canvas && renderer.gl.canvas.parentNode) {
        renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas as HTMLCanvasElement);
      }
    };
  }, [items, bend, scrollEase]);

  return (
    <div
      ref={rootRef}
      className={`w-full h-full relative cursor-grab select-none ${className}`}
    />
  );
}
