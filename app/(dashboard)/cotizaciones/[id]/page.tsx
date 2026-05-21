import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import QuoteDetailClient from './QuoteDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Load quote details
  let cotizacion = null;
  let items: any[] = [];
  let profileName = 'Usuario B2B';

  try {
    const { data: quote, error: quoteError } = await supabase
      .from('cotizaciones')
      .select('*, empresa:empresas(*)')
      .eq('id', id)
      .single();

    if (quoteError || !quote) {
      return notFound();
    }
    cotizacion = quote;

    // Load items for the quote
    const { data: itemRows } = await supabase
      .from('cotizacion_items')
      .select('*, producto:productos(*)')
      .eq('cotizacion_id', id);

    if (itemRows) {
      items = itemRows;
    }

    // Load profile name of requester
    const { data: prof } = await supabase
      .from('profiles')
      .select('nombre_completo')
      .eq('id', quote.profile_id)
      .single();
    
    if (prof) {
      profileName = prof.nombre_completo;
    }
  } catch (error) {
    console.error('Failed to load quote details:', error);
    return notFound();
  }

  return (
    <QuoteDetailClient
      cotizacion={cotizacion}
      items={items}
      profileName={profileName}
    />
  );
}
