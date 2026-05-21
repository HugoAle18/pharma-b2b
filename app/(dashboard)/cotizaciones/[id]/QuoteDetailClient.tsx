'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Cotizacion, CotizacionItem, Producto, Empresa } from '@/lib/types';
import { enviarCotizacion, convertirEnPedido, guardarNotasCotizacion } from '../actions';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Building,
  User,
  Send,
  ShoppingBag,
  Loader2,
  CheckCircle,
  FileEdit,
  Save,
} from 'lucide-react';

interface QuoteDetailClientProps {
  cotizacion: Cotizacion & { empresa?: Empresa | null };
  items: (CotizacionItem & { producto?: Producto | null })[];
  profileName: string;
}

export default function QuoteDetailClient({
  cotizacion,
  items,
  profileName,
}: QuoteDetailClientProps) {
  const [estado, setEstado] = useState(cotizacion.estado);
  const [notas, setNotas] = useState(cotizacion.notas || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
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
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'borrador':
        return 'Borrador';
      case 'enviada':
        return 'Enviada';
      case 'aprobada':
        return 'Aprobada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return status;
    }
  };

  const handleEnviar = async () => {
    setIsSubmitting(true);
    setMsg(null);
    try {
      const res = await enviarCotizacion(cotizacion.id);
      if (res.success) {
        setEstado('enviada');
        setMsg({ type: 'success', text: '¡Cotización enviada exitosamente!' });
      } else {
        setMsg({ type: 'error', text: res.error || 'Error al enviar cotización' });
      }
    } catch (error: any) {
      setMsg({ type: 'error', text: error?.message || 'Error de red' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertir = async () => {
    setIsSubmitting(true);
    setMsg(null);
    try {
      const res = await convertirEnPedido(cotizacion.id);
      if (res.success) {
        setMsg({ type: 'success', text: '¡Pedido generado! Redirigiendo...' });
        setTimeout(() => {
          window.location.href = `/pedidos/${res.pedidoId}`;
        }, 1500);
      } else {
        setMsg({ type: 'error', text: res.error || 'Error al convertir en pedido' });
      }
    } catch (error: any) {
      setMsg({ type: 'error', text: error?.message || 'Error de red' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setMsg(null);
    try {
      const res = await guardarNotasCotizacion(cotizacion.id, notas);
      if (res.success) {
        setIsEditingNotes(false);
        setMsg({ type: 'success', text: 'Notas actualizadas correctamente.' });
      } else {
        setMsg({ type: 'error', text: res.error || 'Error al guardar notas' });
      }
    } catch (error: any) {
      setMsg({ type: 'error', text: error?.message || 'Error de red' });
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Back navigation */}
      <div>
        <Link
          href="/cotizaciones"
          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#0066CC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la bandeja
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-[#0066CC] rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-[#003366]">
                  Cotización #{cotizacion.id.substring(0, 8).toUpperCase()}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(
                    estado
                  )}`}
                >
                  {getStatusLabel(estado)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">ID Completo: {cotizacion.id}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {estado === 'borrador' && (
              <>
                <button
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FileEdit className="h-4 w-4" />
                  {isEditingNotes ? 'Cancelar edición' : 'Editar notas'}
                </button>
                <button
                  onClick={handleEnviar}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#0066CC] hover:bg-[#0055b3] disabled:bg-blue-400 transition-colors cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Enviar cotización
                </button>
              </>
            )}

            {estado === 'aprobada' && (
              <button
                onClick={handleConvertir}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 transition-colors cursor-pointer shadow-sm animate-pulse"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <ShoppingBag className="h-4 w-4" />
                )}
                Convertir en Pedido
              </button>
            )}
          </div>
        </div>

        {/* Global Action Messages */}
        {msg && (
          <div
            className={`m-6 p-4 rounded-lg border text-sm flex items-center gap-2.5 ${
              msg.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-gray-100">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
              <Calendar className="h-3.5 w-3.5" /> Fecha
            </span>
            <p className="text-sm font-semibold text-gray-800">
              {new Date(cotizacion.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
              <Building className="h-3.5 w-3.5" /> Empresa
            </span>
            <p className="text-sm font-semibold text-gray-800">
              {cotizacion.empresa?.nombre || 'No disponible'}
            </p>
            <p className="text-[10px] text-gray-400">RUC: {cotizacion.empresa?.ruc}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
              <User className="h-3.5 w-3.5" /> Solicitado por
            </span>
            <p className="text-sm font-semibold text-gray-800">{profileName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Validez</span>
            <p className="text-sm font-semibold text-gray-800">15 días desde la emisión</p>
          </div>
        </div>

        {/* Product Items Table */}
        <div className="p-0 border-b border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-250 text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Cantidad</th>
                  <th className="px-6 py-4">Precio Unitario</th>
                  <th className="px-6 py-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-250 text-sm text-gray-850">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {item.producto?.nombre || 'Producto desconocido'}
                      </div>
                      {item.producto?.requiere_receta && (
                        <span className="inline-block mt-1 text-[9px] font-bold bg-red-50 text-red-800 border border-red-150 px-1 py-0.25 rounded">
                          Requiere Receta
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.producto?.sku || 'N/D'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.cantidad} unidades
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      ${item.precio_unitario.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary / Notes */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50">
          {/* Notes display / edit */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">
              Notas de la cotización
            </label>
            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Añadir observaciones..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#0066CC] focus:outline-none bg-white text-gray-900"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0055b3] transition-colors cursor-pointer"
                >
                  {isSavingNotes ? (
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Guardar notas
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-150 leading-relaxed italic">
                {cotizacion.notas || 'No se registraron comentarios u observaciones.'}
              </p>
            )}
          </div>

          {/* Quote Total */}
          <div className="flex flex-col justify-end items-end gap-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase">Total Estimado</span>
            <span className="text-3xl font-extrabold text-[#003366]">
              ${cotizacion.total_estimado.toFixed(2)}
            </span>
            <p className="text-[10px] text-gray-400">
              *Los precios no incluyen impuestos ni flete especial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
