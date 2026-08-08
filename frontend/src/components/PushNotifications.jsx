import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { obtenerPublicKey, suscribirPush, desuscribirPush } from '../api/push';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function detectarPlataforma() {
  const ua = navigator.userAgent;
  const esIOS = /iPad|iPhone|iPod/.test(ua);
  const esStandalone =
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  return { esIOS, esStandalone };
}

export default function PushNotifications() {
  const [soportado, setSoportado] = useState(true);
  const [suscripto, setSuscripto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { esIOS, esStandalone } = detectarPlataforma();
  const necesitaInstalar = esIOS && !esStandalone;

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setSoportado(false);
      return;
    }
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      if (!reg) return;
      const sub = await reg.pushManager.getSubscription();
      setSuscripto(!!sub);
    });
  }, []);

  async function activar() {
    if (necesitaInstalar) return; // el botón está deshabilitado en ese caso, esto es por las dudas
    setCargando(true);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        toast.error('Necesitás aceptar el permiso de notificaciones para activarlas.');
        return;
      }

      const publicKey = await obtenerPublicKey();
      if (!publicKey) {
        toast.error('Las notificaciones push todavía no están configuradas del lado del servidor.');
        return;
      }

      const reg = await navigator.serviceWorker.register('/sw.js');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await suscribirPush(sub.toJSON());
      setSuscripto(true);
      toast.success('¡Notificaciones activadas! 🌱');
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudieron activar las notificaciones.');
    } finally {
      setCargando(false);
    }
  }

  async function desactivar() {
    setCargando(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await desuscribirPush(sub.endpoint);
        await sub.unsubscribe();
      }
      setSuscripto(false);
      toast.success('Notificaciones desactivadas.');
    } catch {
      toast.error('No se pudieron desactivar. Probá de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  if (!soportado) {
    return (
      <div className="text-[12.5px] text-textFaint">
        Tu navegador no soporta notificaciones push.
      </div>
    );
  }

  return (
    <div>
      {necesitaInstalar && (
        <div className="mb-3 rounded-lg border border-resin/30 bg-resin/10 p-3.5 text-[12.5px] text-resin">
          En iPhone, Safari solo permite notificaciones si agregás GrowTrack Pro a tu pantalla de inicio:
          tocá el botón <b>Compartir</b> (el cuadrado con la flecha, abajo del navegador) y elegí{' '}
          <b>"Agregar a pantalla de inicio"</b>. Después abrí la app desde ese ícono y volvé acá.
        </div>
      )}

      <button
        onClick={suscripto ? desactivar : activar}
        disabled={cargando || necesitaInstalar}
        className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold disabled:opacity-50 ${
          suscripto
            ? 'border border-borderStrong text-textDim hover:border-danger/50 hover:text-danger'
            : 'bg-chloro text-[#0B140D]'
        }`}
      >
        {cargando ? 'Un momento…' : suscripto ? 'Desactivar notificaciones' : 'Activar notificaciones'}
      </button>
    </div>
  );
}
