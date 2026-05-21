'use client'

import { useActionState } from 'react';
import Link from 'next/link';
import { registerAction } from '../actions';
import { User, Mail, Lock, Building, FileSpreadsheet, Phone, MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const initialState = {
  success: false,
  errors: {} as Record<string, string>,
};

export default function RegistroPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-gray-100 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-green-50 text-green-600 rounded-full">
              <CheckCircle className="h-16 w-16" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#003366] mt-6">
            ¡Registro recibido con éxito!
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Tu cuenta está pendiente de aprobación. Revisaremos los datos de tu empresa y te notificaremos por email una vez habilitado el acceso.
          </p>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/login"
              className="inline-flex justify-center items-center py-2.5 px-6 rounded-lg text-sm font-semibold text-white bg-[#0066CC] hover:bg-[#0055b3] transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-gray-100">
        {/* Header & Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-extrabold tracking-tight text-[#0066CC]">
              Pharma<span className="text-[#003366]">B2B</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#003366]">
            Solicitar acceso
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Portal exclusivo para distribuidores
          </p>
        </div>

        {state?.errors?.global && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <span>{state.errors.global}</span>
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-[#003366] pb-1 border-b border-gray-100">
                Datos Personales
              </h3>

              {/* Full Name */}
              <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.nombreCompleto ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.nombreCompleto && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.nombreCompleto}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contacto
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="juan@farmacia.com"
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.email && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Mín. 6 caracteres"
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.password && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.password}</p>
                )}
              </div>
            </div>

            {/* Column 2: Enterprise Details */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-[#003366] pb-1 border-b border-gray-100">
                Datos de la Empresa
              </h3>

              {/* Enterprise Name */}
              <div>
                <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
                  Razón Social / Empresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building className="h-4 w-4" />
                  </div>
                  <input
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    type="text"
                    required
                    placeholder="Farmacias del Sur S.A.C."
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.nombreEmpresa ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.nombreEmpresa && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.nombreEmpresa}</p>
                )}
              </div>

              {/* RUC */}
              <div>
                <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-1">
                  RUC (11 dígitos)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <input
                    id="ruc"
                    name="ruc"
                    type="text"
                    required
                    maxLength={11}
                    placeholder="20123456789"
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.ruc ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.ruc && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.ruc}</p>
                )}
              </div>

              {/* Telephone */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono / Celular
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    required
                    placeholder="+51 987654321"
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.telefono ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.telefono && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.telefono}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    required
                    placeholder="Av. Los Naranjos 123, Arequipa"
                    className={`block w-full pl-9 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-455 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm ${
                      state?.errors?.direccion ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {state?.errors?.direccion && (
                  <p className="mt-1 text-xs text-red-600">{state.errors.direccion}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#0066CC] hover:bg-[#0055b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066CC] disabled:bg-blue-400 transition-colors cursor-pointer shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Registrando y solicitando acceso...
                </>
              ) : (
                'Solicitar acceso'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta aprobada?{' '}
            <Link
              href="/login"
              className="font-medium text-[#0066CC] hover:text-[#0055b3] transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
