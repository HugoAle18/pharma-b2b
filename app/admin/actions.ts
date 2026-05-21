'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateProductoDTO, UpdateProductoDTO, PedidoEstado } from '@/lib/types'

// Helpers to verify admin role in Server Actions
async function checkAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado (sin sesión)');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!profile || profile.rol !== 'admin') {
    throw new Error('No autorizado (se requiere rol de administrador)');
  }
}

export async function crearProducto(dto: CreateProductoDTO) {
  try {
    await checkAdmin();
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('productos')
      .insert(dto)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/catalogo');
    revalidatePath('/admin/productos');
    return { success: true, producto: data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function editarProducto(id: string, dto: UpdateProductoDTO) {
  try {
    await checkAdmin();
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('productos')
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/catalogo');
    revalidatePath('/admin/productos');
    return { success: true, producto: data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleActivoProducto(id: string, activo: boolean) {
  try {
    await checkAdmin();
    const supabase = await createClient()

    const { error } = await supabase
      .from('productos')
      .update({ activo })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/catalogo');
    revalidatePath('/admin/productos');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function cambiarAprobacionEmpresa(id: string, aprobada: boolean) {
  try {
    await checkAdmin();
    const supabase = await createClient()

    const { error } = await supabase
      .from('empresas')
      .update({ aprobada })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/clientes');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function cambiarEstadoPedido(id: string, estado: PedidoEstado) {
  try {
    await checkAdmin();
    const supabase = await createClient()

    const { error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/pedidos');
    revalidatePath(`/pedidos/${id}`);
    revalidatePath('/admin/ordenes');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
