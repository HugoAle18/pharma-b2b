'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Pedido, PedidoItem, Producto, Empresa } from '@/lib/types';
import { cancelarPedido } from '../actions';
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Box,
  Check,
  Loader2,
} from 'lucide-react';

interface OrderDetailClientProps {
  pedido: Pedido & { empresa?: Empresa | null };
  items: (PedidoItem & { producto?: Producto | null })[];
  profileName: string;
}

export default function OrderDetailClient({
  pedido,
  items,
  profileName,
}: OrderDetailClientProps) {
  const [estado, setEstado] = useState(pedido.estado);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const trackingSteps = [
    { key: 'pendiente', label: 'Pendiente', icon: Clock },
    { key: 'confirmado', label: 'Confirmado', icon: Check },
    { key: 'en_preparacion', label: 'En Preparación', icon: Box },
    { key: 'despachado', label: 'Despachado', icon: Truck },
    { key: 'entregado', label: 'Entregado', icon: CheckCircle2 },
  ];

  // Resolve active step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 0;
      case 'confirmado':
        return 1;
      case 'en_preparacion':
        return 2;
      case 'despachado':
        return 3;
      case 'entregado':
        return 4;
      default:
        return -1; // e.g. cancelado
    }
  };

  const currentStepIndex = getStepIndex(estado);

  const handleCancelar = async () => {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await cancelarPedido(pedido.id);
      if (res.success) {
        setEstado('cancelado');
        setSuccessMsg('Pedido cancelado exitosamente.');
      } else {
        setErrorMsg(res.error || 'Error al cancelar el pedido');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Back button */}
      <div>
        <Link
          href="/pedidos"
          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#0066CC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la bandeja
        </Link>
      </div>

      {/* Stepper Timeline Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-205 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
          Estado del Despacho
        </h3>

        {estado === 'cancelado' ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-5 text-sm text-red-800 flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-650 shrink-0" />
            <div>
              <p className="font-bold text-lg leading-none text-red-900">Pedido Cancelado</p>
              <p className="mt-2 text-xs text-red-750 max-w-lg leading-relaxed">
                Este pedido ha sido cancelado y no será procesado por nuestro centro de distribución. Si requieres reactivar la compra, crea una nueva cotización.
              </p>
            </div>
          </div>
        ) : (
          /* Stepper visual pipeline */
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
            {/* Horizontal line for desktop */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden md:block z-0" />

            {trackingSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 relative z-10"
                >
                  {/* Icon circle */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-[#0066CC] border-[#0066CC] text-white shadow-md shadow-blue-100'
                        : 'bg-white border-gray-305 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-blue-100 scale-105' : ''}`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  {/* Step Label */}
                  <div className="text-left md:text-center">
                    <p
                      className={`text-sm font-bold ${
                        isCompleted ? 'text-[#003366]' : 'text-gray-450'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-[#0066CC] bg-blue-50 px-2 py-0.25 rounded-full border border-blue-100">
                        Estado Actual
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Order Card Details */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-[#0066CC] rounded-xl">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#003366]">
                Detalle de Orden #{pedido.id.substring(0, 8).toUpperCase()}
              </h2>
              <p className="text-xs text-gray-400 mt-1">ID de Pedido: {pedido.id}</p>
            </div>
          </div>

          {/* Cancel button if pending */}
          {estado === 'pendiente' && (
            <button
              onClick={handleCancelar}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 rounded-lg text-sm font-semibold text-red-650 hover:bg-red-50 disabled:bg-gray-100 transition-colors cursor-pointer bg-white"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Cancelar Pedido
            </button>
          )}
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Metadata info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-gray-100">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
              <Calendar className="h-3.5 w-3.5" /> Fecha Compra
            </span>
            <p className="text-sm font-semibold text-gray-800">
              {new Date(pedido.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
              <MapPin className="h-3.5 w-3.5" /> Dirección de Entrega
            </span>
            <p className="text-sm font-semibold text-gray-850 truncate max-w-[200px]">
              {pedido.direccion_entrega}
            </p>
            <p className="text-[10px] text-gray-400">Cliente: {pedido.empresa?.nombre}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase">
              <FileText className="h-3.5 w-3.5" /> Cotización de Origen
            </span>
            <p className="text-sm font-semibold text-gray-800">
              {pedido.cotizacion_id ? (
                <Link
                  href={`/cotizaciones/${pedido.cotizacion_id}`}
                  className="text-[#0066CC] hover:underline"
                >
                  #{pedido.cotizacion_id.substring(0, 8).toUpperCase()}
                </Link>
              ) : (
                'Compra Directa'
              )}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Contacto</span>
            <p className="text-sm font-semibold text-gray-800">{profileName}</p>
            <p className="text-[10px] text-gray-400">{pedido.empresa?.telefono}</p>
          </div>
        </div>

        {/* Table of items */}
        <div className="p-0 border-b border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-250 text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Medicamento / Producto</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Cantidad</th>
                  <th className="px-6 py-4">Precio Pactado</th>
                  <th className="px-6 py-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-250 text-sm text-gray-850">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {item.producto?.nombre || 'Producto no identificado'}
                      </div>
                      {item.producto?.requiere_receta && (
                        <span className="inline-block mt-1 text-[9px] font-bold bg-red-50 text-red-850 border border-red-150 px-1 py-0.25 rounded">
                          Receta Retenida
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.producto?.sku || 'N/D'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.cantidad} unidades
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      ${item.precio_unitario.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-950">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase">Instrucciones / Notas</span>
            <p className="text-xs text-gray-650 bg-white p-3 rounded-lg border border-gray-150 italic leading-relaxed">
              {pedido.notas || 'Sin notas especiales de distribución.'}
            </p>
          </div>

          <div className="flex flex-col justify-end items-end gap-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase">Monto Total Facturado</span>
            <span className="text-3xl font-extrabold text-[#003366]">
              ${pedido.total.toFixed(2)}
            </span>
            <p className="text-[10px] text-gray-400">
              * Facturado electrónicamente. El documento fue enviado al email corporativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
