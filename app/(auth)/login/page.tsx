'use client'

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const errorParam = searchParams.get('error');
  const redirectedFrom = searchParams.get('redirectedFrom');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'El correo electrónico es requerido';
    if (!password) newErrors.password = 'La contraseña es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsPending(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ global: error.message });
        setIsPending(false);
        return;
      }

      router.push('/catalogo');
      router.refresh();
    } catch (err: any) {
      setErrors({ global: err.message || 'Ocurrió un error inesperado' });
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-gray-100">
        {/* Top Header & Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-extrabold tracking-tight text-[#0066CC]">
              Pharma<span className="text-[#003366]">B2B</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#003366]">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Portal exclusivo para distribuidores
          </p>
        </div>

        {/* Global/Pending Alerts */}
        {errorParam === 'pending_approval' && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Cuenta pendiente de aprobación</p>
              <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                Tu empresa aún no ha sido aprobada por el administrador. Te notificaremos por correo electrónico una vez que tu cuenta esté habilitada.
              </p>
            </div>
          </div>
        )}

        {errors?.global && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <span>{errors.global}</span>
          </div>
        )}

        {redirectedFrom && !errorParam && (
          <div className="rounded-lg bg-blue-50 border border-blue-150 p-4 text-sm text-blue-800">
            Debes iniciar sesión para acceder a esta sección.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="ejemplo@farmacia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                    errors?.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors?.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                    errors?.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors?.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#0066CC] hover:bg-[#0055b3] focus:outline-none disabled:bg-blue-400 transition-colors cursor-pointer shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            ¿Aún no tienes acceso?{' '}
            <Link
              href="/registro"
              className="font-medium text-[#0066CC] hover:text-[#0055b3] transition-colors"
            >
              Solicita tu acceso aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#0066CC] mb-4 text-center" />
          <p className="text-sm text-gray-500">Cargando formulario de inicio de sesión...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
