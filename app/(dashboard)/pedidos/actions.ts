'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelarPedido(id: string) {
  const supabase = await createClient()

  // 1. Fetch current order status
  const { data: pedido, error: fetchError } = await supabase
    .from('pedidos')
    .select('estado')
    .eq('id', id)
    .single()

  if (fetchError || !pedido) {
    return {
      success: false,
      error: `No se pudo encontrar el pedido: ${fetchError?.message}`,
    };
  }

  if (pedido.estado !== 'pendiente') {
    return {
      success: false,
      error: 'Solo se pueden cancelar pedidos en estado pendiente.',
    };
  }

  // 2. Update status to cancelado
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: 'cancelado' })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/pedidos');
  revalidatePath(`/pedidos/${id}`);
  return { success: true };
}
