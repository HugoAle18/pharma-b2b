import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminClientesClient from './AdminClientesClient';

export const dynamic = 'force-dynamic';

export default async function AdminClientesPage() {
  const supabase = await createClient();

  let companies: any[] = [];

  try {
    const { data } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      companies = data;
    }
  } catch (error) {
    console.error('Failed to load admin client companies:', error);
  }

  return <AdminClientesClient initialCompanies={companies} />;
}
