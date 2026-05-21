import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import OrderDetailClient from './OrderDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PedidoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let pedido = null;
  let items: any[] = [];
  let profileName = 'Usuario B2B';

  try {
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .select('*, empresa:empresas(*)')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return notFound();
    }
    pedido = order;

    // Load items for the order
    const { data: itemRows } = await supabase
      .from('pedido_items')
      .select('*, producto:productos(*)')
      .eq('pedido_id', id);

    if (itemRows) {
      items = itemRows;
    }

    // Load profile name of requester
    const { data: prof } = await supabase
      .from('profiles')
      .select('nombre_completo')
      .eq('id', order.profile_id)
      .single();

    if (prof) {
      profileName = prof.nombre_completo;
    }
  } catch (error) {
    console.error('Failed to load order details:', error);
    return notFound();
  }

  return (
    <OrderDetailClient
      pedido={pedido}
      items={items}
      profileName={profileName}
    />
  );
}
