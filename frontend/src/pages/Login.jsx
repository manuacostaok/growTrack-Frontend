import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/AuthBackground';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  async function onSubmit(values) {
    setError('');
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión.');
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-[380px] rounded-card border border-borderStrong bg-surface1/90 p-7 backdrop-blur-sm">
        <div className="mb-1 font-display text-lg font-semibold">Iniciar sesión</div>
        <div className="mb-6 text-[13px] text-textDim">Entrá a tu cuenta de GrowTrack Pro</div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="tu@email.com"
            className="rounded-lg border border-borderStrong bg-surface2 px-3 py-2 text-[13px] outline-none focus:border-chloro"
          />
          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="Contraseña"
            className="rounded-lg border border-borderStrong bg-surface2 px-3 py-2 text-[13px] outline-none focus:border-chloro"
          />
          {error && <div className="text-[12.5px] text-danger">{error}</div>}
          <button
            disabled={isSubmitting}
            className="mt-1 rounded-lg bg-chloro px-3 py-2 text-[13px] font-semibold text-[#0B140D] transition hover:bg-[#6BAE7C] disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="mt-5 text-center text-[12.5px] text-textDim">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-resin">
            Creá una
          </Link>
        </div>
      </div>
    </div>
  );
}
