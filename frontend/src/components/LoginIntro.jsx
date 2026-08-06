import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TITULO = 'GrowTrack Pro';

export default function LoginIntro() {
  const [letras, setLetras] = useState(0);
  const [mostrarIcono, setMostrarIcono] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setLetras(i);
      if (i >= TITULO.length) {
        clearInterval(t);
        setTimeout(() => setMostrarIcono(true), 150);
      }
    }, 60);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mb-6 flex flex-col items-center gap-3">
      <h1 className="font-display text-[50px] font-semibold tracking-tight">
        {TITULO.slice(0, letras)}
        {letras < TITULO.length && <span className="animate-pulse text-chloro">|</span>}
      </h1>

      {mostrarIcono && (
        <svg width="80" height="80" viewBox="0 0 46 46" className="overflow-visible">
          <motion.path
            d="M6 36 Q23 32 40 36"
            stroke="#333C2C"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
          <motion.ellipse
            cx="23"
            rx="3.2"
            ry="3.8"
            fill="#D8A84E"
            initial={{ cy: -6, opacity: 0 }}
            animate={{ cy: 34, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeIn' }}
          />
          <motion.line
            x1="23" x2="23" y1="34" y2="34"
            stroke="#5C9B6C"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ y2: 34 }}
            animate={{ y2: 16 }}
            transition={{ duration: 0.4, delay: 0.65, ease: 'easeOut' }}
          />
          <motion.path
            d="M23 24c-5-1-8-4-8-9 5 0 8 3 9 7"
            fill="#5C9B6C"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: '23px 24px' }}
            transition={{ duration: 0.3, delay: 0.9, ease: 'backOut' }}
          />
          <motion.path
            d="M23 20c5-1 8-4 8-9-5 0-8 3-9 7"
            fill="#D8A84E"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: '23px 20px' }}
            transition={{ duration: 0.3, delay: 1.05, ease: 'backOut' }}
          />
        </svg>
      )}
    </div>
  );
}
