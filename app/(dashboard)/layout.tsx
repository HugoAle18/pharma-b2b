import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CartProvider } from '@/lib/context/CartContext';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({
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

  // Fetch profile and enterprise details
  let profile = null;
  let empresa = null;

  try {
    const { data: p } = await supabase
      .from('profiles')
      .select('nombre_completo, rol, empresa_id')
      .eq('id', user.id)
      .single();

    if (p) {
      profile = {
        nombre_completo: p.nombre_completo,
        rol: p.rol,
      };

      if (p.empresa_id) {
        const { data: emp } = await supabase
          .from('empresas')
          .select('id, nombre, ruc')
          .eq('id', p.empresa_id)
          .single();
        if (emp) {
          empresa = emp;
        }
      }
    }
  } catch (error) {
    console.error('Failed to load dashboard layout data:', error);
  }

  return (
    <CartProvider>
      <DashboardLayoutClient profile={profile} empresa={empresa}>
        {children}
      </DashboardLayoutClient>
    </CartProvider>
  );
}
