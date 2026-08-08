import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TITULO = 'GrowTrack Pro';

export default function LoginIntro() {
  const [letras, setLetras] = useState(0);
  const [mostrarIcono, setMostrarIcono] = useState(false);

  useEffect(() => {
    // El tipeo arranca cuando el sol ya salió (ver delay del <motion.g> del sol).
    const arrancar = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i += 1;
        setLetras(i);
        if (i >= TITULO.length) {
          clearInterval(t);
          setTimeout(() => setMostrarIcono(true), 150);
        }
      }, 60);
    }, 700);
    return () => clearTimeout(arrancar);
  }, []);

  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <svg width="54" height="40" viewBox="0 0 54 40" className="overflow-visible">
        <motion.g
          initial={{ y: 26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '27px 20px' }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="27" y1="6" x2="27" y2="11"
                stroke="#D8A84E"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${deg} 27 20)`}
              />
            ))}
          </motion.g>
          <circle cx="27" cy="20" r="9" fill="#D8A84E" />
        </motion.g>
      </svg>

      <h1 className="font-display text-[50px] font-semibold leading-none tracking-tight">
        {TITULO.slice(0, letras)}
        {letras < TITULO.length && <span className="animate-pulse text-chloro">|</span>}
      </h1>

      {mostrarIcono && (
        <svg width="40" height="40" viewBox="0 0 46 46" className="mt-1 overflow-visible">
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
