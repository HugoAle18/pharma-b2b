import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminOrdenesClient from './AdminOrdenesClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdenesPage() {
  const supabase = await createClient();

  let orders: any[] = [];

  try {
    const { data } = await supabase
      .from('pedidos')
      .select('*, empresa:empresas(*)')
      .order('created_at', { ascending: false });

    if (data) {
      orders = data;
    }
  } catch (error) {
    console.error('Failed to load admin orders data:', error);
  }

  return <AdminOrdenesClient initialOrders={orders} />;
}
