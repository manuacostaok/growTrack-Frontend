import { useEffect, useRef } from 'react';

// Puntos de la semilla + brote, en el mismo espacio 0-24 que usa Logo.jsx,
// para que las partículas converjan exactamente en la forma del ícono.
function buildLogoTargets(count) {
  const pts = [];

  // Semilla: elipse rellena (más puntos, es la zona más "sólida")
  const seedCount = Math.round(count * 0.42);
  for (let i = 0; i < seedCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    pts.push({ x: 12 + Math.cos(a) * 3.3 * r, y: 19 + Math.sin(a) * 4 * r, tone: 'resin' });
  }

  // Tallo: línea vertical
  const stemCount = Math.round(count * 0.13);
  for (let i = 0; i < stemCount; i++) {
    pts.push({ x: 12 + (Math.random() - 0.5) * 0.5, y: 9 + Math.random() * 9.5, tone: 'chloro' });
  }

  // Dos hojas: blobs elípticos rotados, a izquierda y derecha del tallo
  const leafCount = Math.round((count - seedCount - stemCount) / 2);
  [-1, 1].forEach((side) => {
    for (let i = 0; i < leafCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      const lx = 12 + side * 2.6 + Math.cos(a) * 2.6 * r;
      const ly = 8.2 + Math.sin(a) * 1.7 * r;
      pts.push({ x: lx, y: ly, tone: 'chloro' });
    }
  });

  return pts;
}

export default function AuthBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];
    let floaters = [];
    let startTime = null;
    const CHLORO = '92,155,108';
    const RESIN = '216,168,78';

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setup();
    }

    function setup() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h * 0.42;
      const scale = Math.min(w, h) * 0.017; // tamaño del logo relativo a la pantalla

      const targets = buildLogoTargets(130);
      particles = targets.map((t) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        tx: cx + (t.x - 12) * scale * 10,
        ty: cy + (t.y - 13.5) * scale * 10,
        tone: t.tone,
        size: 1.1 + Math.random() * 1.6,
        delay: Math.random() * 500,
        duration: 1400 + Math.random() * 700,
        phase: Math.random() * Math.PI * 2,
        amp: 1.5 + Math.random() * 2,
      }));

      floaters = Array.from({ length: 18 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: 6 + Math.random() * 16,
        tone: Math.random() > 0.5 ? CHLORO : RESIN,
        alpha: 0.03 + Math.random() * 0.05,
      }));
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function draw(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Formas grandes flotando de fondo, difusas
      floaters.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < -50) f.x = w + 50;
        if (f.x > w + 50) f.x = -50;
        if (f.y < -50) f.y = h + 50;
        if (f.y > h + 50) f.y = -50;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
        grad.addColorStop(0, `rgba(${f.tone},${f.alpha})`);
        grad.addColorStop(1, `rgba(${f.tone},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Partículas que forman el logo
      particles.forEach((p) => {
        const t = Math.min(1, Math.max(0, (elapsed - p.delay) / p.duration));
        const e = easeOutCubic(t);
        let px = p.x + (p.tx - p.x) * e;
        let py = p.y + (p.ty - p.y) * e;

        if (t >= 1) {
          // ya llegó: queda "respirando" suave alrededor del punto objetivo
          px = p.tx + Math.sin(elapsed / 900 + p.phase) * p.amp * 0.4;
          py = p.ty + Math.cos(elapsed / 900 + p.phase) * p.amp * 0.4;
        }

        const color = p.tone === 'resin' ? RESIN : CHLORO;
        const alpha = 0.35 + 0.35 * e;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.shadowColor = `rgba(${color},0.8)`;
        ctx.shadowBlur = 4;
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
