'use client'

import React, { useState, useMemo } from 'react';
import { Pedido, Empresa, PedidoEstado } from '@/lib/types';
import { cambiarEstadoPedido } from '../actions';
import {
  ShoppingBag,
  Building,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  Clock,
  Box,
  Truck,
  XCircle,
  Check,
} from 'lucide-react';

interface AdminOrdenesClientProps {
  initialOrders: (Pedido & { empresa?: Empresa | null })[];
}

export default function AdminOrdenesClient({
  initialOrders,
}: AdminOrdenesClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const statusesList: { key: PedidoEstado; label: string }[] = [
    { key: 'pendiente', label: 'Pendiente' },
    { key: 'confirmado', label: 'Confirmado' },
    { key: 'en_preparacion', label: 'En Preparación' },
    { key: 'despachado', label: 'Despachado' },
    { key: 'entregado', label: 'Entregado' },
    { key: 'cancelado', label: 'Cancelado' },
  ];

  const handleStatusChange = async (id: string, newEstado: PedidoEstado) => {
    setUpdatingId(id);
    setMsg(null);
    try {
      const res = await cambiarEstadoPedido(id, newEstado);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, estado: newEstado } : o))
        );
        setMsg({ type: 'success', text: `Pedido #${id.substring(0, 8).toUpperCase()} actualizado con éxito.` });
      } else {
        setMsg({ type: 'error', text: res.error || 'Error al cambiar estado' });
      }
    } catch (error: any) {
      setMsg({ type: 'error', text: error?.message || 'Error de red' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!filterStatus) return orders;
    return orders.filter((o) => o.estado === filterStatus);
  }, [orders, filterStatus]);

  // Helper to color code statuses
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'confirmado':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'en_preparacion':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'despachado':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'entregado':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelado':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a5f3c]">Pedidos Recibidos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Monitorea todos los pedidos del portal B2B y actualiza su estado logístico en tiempo real.
            </p>
          </div>
          <div className="text-sm font-semibold text-gray-500 shrink-0">
            {filteredOrders.length} orden(es) encontradas
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !filterStatus
                ? 'bg-[#1a5f3c] text-white'
                : 'bg-gray-150 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Todos
          </button>
          {statusesList.map((st) => (
            <button
              key={st.key}
              onClick={() => setFilterStatus(st.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st.key
                  ? 'bg-[#1a5f3c] text-white'
                  : 'bg-gray-150 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global state messages */}
      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full shrink-0 bg-current animate-ping" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <div className="p-4 bg-gray-50 rounded-full text-gray-300 w-fit mx-auto mb-4">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <p className="font-bold text-gray-700 text-lg">No se encontraron pedidos</p>
          <p className="text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            Ninguna orden en el sistema coincide con el estado de filtro seleccionado en la barra superior.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Orden</th>
                  <th className="px-6 py-4">Fecha de Compra</th>
                  <th className="px-6 py-4">Empresa / Cliente</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Estado Actual</th>
                  <th className="px-6 py-4 text-right">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-850">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Order number */}
                      <td className="px-6 py-4 font-semibold text-gray-900 font-mono text-xs truncate max-w-[100px]">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </td>

                      {/* Purchase Date */}
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Customer / Company details */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 leading-snug">
                          {order.empresa?.nombre || 'Desconocido'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          RUC: {order.empresa?.ruc}
                        </p>
                      </td>

                      {/* Total price */}
                      <td className="px-6 py-4 font-bold text-gray-950">
                        ${order.total.toFixed(2)}
                      </td>

                      {/* Current Status style */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(
                            order.estado
                          )}`}
                        >
                          {order.estado.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Select Dropdown status modifier */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isUpdating && (
                            <Loader2 className="animate-spin h-4 w-4 text-[#1a5f3c] shrink-0" />
                          )}
                          <select
                            disabled={isUpdating}
                            value={order.estado}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as PedidoEstado)
                            }
                            className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900 cursor-pointer"
                          >
                            {statusesList.map((st) => (
                              <option key={st.key} value={st.key}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </div>
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
