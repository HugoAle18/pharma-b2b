export interface Empresa {
  id: string;
  nombre: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
  aprobada: boolean;
  created_at: string;
}

export type UserRole = 'admin' | 'cliente';

export interface Profile {
  id: string; // matches auth.users.id
  empresa_id: string;
  nombre_completo: string;
  rol: UserRole;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  sku: string;
  precio_unitario: number;
  precio_caja: number;
  unidades_por_caja: number;
  stock: number;
  categoria_id: string;
  imagen_url: string | null;
  requiere_receta: boolean;
  activo: boolean;
}

export type CotizacionEstado = 'borrador' | 'enviada' | 'aprobada' | 'rechazada';

export interface Cotizacion {
  id: string;
  empresa_id: string;
  profile_id: string;
  estado: CotizacionEstado;
  notas: string | null;
  total_estimado: number;
  created_at: string;
  updated_at: string;
}

export interface CotizacionItem {
  id: string;
  cotizacion_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export type PedidoEstado =
  | 'pendiente'
  | 'confirmado'
  | 'en_preparacion'
  | 'despachado'
  | 'entregado'
  | 'cancelado';

export interface Pedido {
  id: string;
  empresa_id: string;
  cotizacion_id: string | null;
  profile_id: string;
  estado: PedidoEstado;
  total: number;
  direccion_entrega: string;
  notas: string | null;
  created_at: string;
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// Data Transfer Objects (DTOs)
export interface CreateEmpresaDTO {
  nombre: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface UpdateEmpresaDTO {
  nombre?: string;
  ruc?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  aprobada?: boolean;
}

export interface CreateProfileDTO {
  nombre_completo: string;
  rol: UserRole;
  empresa_id: string;
}

export interface UpdateProfileDTO {
  nombre_completo?: string;
  rol?: UserRole;
  empresa_id?: string;
}

export interface CreateProductoDTO {
  nombre: string;
  descripcion: string | null;
  sku: string;
  precio_unitario: number;
  precio_caja: number;
  unidades_por_caja: number;
  stock: number;
  categoria_id: string;
  imagen_url: string | null;
  requiere_receta: boolean;
  activo: boolean;
}

export interface UpdateProductoDTO {
  nombre?: string;
  descripcion?: string | null;
  sku?: string;
  precio_unitario?: number;
  precio_caja?: number;
  unidades_por_caja?: number;
  stock?: number;
  categoria_id?: string;
  imagen_url?: string | null;
  requiere_receta?: boolean;
  activo?: boolean;
}

export interface CreateCotizacionItemDTO {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CreateCotizacionDTO {
  empresa_id: string;
  profile_id: string;
  notas?: string | null;
  total_estimado: number;
  items: CreateCotizacionItemDTO[];
}

export interface UpdateCotizacionDTO {
  estado?: CotizacionEstado;
  notas?: string | null;
  total_estimado?: number;
}

export interface CreatePedidoItemDTO {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CreatePedidoDTO {
  empresa_id: string;
  cotizacion_id: string | null;
  profile_id: string;
  estado: PedidoEstado;
  total: number;
  direccion_entrega: string;
  notas?: string | null;
  items: CreatePedidoItemDTO[];
}

export interface UpdatePedidoStatusDTO {
  estado: PedidoEstado;
}
