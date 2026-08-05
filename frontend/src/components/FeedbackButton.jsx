import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquarePlus, X } from 'lucide-react';
import { enviarFeedback } from '../api/feedback';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  async function onSubmit(e) {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setEnviando(true);
    setError('');
    try {
      await enviarFeedback(mensaje.trim(), location.pathname);
      setEnviado(true);
      setMensaje('');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo enviar. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  function cerrar() {
    setOpen(false);
    setTimeout(() => setEnviado(false), 250);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-borderStrong px-3 py-2 text-[12.5px] font-medium text-textDim transition hover:border-chloro/50 hover:bg-chloro/10 hover:text-chloro"
      >
        <MessageSquarePlus size={14} strokeWidth={1.8} />
        Dejar feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-5" onClick={cerrar}>
          <div
            className="w-full max-w-[420px] rounded-2xl border border-borderStrong bg-surface1 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="font-display text-base font-semibold">
                {enviado ? '¡Gracias!' : 'Contanos qué te parece'}
              </div>
              <button onClick={cerrar} className="text-textDim hover:text-text">
                <X size={16} />
              </button>
            </div>

            {enviado ? (
              <p className="text-[13.5px] text-textDim">
                Recibimos tu comentario. Nos ayuda un montón a mejorar GrowTrack Pro — gracias por probarlo.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Lo que te gustó, lo que no, algo roto, una idea..."
                  className="field min-h-[110px] resize-y"
                  autoFocus
                />
                {error && <div className="text-[12.5px] text-danger">{error}</div>}
                <button
                  disabled={enviando || !mensaje.trim()}
                  className="rounded-lg bg-chloro px-3.5 py-2 text-[13px] font-semibold text-[#0B140D] disabled:opacity-60"
                >
                  {enviando ? 'Enviando…' : 'Enviar'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
