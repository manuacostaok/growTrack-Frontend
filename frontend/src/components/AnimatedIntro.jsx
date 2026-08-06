import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TITULO = 'GrowTrack Pro';

export default function AnimatedIntro() {
  const [visto, setVisto] = useState(() => sessionStorage.getItem('gt_intro_visto') === '1');
  const [letras, setLetras] = useState(visto ? TITULO.length : 0);

  useEffect(() => {
    if (visto) return;
    sessionStorage.setItem('gt_intro_visto', '1');
    // El tipeo arranca cuando la semilla ya "tocó tierra" y brotaron las hojas.
    const inicio = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i += 1;
        setLetras(i);
        if (i >= TITULO.length) clearInterval(t);
      }, 55);
    }, 1350);
    return () => clearTimeout(inicio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-3 py-2">
      <svg width="46" height="46" viewBox="0 0 46 46" className="flex-shrink-0 overflow-visible">
        {/* tierra */}
        <motion.path
          d="M6 36 Q23 32 40 36"
          stroke="#333C2C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
        {/* semilla cayendo */}
        <motion.ellipse
          cx="23"
          rx="3.2"
          ry="3.8"
          fill="#D8A84E"
          initial={{ cy: -6, opacity: 0 }}
          animate={{ cy: 34, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.15, ease: 'easeIn' }}
        />
        {/* tallo */}
        <motion.line
          x1="23" x2="23" y1="34" y2="34"
          stroke="#5C9B6C"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ y2: 16 }}
          initial={{ y2: 34 }}
          transition={{ duration: 0.45, delay: 0.75, ease: 'easeOut' }}
        />
        {/* hoja izquierda */}
        <motion.path
          d="M23 24c-5-1-8-4-8-9 5 0 8 3 9 7"
          fill="#5C9B6C"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: '23px 24px' }}
          transition={{ duration: 0.35, delay: 1.0, ease: 'backOut' }}
        />
        {/* hoja derecha */}
        <motion.path
          d="M23 20c5-1 8-4 8-9-5 0-8 3-9 7"
          fill="#D8A84E"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: '23px 20px' }}
          transition={{ duration: 0.35, delay: 1.15, ease: 'backOut' }}
        />
      </svg>

      <h1 className="font-display text-[50px] font-semibold tracking-tight">
        {TITULO.slice(0, letras)}
        {letras < TITULO.length && <span className="animate-pulse text-chloro">|</span>}
      </h1>
    </div>
  );
}
