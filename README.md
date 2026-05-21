# Portal B2B de Distribución Farmacéutica - PharmaB2B

PharmaB2B es una plataforma de comercio electrónico farmacéutico B2B diseñada para farmacias y distribuidores de insumos médicos. El sistema permite registrar clientes, realizar pedidos, solicitar cotizaciones y gestionar el flujo de entrega, con un panel de administración para control interno.

Desarrollado con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Supabase SSR** y **TypeScript**.

---

## Características Principales

### Para Clientes Farmacéuticos
- **Página de Registro e Inicio de Sesión**: Validación de RUC (11 dígitos) y bloqueo preventivo de accesos hasta aprobación administrativa.
- **Catálogo de Medicamentos**: Grid responsivo con buscador por SKU o Nombre, filtros por categorías, stock, precios unitarios y por caja, y advertencias si requiere receta retenida.
- **Carrito de Compras**: Gestión de ítems agregados y notas personalizadas para generar cotizaciones.
- **Bandeja de Cotizaciones**: Seguimiento a cotizaciones en estado borrador, enviada, aprobada o rechazada.
- **Conversión de Cotización a Pedido**: Creación automática de orden de compra desde cotizaciones aprobadas.
- **Bandeja y Seguimiento de Pedidos**: Stepper visual (línea de tiempo) con estados: *Pendiente*, *Confirmado*, *En Preparación*, *Despachado* y *Entregado*.

### Para Administradores (Rol Admin)
- **Panel de Control de Productos (CRUD)**: Creación, edición y desactivación de productos/insumos farmacéuticos.
- **Aprobación de Clientes**: Habilitación/suspensión inmediata de empresas registradas (toggle switch de aprobación).
- **Gestión de Pedidos Globales**: Tabla general con todos los pedidos, filtros y modificador de estado logístico.

---

## Estructura de la Base de Datos

Las tablas utilizadas en Supabase son:
1. **`empresas`**: Almacena datos de las entidades compradoras.
   - Campos: `id` (uuid), `nombre` (text), `ruc` (varchar, 11), `email` (text), `telefono` (text), `direccion` (text), `aprobada` (boolean), `created_at`.
2. **`profiles`**: Almacena los perfiles de usuario vinculados al registro de autenticación.
   - Campos: `id` (uuid, fk a auth.users), `empresa_id` (uuid, fk a empresas), `nombre_completo` (text), `rol` ('admin' | 'cliente').
3. **`categorias`**: Categorías de productos médicos.
   - Campos: `id` (uuid), `nombre` (text), `descripcion` (text), `imagen_url` (text).
4. **`productos`**: Catálogo de insumos médicos.
   - Campos: `id` (uuid), `nombre` (text), `descripcion` (text), `sku` (text), `precio_unitario` (numeric), `precio_caja` (numeric), `unidades_por_caja` (integer), `stock` (integer), `categoria_id` (uuid, fk), `imagen_url` (text), `requiere_receta` (boolean), `activo` (boolean).
5. **`cotizaciones`**: Cabecera de cotizaciones.
   - Campos: `id` (uuid), `empresa_id` (uuid), `profile_id` (uuid), `estado` ('borrador'|'enviada'|'aprobada'|'rechazada'), `notas` (text), `total_estimado` (numeric), `created_at`, `updated_at`.
6. **`cotizacion_items`**: Detalle de cotizaciones.
   - Campos: `id` (uuid), `cotizacion_id` (uuid), `producto_id` (uuid), `cantidad` (integer), `precio_unitario` (numeric), `subtotal` (numeric).
7. **`pedidos`**: Cabecera de órdenes de compra.
   - Campos: `id` (uuid), `empresa_id` (uuid), `cotizacion_id` (uuid, nullable), `profile_id` (uuid), `estado` ('pendiente'|'confirmado'|'en_preparacion'|'despachado'|'entregado'|'cancelado'), `total` (numeric), `direccion_entrega` (text), `notas` (text), `created_at`.
8. **`pedido_items`**: Detalle de pedidos.
   - Campos: `id` (uuid), `pedido_id` (uuid), `producto_id` (uuid), `cantidad` (integer), `precio_unitario` (numeric), `subtotal` (numeric).

---

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con la siguiente estructura:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

---

## Desarrollo Local

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Configura las variables de entorno en tu archivo `.env.local`.

3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en el navegador para interactuar con la aplicación.

---

## Despliegue en Vercel

Para desplegar el proyecto en la plataforma Vercel:

1. **Vincular Repositorio**: Sube el código del proyecto a un repositorio de GitHub, GitLab o Bitbucket.
2. **Importar a Vercel**:
   - Inicia sesión en [Vercel Dashboard](https://vercel.com).
   - Haz clic en **Add New** > **Project** e importa tu repositorio.
3. **Configurar Variables de Entorno**:
   - Expande la sección **Environment Variables** en la configuración de la importación.
   - Agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con sus respectivos valores de producción.
4. **Desplegar**:
   - Presiona **Deploy**. Vercel detectará que es un proyecto de Next.js y compilará la aplicación automáticamente.
