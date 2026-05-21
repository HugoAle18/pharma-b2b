'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearCotizacionDesdeCarrito(
  items: { producto_id: string; cantidad: number; precio_unitario: number; subtotal: number }[],
  notas: string | null
) {
  if (!items || items.length === 0) {
    return { success: false, error: 'El carrito está vacío' };
  }

  const supabase = await createClient()

  // 1. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Sesión no iniciada' };
  }

  // 2. Load user profile and company
  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.empresa_id) {
    return { success: false, error: 'El usuario no tiene una empresa asignada' };
  }

  const totalEstimado = items.reduce((sum, item) => sum + item.subtotal, 0);

  // 3. Create Quote (estado = 'borrador')
  const { data: cotizacion, error: quoteError } = await supabase
    .from('cotizaciones')
    .insert({
      empresa_id: profile.empresa_id,
      profile_id: user.id,
      estado: 'borrador',
      notas,
      total_estimado: totalEstimado,
    })
    .select()
    .single()

  if (quoteError || !cotizacion) {
    return {
      success: false,
      error: `Error al crear cabecera de cotización: ${quoteError?.message}`,
    };
  }

  // 4. Create Quote Items
  const itemsToInsert = items.map((item) => ({
    cotizacion_id: cotizacion.id,
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));

  const { error: itemsError } = await supabase
    .from('cotizacion_items')
    .insert(itemsToInsert)

  if (itemsError) {
    // If items fail, clean up the header to prevent orphans
    await supabase.from('cotizaciones').delete().eq('id', cotizacion.id);
    return {
      success: false,
      error: `Error al registrar los items de cotización: ${itemsError.message}`,
    };
  }

  revalidatePath('/cotizaciones');
  return { success: true, cotizacionId: cotizacion.id };
}

export async function enviarCotizacion(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cotizaciones')
    .update({ estado: 'enviada', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cotizaciones');
  revalidatePath(`/cotizaciones/${id}`);
  return { success: true };
}

export async function guardarNotasCotizacion(id: string, notas: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cotizaciones')
    .update({ notas, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/cotizaciones/${id}`);
  return { success: true };
}

export async function convertirEnPedido(cotizacionId: string) {
  const supabase = await createClient()

  // 1. Get quote
  const { data: cotizacion, error: quoteError } = await supabase
    .from('cotizaciones')
    .select('*')
    .eq('id', cotizacionId)
    .single()

  if (quoteError || !cotizacion) {
    return {
      success: false,
      error: `No se pudo encontrar la cotización: ${quoteError?.message}`,
    };
  }

  if (cotizacion.estado !== 'aprobada') {
    return {
      success: false,
      error: 'Solo las cotizaciones aprobadas se pueden convertir en pedidos',
    };
  }

  // 2. Get enterprise shipping address
  const { data: empresa } = await supabase
    .from('empresas')
    .select('direccion')
    .eq('id', cotizacion.empresa_id)
    .single()

  if (!empresa) {
    return { success: false, error: 'No se encontró la empresa asociada' };
  }

  // 3. Get quote items
  const { data: items, error: itemsError } = await supabase
    .from('cotizacion_items')
    .select('*')
    .eq('cotizacion_id', cotizacionId)

  if (itemsError || !items || items.length === 0) {
    return {
      success: false,
      error: `Error al cargar los items de la cotización: ${itemsError?.message}`,
    };
  }

  // 4. Create Order (Pedido)
  const { data: pedido, error: orderError } = await supabase
    .from('pedidos')
    .insert({
      empresa_id: cotizacion.empresa_id,
      profile_id: cotizacion.profile_id,
      cotizacion_id: cotizacion.id,
      estado: 'pendiente',
      total: cotizacion.total_estimado,
      direccion_entrega: empresa.direccion,
      notes: cotizacion.notas, // In schema we wrote notes or notas? Let's check: in types.ts we wrote: notes/notas?
      // Wait, in types.ts we wrote:
      // Pedido: notas: string | null;
      // In the table description: "pedidos: id, empresa_id, cotizacion_id (nullable), profile_id, estado, total, direccion_entrega, notas, created_at"
      // So the DB field name is indeed `notas`! Let's correct it to `notas`.
      notas: cotizacion.notas,
    })
    .select()
    .single()

  if (orderError || !pedido) {
    return {
      success: false,
      error: `Error al crear la orden del pedido: ${orderError?.message}`,
    };
  }

  // 5. Create Order Items (Pedido Items)
  const orderItemsToInsert = items.map((item) => ({
    pedido_id: pedido.id,
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
    subtotal: item.subtotal,
  }));

  const { error: orderItemsError } = await supabase
    .from('pedido_items')
    .insert(orderItemsToInsert)

  if (orderItemsError) {
    // Clean up order header
    await supabase.from('pedidos').delete().eq('id', pedido.id);
    return {
      success: false,
      error: `Error al registrar los items del pedido: ${orderItemsError.message}`,
    };
  }

  revalidatePath('/pedidos');
  revalidatePath(`/cotizaciones/${cotizacionId}`);
  return { success: true, pedidoId: pedido.id };
}
