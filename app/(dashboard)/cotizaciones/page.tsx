import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FileText, Eye, ArrowRight, FileQuestion } from 'lucide-react';
import NuevaCotizacionBtn from './NuevaCotizacionBtn';

export const dynamic = 'force-dynamic';

export default async function CotizacionesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Load user profile and company quotes
  let quotes: any[] = [];
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single();

    if (profile?.empresa_id) {
      const { data } = await supabase
        .from('cotizaciones')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .order('created_at', { ascending: false });
      
      if (data) {
        quotes = data;
      }
    }
  } catch (error) {
    console.error('Failed to load quotes:', error);
  }

  // Helper to color code statuses
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'enviada':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'aprobada':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rechazada':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return 'Borrador';
      case 'enviada':
        return 'Enviada';
      case 'aprobada':
        return 'Aprobada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header and "New Quote" action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#003366]">Bandeja de Cotizaciones</h2>
          <p className="text-sm text-gray-500 mt-1">
            Revisa y gestiona las solicitudes de cotización realizadas por tu empresa.
          </p>
        </div>
        <NuevaCotizacionBtn />
      </div>

      {/* List Table */}
      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <div className="p-4 bg-gray-50 rounded-full text-gray-300 w-fit mx-auto mb-4">
            <FileText className="h-12 w-12" />
          </div>
          <p className="font-bold text-gray-700 text-lg">No tienes cotizaciones registradas</p>
          <p className="text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            Puedes agregar productos desde el catálogo al carrito y presionar "Generar Nueva Cotización" para crear tu primer borrador.
          </p>
          <div className="mt-6">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-[#0066CC] font-bold text-sm hover:underline"
            >
              Ir al catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Número</th>
                  <th className="px-6 py-4">Fecha de Creación</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Total Estimado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-[120px]">
                      #{quote.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(
                          quote.estado
                        )}`}
                      >
                        {getStatusLabel(quote.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-950">
                      ${quote.total_estimado.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/cotizaciones/${quote.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Ver Detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
