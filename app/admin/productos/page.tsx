import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminProductosClient from './AdminProductosClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductosPage() {
  const supabase = await createClient();

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const { data: prodData } = await supabase
      .from('productos')
      .select('*, categoria:categorias(*)')
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
    console.error('Failed to load admin products data:', error);
  }

  return (
    <AdminProductosClient
      initialProducts={products}
      categories={categories}
    />
  );
}
