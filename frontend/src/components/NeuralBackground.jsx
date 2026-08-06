import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let nodos = [];
    const CHLORO = '92,155,108';
    const RESIN = '216,168,78';
    const DISTANCIA_CONEXION = 130;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const cantidad = Math.round((w * h) / 18000);
      nodos = Array.from({ length: Math.min(70, Math.max(24, cantidad)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        tone: Math.random() > 0.5 ? CHLORO : RESIN,
      }));
    }

    function draw() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      nodos.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < nodos.length; i++) {
        for (let j = i + 1; j < nodos.length; j++) {
          const a = nodos[i], b = nodos[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < DISTANCIA_CONEXION) {
            const alpha = (1 - dist / DISTANCIA_CONEXION) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(92,155,108,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodos.forEach((n) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${n.tone},0.55)`;
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

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

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
