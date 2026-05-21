'use client'

import React, { useState, useMemo } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { Producto, Categoria } from '@/lib/types';
import { Search, ShoppingCart, AlertCircle, FileText, Package } from 'lucide-react';

interface CatalogClientProps {
  initialProducts: (Producto & { categoria?: Categoria | null })[];
  categories: Categoria[];
}

export default function CatalogClient({
  initialProducts,
  categories,
}: CatalogClientProps) {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handle quantity changes per product
  const handleQuantityChange = (productId: string, val: number, stock: number) => {
    const parsed = Math.max(1, Math.min(stock, val));
    setQuantities((prev) => ({ ...prev, [productId]: parsed }));
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.nombre.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory =
        !selectedCategory || product.categoria_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, search, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleAddToCart = (product: Producto) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    // Reset quantity input to 1 after adding to cart
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Search and Category Filter Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] text-sm"
            />
          </div>

          <div className="text-sm font-semibold text-gray-500">
            {filteredProducts.length} producto(s) encontrado(s)
          </div>
        </div>

        {/* Categories Carousel/Tabs */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !selectedCategory
                  ? 'bg-[#0066CC] text-white'
                  : 'bg-gray-150 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0066CC] text-white'
                    : 'bg-gray-150 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <div className="p-4 bg-gray-50 rounded-full text-gray-300 w-fit mx-auto mb-4">
            <Package className="h-12 w-12" />
          </div>
          <p className="font-bold text-gray-700 text-lg">No se encontraron productos</p>
          <p className="text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            Intenta cambiar los filtros de búsqueda o seleccionar otra categoría para ver resultados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const hasStock = product.stock > 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-250 hover:border-[#0066CC]/30 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                {/* Header card / Image area */}
                <div className="relative aspect-video bg-gray-50 flex items-center justify-center text-gray-300 overflow-hidden border-b border-gray-100 shrink-0">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350"
                    />
                  ) : (
                    <Package className="h-10 w-10 text-gray-300" />
                  )}

                  {/* Prescription required badge */}
                  {product.requiere_receta && (
                    <span className="absolute top-3 right-3 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md border border-red-200 flex items-center gap-1 shadow-sm">
                      <FileText className="h-3 w-3" /> Receta Retenida
                    </span>
                  )}

                  {/* Category label */}
                  {product.categoria?.nombre && (
                    <span className="absolute bottom-3 left-3 bg-gray-900/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {product.categoria.nombre}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      SKU: {product.sku}
                    </p>
                    <h3 className="text-sm font-bold text-[#003366] leading-snug mt-1 line-clamp-2 h-10">
                      {product.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                      {product.descripcion || 'Sin descripción disponible.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    {/* Prices */}
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400">P. Unitario</p>
                        <p className="text-lg font-bold text-[#003366]">
                          ${product.precio_unitario.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400">P. Caja</p>
                        <p className="text-sm font-semibold text-gray-700">
                          ${product.precio_caja.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ({product.unidades_por_caja} uds)
                        </p>
                      </div>
                    </div>

                    {/* Stock indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Disponibilidad:</span>
                      {hasStock ? (
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                          {product.stock} unidades
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Sin Stock
                        </span>
                      )}
                    </div>

                    {/* Actions panel */}
                    {hasStock ? (
                      <div className="flex gap-2 items-center pt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white shrink-0">
                          <input
                            type="number"
                            min={1}
                            max={product.stock}
                            value={qty}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                parseInt(e.target.value) || 1,
                                product.stock
                              )
                            }
                            className="w-12 text-center text-xs font-bold py-1.5 focus:outline-none bg-white text-gray-900 border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0055b3] transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Agregar
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <button
                          disabled
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                        >
                          No disponible
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-2 border border-gray-300 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-xs text-gray-500 font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-2 border border-gray-300 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
