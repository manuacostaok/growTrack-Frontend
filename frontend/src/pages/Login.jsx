import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Aurora from '../components/Aurora';
import NeuralBackground from '../components/NeuralBackground';
import LoginIntro from '../components/LoginIntro';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  async function onSubmit(values) {
    setError('');
    try {
      await login(values.email, values.password);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión.');
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4">
      <div className="absolute inset-0">
        <Aurora colorStops={['#5C9B6C', '#16221A', '#D8A84E']} amplitude={1.0} blend={0.5} speed={0.8} />
      </div>
      <NeuralBackground />

      <div className="relative z-10 flex flex-col items-center">
        <LoginIntro />

        <div className="w-full max-w-[380px] rounded-card border border-borderStrong bg-surface1/90 p-7 backdrop-blur-sm">
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
    </div>
  );
}
