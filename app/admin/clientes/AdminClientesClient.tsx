'use client'

import React, { useState } from 'react';
import { Empresa } from '@/lib/types';
import { cambiarAprobacionEmpresa } from '../actions';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface AdminClientesClientProps {
  initialCompanies: Empresa[];
}

export default function AdminClientesClient({
  initialCompanies,
}: AdminClientesClientProps) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleAprobada = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    setLoadingId(id);
    try {
      const res = await cambiarAprobacionEmpresa(id, newVal);
      if (res.success) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === id ? { ...c, aprobada: newVal } : c))
        );
      } else {
        alert(`Error al cambiar estado: ${res.error}`);
      }
    } catch (error: any) {
      alert(`Error de red: ${error?.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Description header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#1a5f3c]">Directorio de Clientes B2B</h2>
        <p className="text-sm text-gray-500 mt-1">
          Habilita o suspende el acceso de las empresas farmacéuticas registradas en el sistema.
        </p>
      </div>

      {/* Grid List */}
      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <div className="p-4 bg-gray-50 rounded-full text-gray-300 w-fit mx-auto mb-4">
            <Building2 className="h-12 w-12" />
          </div>
          <p className="font-bold text-gray-700 text-lg">No hay empresas registradas</p>
          <p className="text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            Cuando los clientes completen el formulario de registro en línea, sus solicitudes aparecerán en esta sección para aprobación.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Razón Social / RUC</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Dirección</th>
                  <th className="px-6 py-4">Fecha Registro</th>
                  <th className="px-6 py-4">Estado Aprobación</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {companies.map((empresa) => {
                  const isLoading = loadingId === empresa.id;
                  return (
                    <tr key={empresa.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name / RUC */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-green-50 text-[#1a5f3c] rounded-xl shrink-0">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-snug">
                              {empresa.nombre}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              RUC: {empresa.ruc}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact coordinates */}
                      <td className="px-6 py-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{empresa.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-655">
                          <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{empresa.telefono}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 text-xs max-w-[200px] truncate text-gray-600">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{empresa.direccion}</span>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(empresa.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Approval Status badge */}
                      <td className="px-6 py-4">
                        {empresa.aprobada ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200">
                            <ShieldCheck className="h-3.5 w-3.5" /> Aprobada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="h-3.5 w-3.5" /> Pendiente
                          </span>
                        )}
                      </td>

                      {/* Inline Approval toggle button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleAprobada(empresa.id, empresa.aprobada)}
                          disabled={isLoading}
                          className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer disabled:bg-gray-105 disabled:text-gray-400 ${
                            empresa.aprobada
                              ? 'border-red-200 bg-white text-red-650 hover:bg-red-50'
                              : 'border-green-205 bg-white text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {isLoading ? (
                            <span className="w-4 h-4 rounded-full border-2 border-gray-305 border-t-current animate-spin" />
                          ) : empresa.aprobada ? (
                            <>
                              <XCircle className="h-3.5 w-3.5" /> Suspender
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar Acceso
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
