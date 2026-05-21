'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errors: Record<string, string> = {};
  if (!email) errors.email = 'El correo electrónico es requerido';
  if (!password) errors.password = 'La contraseña es requerida';

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, errors: { global: error.message } };
  }

  redirect('/catalogo')
}

export async function registerAction(prevState: any, formData: FormData) {
  const nombreCompleto = formData.get('nombreCompleto') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nombreEmpresa = formData.get('nombreEmpresa') as string;
  const ruc = formData.get('ruc') as string;
  const telefono = formData.get('telefono') as string;
  const direccion = formData.get('direccion') as string;

  const errors: Record<string, string> = {};
  if (!nombreCompleto) errors.nombreCompleto = 'El nombre completo es requerido';
  if (!email) errors.email = 'El correo electrónico es requerido';
  if (!password || password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres';
  if (!nombreEmpresa) errors.nombreEmpresa = 'El nombre de la empresa es requerido';
  if (!ruc || ruc.length !== 11 || !/^\d+$/.test(ruc)) {
    errors.ruc = 'El RUC debe tener exactamente 11 dígitos numéricos';
  }
  if (!telefono) errors.telefono = 'El teléfono es requerido';
  if (!direccion) errors.direccion = 'La dirección de la empresa es requerida';

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const supabase = await createClient()

  // 1. Create User in Auth
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_completo: nombreCompleto,
        role: 'cliente',
      },
    },
  })

  if (signUpError) {
    return { success: false, errors: { global: signUpError.message } };
  }

  const user = authData.user;
  if (!user) {
    return { success: false, errors: { global: 'Error al crear la cuenta' } };
  }

  // Use the admin client (service role) to insert database records bypassing RLS during registration
  const adminSupabase = createAdminClient()

  // 2. Create Empresa (aprobada is false by default)
  const { data: empresa, error: empresaError } = await adminSupabase
    .from('empresas')
    .insert({
      nombre: nombreEmpresa,
      ruc,
      email,
      telefono,
      direccion,
      aprobada: false,
    })
    .select()
    .single()

  if (empresaError) {
    return {
      success: false,
      errors: {
        global: `Error al registrar la empresa: ${empresaError.message}`,
      },
    };
  }

  // 3. Update existing Profile (created automatically by the database trigger) with the company relation
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .update({
      empresa_id: empresa.id,
      nombre_completo: nombreCompleto,
      rol: 'cliente',
    })
    .eq('id', user.id)

  if (profileError) {
    return {
      success: false,
      errors: {
        global: `Error al registrar el perfil de usuario: ${profileError.message}`,
      },
    };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
