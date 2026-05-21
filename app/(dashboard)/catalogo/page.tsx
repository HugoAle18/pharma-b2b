import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CatalogClient from './CatalogClient';

// Enable dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const supabase = await createClient();

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const { data: prodData } = await supabase
      .from('productos')
      .select('*, categoria:categorias(*)')
      .eq('activo', true)
      .order('nombre');
    
    if (prodData) {
      products = prodData;
    }

    const { data: catData } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre');

    if (catData) {
      categories = catData;
    }
  } catch (error) {
    console.error('Failed to load catalog data from Supabase:', error);
  }

  return (
    <CatalogClient
      initialProducts={products}
      categories={categories}
    />
  );
}
