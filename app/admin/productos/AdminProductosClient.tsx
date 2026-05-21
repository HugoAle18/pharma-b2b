'use client'

import React, { useState, useTransition } from 'react';
import { Producto, Categoria, CreateProductoDTO } from '@/lib/types';
import { crearProducto, editarProducto, toggleActivoProducto } from '../actions';
import {
  Plus,
  Edit,
  Eye,
  EyeOff,
  Package,
  Check,
  X,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface AdminProductosClientProps {
  initialProducts: (Producto & { categoria?: Categoria | null })[];
  categories: Categoria[];
}

export default function AdminProductosClient({
  initialProducts,
  categories,
}: AdminProductosClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [sku, setSku] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [precioCaja, setPrecioCaja] = useState(0);
  const [unidadesPorCaja, setUnidadesPorCaja] = useState(1);
  const [stock, setStock] = useState(0);
  const [requiereReceta, setRequiereReceta] = useState(false);
  const [activo, setActivo] = useState(true);
  const [imagenUrl, setImagenUrl] = useState('');

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openNewModal = () => {
    setEditingProduct(null);
    setNombre('');
    setSku('');
    setDescripcion('');
    setCategoriaId(categories[0]?.id || '');
    setPrecioUnitario(0);
    setPrecioCaja(0);
    setUnidadesPorCaja(1);
    setStock(0);
    setRequiereReceta(false);
    setActivo(true);
    setImagenUrl('');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Producto) => {
    setEditingProduct(product);
    setNombre(product.nombre);
    setSku(product.sku);
    setDescripcion(product.descripcion || '');
    setCategoriaId(product.categoria_id);
    setPrecioUnitario(product.precio_unitario);
    setPrecioCaja(product.precio_caja);
    setUnidadesPorCaja(product.unidades_por_caja);
    setStock(product.stock);
    setRequiereReceta(product.requiere_receta);
    setActivo(product.activo);
    setImagenUrl(product.imagen_url || '');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleToggleActivo = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    try {
      const res = await toggleActivoProducto(id, newVal);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, activo: newVal } : p))
        );
      } else {
        alert(`Error al cambiar estado: ${res.error}`);
      }
    } catch (e: any) {
      alert(`Error de red: ${e?.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const dto: CreateProductoDTO = {
      nombre,
      sku,
      descripcion: descripcion || null,
      categoria_id: categoriaId,
      precio_unitario: Number(precioUnitario),
      precio_caja: Number(precioCaja),
      unidades_por_caja: Number(unidadesPorCaja),
      stock: Number(stock),
      requiere_receta: requiereReceta,
      activo,
      imagen_url: imagenUrl || null,
    };

    startTransition(async () => {
      try {
        if (editingProduct) {
          const res = await editarProducto(editingProduct.id, dto);
          if (res.success && res.producto) {
            setFeedback({ type: 'success', text: 'Producto actualizado con éxito.' });
            const updated = res.producto as (Producto & { categoria?: Categoria | null });
            const cat = categories.find((c) => c.id === updated.categoria_id);
            updated.categoria = cat || null;

            setProducts((prev) =>
              prev.map((p) => (p.id === editingProduct.id ? updated : p))
            );
            setTimeout(() => setIsModalOpen(false), 1000);
          } else {
            setFeedback({ type: 'error', text: res.error || 'Error al editar producto' });
          }
        } else {
          const res = await crearProducto(dto);
          if (res.success && res.producto) {
            setFeedback({ type: 'success', text: 'Producto creado con éxito.' });
            const created = res.producto as (Producto & { categoria?: Categoria | null });
            const cat = categories.find((c) => c.id === created.categoria_id);
            created.categoria = cat || null;

            setProducts((prev) => [created, ...prev]);
            setTimeout(() => setIsModalOpen(false), 1000);
          } else {
            setFeedback({ type: 'error', text: res.error || 'Error al crear producto' });
          }
        }
      } catch (err: any) {
        setFeedback({ type: 'error', text: err?.message || 'Error de red' });
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#1a5f3c]">Catálogo de Productos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Administra los medicamentos disponibles, sus precios, stock y requerimiento de recetas.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-[#1a5f3c] hover:bg-[#154d30] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precios</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Receta</th>
                <th className="px-6 py-4">Activo</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-300 overflow-hidden shrink-0">
                        {product.imagen_url ? (
                          <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <Package className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate max-w-[200px]">
                          {product.nombre}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">
                          {product.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-650 font-bold">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.categoria?.nombre || 'General'}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">
                      U: ${product.precio_unitario.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      C: ${product.precio_caja.toFixed(2)} ({product.unidades_por_caja} uds)
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        product.stock <= 5 ? 'text-red-650 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {product.stock} uds
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.requiere_receta ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-800 border border-red-150">
                        <FileText className="h-3 w-3" /> Sí
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActivo(product.id, product.activo)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        product.activo
                          ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                          : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {product.activo ? (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Activo
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Inactivo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full border border-gray-150 overflow-hidden z-10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-150 bg-gray-50/50 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-[#1a5f3c]">
                {editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              {feedback && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Paracetamol 500mg"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MED-PARA-500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles sobre el producto..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">P. Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">P. Caja ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={precioCaja}
                    onChange={(e) => setPrecioCaja(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Uds. por Caja</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={unidadesPorCaja}
                    onChange={(e) => setUnidadesPorCaja(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Imagen URL</label>
                <input
                  type="url"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a5f3c] focus:outline-none bg-white text-gray-900"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiereReceta}
                    onChange={(e) => setRequiereReceta(e.target.checked)}
                    className="rounded border-gray-300 text-[#1a5f3c] focus:ring-[#1a5f3c] h-4 w-4 bg-white"
                  />
                  ¿Requiere Receta?
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="rounded border-gray-300 text-[#1a5f3c] focus:ring-[#1a5f3c] h-4 w-4 bg-white"
                  />
                  Producto Activo
                </label>
              </div>

              {/* Footer Form Buttons */}
              <div className="pt-6 border-t border-gray-150 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1a5f3c] hover:bg-[#154d30] text-white text-xs font-bold rounded-lg disabled:bg-green-400 cursor-pointer transition-colors"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
