import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  Package,
  Clock,
  Check,
  Box,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PedidosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Load profile and orders
  let orders: any[] = [];
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single();

    if (profile?.empresa_id) {
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .order('created_at', { ascending: false });
      
      if (data) {
        orders = data;
      }
    }
  } catch (error) {
    console.error('Failed to load orders:', error);
  }

  // Helper for status badge formatting
  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return {
          icon: Clock,
          color: 'bg-amber-50 text-amber-800 border-amber-250',
          label: 'Pendiente',
        };
      case 'confirmado':
        return {
          icon: Check,
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'Confirmado',
        };
      case 'en_preparacion':
        return {
          icon: Box,
          color: 'bg-orange-50 text-orange-800 border-orange-200',
          label: 'En Preparación',
        };
      case 'despachado':
        return {
          icon: Truck,
          color: 'bg-indigo-50 text-indigo-850 border-indigo-200',
          label: 'Despachado',
        };
      case 'entregado':
        return {
          icon: CheckCircle,
          color: 'bg-green-50 text-green-800 border-green-200',
          label: 'Entregado',
        };
      case 'cancelado':
        return {
          icon: XCircle,
          color: 'bg-red-50 text-red-800 border-red-205',
          label: 'Cancelado',
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: estado,
        };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#003366]">Bandeja de Pedidos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Historial de órdenes de compra y estado de despacho en tiempo real.
        </p>
      </div>

      {/* Orders Grid/Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <div className="p-4 bg-gray-50 rounded-full text-gray-300 w-fit mx-auto mb-4">
            <Package className="h-12 w-12" />
          </div>
          <p className="font-bold text-gray-700 text-lg">Aún no has realizado pedidos</p>
          <p className="text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            Cuando tu cotización sea aprobada por un administrador, podrás convertirla en un pedido y ver su estado de seguimiento en esta sección.
          </p>
          <div className="mt-6">
            <Link
              href="/cotizaciones"
              className="inline-flex items-center gap-1.5 text-[#0066CC] font-bold text-sm hover:underline"
            >
              Ver mis cotizaciones <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Orden</th>
                  <th className="px-6 py-4">Fecha de Pedido</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {orders.map((order) => {
                  const status = getStatusConfig(order.estado);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-[120px]">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-950">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detalle & Tracking
                        </Link>
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
