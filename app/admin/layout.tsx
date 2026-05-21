import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let profile = null;

  try {
    const { data: p } = await supabase
      .from('profiles')
      .select('nombre_completo, rol')
      .eq('id', user.id)
      .single();

    if (!p || p.rol !== 'admin') {
      // User is not an admin, redirect them back to the client area
      redirect('/catalogo');
    }

    profile = p;
  } catch (error) {
    console.error('Failed to load admin profile:', error);
    redirect('/catalogo');
  }

  return (
    <AdminLayoutClient profile={profile}>
      {children}
    </AdminLayoutClient>
  );
}
