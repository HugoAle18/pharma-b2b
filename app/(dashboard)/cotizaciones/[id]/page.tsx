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
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    // Load quote details
    const { data: quote, error: quoteError } = await supabase
      .from('cotizaciones')
      .select('*, empresa:empresas(*)')
      .eq('id', id)
      .single();

    if (quoteError || !quote) {
      console.error('Quote loading error:', quoteError);
      return (
        <div className="p-6 max-w-lg mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl text-red-800 font-sans">
          <h3 className="font-bold text-lg">Cotización no encontrada</h3>
          <p className="text-sm mt-1">No se pudo cargar la cotización solicitada o no tienes permisos para verla.</p>
          <div className="mt-4">
            <a
              href="/cotizaciones"
              className="inline-flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-lg text-xs font-semibold hover:bg-red-900 transition-colors"
            >
              Volver a Cotizaciones
            </a>
          </div>
        </div>
      );
    }

    // Load items for the quote
    const { data: itemRows, error: itemsError } = await supabase
      .from('cotizacion_items')
      .select('*, producto:productos(*)')
      .eq('cotizacion_id', id);

    if (itemsError) {
      console.error('Quote items loading error:', itemsError);
    }

    const items = itemRows || [];

    // Load profile name of requester
    let profileName = 'Usuario B2B';
    if (quote.profile_id) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('nombre_completo')
        .eq('id', quote.profile_id)
        .single();
      
      if (prof && prof.nombre_completo) {
        profileName = prof.nombre_completo;
      }
    }

    return (
      <QuoteDetailClient
        cotizacion={quote}
        items={items}
        profileName={profileName}
      />
    );
  } catch (error: any) {
    console.error('Failed to load quote details:', error);
    return (
      <div className="p-6 max-w-lg mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl text-red-800 font-sans">
        <h3 className="font-bold text-lg">Error al cargar la página</h3>
        <p className="text-sm mt-1">{error?.message || 'Ocurrió un error inesperado al procesar tu solicitud.'}</p>
        <div className="mt-4">
          <a
            href="/cotizaciones"
            className="inline-flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-lg text-xs font-semibold hover:bg-red-900 transition-colors"
          >
            Volver a Cotizaciones
          </a>
        </div>
      </div>
    );
  }
}
