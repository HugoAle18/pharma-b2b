'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { logoutAction } from '../(auth)/actions';
import {
  LayoutGrid,
  FileText,
  Package,
  ShoppingCart,
  Bell,
  LogOut,
  Menu,
  X,
  Trash2,
  Plus,
  Minus,
  User,
  Building,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { crearCotizacionDesdeCarrito } from './cotizaciones/actions';

interface DashboardLayoutClientProps {
  profile: {
    nombre_completo: string;
    rol: string;
  } | null;
  empresa: {
    id: string;
    nombre: string;
    ruc: string;
  } | null;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({
  profile,
  empresa,
  children,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const { cart, updateQuantity, removeFromCart, total, itemCount, clearCart } = useCart();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [quoteMsg, setQuoteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const links = [
    { name: 'Catálogo', href: '/catalogo', icon: LayoutGrid },
    { name: 'Cotizaciones', href: '/cotizaciones', icon: FileText },
    { name: 'Mis Pedidos', href: '/pedidos', icon: Package },
  ];

  // Helper to resolve title
  const getPageTitle = () => {
    if (pathname.startsWith('/catalogo')) return 'Catálogo de Productos';
    if (pathname.startsWith('/cotizaciones')) return 'Mis Cotizaciones';
    if (pathname.startsWith('/pedidos')) return 'Seguimiento de Pedidos';
    return 'Portal PharmaB2B';
  };

  const handleCreateQuote = async () => {
    if (cart.length === 0) return;
    setIsCreatingQuote(true);
    setQuoteMsg(null);
    try {
      const items = cart.map((item) => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio_unitario,
        subtotal: item.subtotal,
      }));

      const res = await crearCotizacionDesdeCarrito(items, quoteNotes);
      if (res.success) {
        setQuoteMsg({ type: 'success', text: '¡Cotización borrador creada! Redirigiendo...' });
        clearCart();
        setQuoteNotes('');
        setTimeout(() => {
          setIsCartOpen(false);
          setQuoteMsg(null);
          window.location.href = `/cotizaciones/${res.cotizacionId}`;
        }, 1500);
      } else {
        setQuoteMsg({ type: 'error', text: res.error || 'Error al crear cotización' });
      }
    } catch (error: any) {
      setQuoteMsg({ type: 'error', text: error?.message || 'Error de red' });
    } finally {
      setIsCreatingQuote(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans">
      {/* 1. Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#003366] text-white shrink-0 shadow-lg justify-between">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-blue-900">
            <span className="text-xl font-bold tracking-tight text-white">
              Pharma<span className="text-blue-300">B2B</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-800 text-white font-semibold'
                      : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-blue-900 bg-blue-950/40">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-800 rounded-lg text-blue-100">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{profile?.nombre_completo}</p>
              <div className="flex items-center gap-1 text-xs text-blue-300 mt-0.5">
                <Building className="h-3 w-3 shrink-0" />
                <span className="truncate">{empresa?.nombre}</span>
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-900/60 hover:bg-red-700/80 text-blue-100 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-blue-800/50 hover:border-transparent"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer body */}
          <div className="relative flex flex-col w-72 max-w-xs bg-[#003366] text-white shadow-xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-blue-900">
              <span className="text-xl font-bold tracking-tight text-white">
                Pharma<span className="text-blue-300">B2B</span>
              </span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-blue-100 hover:bg-blue-800 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 px-4 space-y-1.5 flex-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-800 text-white font-semibold'
                        : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-blue-900 bg-blue-950/40">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-800 rounded-lg text-blue-100">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{profile?.nombre_completo}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-300 mt-0.5">
                    <Building className="h-3 w-3 shrink-0" />
                    <span className="truncate">{empresa?.nombre}</span>
                  </div>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-900/60 hover:bg-red-700/80 text-blue-100 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-blue-800/50 hover:border-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-[#003366] md:text-xl truncate">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-500 hover:text-[#0066CC] hover:bg-gray-100 rounded-lg relative transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#003366]">Notificaciones</span>
                      <span className="text-xs text-gray-400">1 nueva</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                        <p className="text-xs text-gray-500 font-medium">Hace 10 mins</p>
                        <p className="text-sm text-gray-800 mt-0.5 leading-snug">
                          ¡Bienvenido al portal! Esperando que el administrador valide tu cuenta.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Icon & Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 py-2 px-3 bg-blue-50 text-[#0066CC] hover:bg-[#0066CC]/10 border border-blue-100 rounded-lg transition-all focus:outline-none font-semibold text-sm"
            >
              <ShoppingCart className="h-5 w-5 shrink-0" />
              <span className="hidden sm:inline">Carrito</span>
              {itemCount > 0 && (
                <span className="bg-[#0066CC] text-white px-2 py-0.5 rounded-full text-xs font-bold font-sans">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Inner Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">{children}</main>
      </div>

      {/* 4. Sliding Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-gray-100">
              {/* Header */}
              <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#0066CC]" />
                  <h2 className="text-lg font-bold text-[#003366]">Carrito de Cotización</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Alert messages */}
              {quoteMsg && (
                <div
                  className={`mx-6 mt-4 p-3 rounded-lg border text-sm flex items-center gap-2 ${
                    quoteMsg.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0 bg-current animate-ping" />
                  <span>{quoteMsg.text}</span>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                    <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
                      <ShoppingCart className="h-12 w-12" />
                    </div>
                    <p className="font-bold text-gray-700">Tu carrito está vacío</p>
                    <p className="text-sm text-gray-450 mt-1 max-w-xs leading-normal">
                      Explora nuestro catálogo y agrega productos para poder generar una cotización.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.producto.id}
                      className="flex items-start gap-4 p-4 border border-gray-150 rounded-xl hover:border-gray-250 transition-colors"
                    >
                      <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300 overflow-hidden shrink-0">
                        {item.producto.imagen_url ? (
                          <img
                            src={item.producto.imagen_url}
                            alt={item.producto.nombre}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <Package className="h-8 w-8" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-gray-800 truncate">
                          {item.producto.nombre}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">SKU: {item.producto.sku}</p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Selector de cantidad */}
                          <div className="flex items-center border border-gray-250 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.producto.id, item.cantidad - 1)
                              }
                              className="p-1 px-2.5 text-gray-500 hover:bg-gray-100 transition-colors text-xs font-bold"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-gray-800">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.producto.id, item.cantidad + 1)
                              }
                              className="p-1 px-2.5 text-gray-500 hover:bg-gray-100 transition-colors text-xs font-bold"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">
                              ${item.subtotal.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">
                              ${item.producto.precio_unitario.toFixed(2)} c/u
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.producto.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Summary and Creation */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
                  {/* Notes Field */}
                  <div>
                    <label
                      htmlFor="quoteNotes"
                      className="block text-xs font-bold text-gray-700 mb-1"
                    >
                      Notas / Observaciones de la cotización
                    </label>
                    <textarea
                      id="quoteNotes"
                      rows={2}
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      placeholder="Ej. Requerimos entrega urgente, o lote con vencimiento largo..."
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0066CC] focus:outline-none bg-white text-gray-850"
                    />
                  </div>

                  <div className="flex items-center justify-between text-base font-bold text-[#003366]">
                    <span>Total Estimado:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCreateQuote}
                    disabled={isCreatingQuote}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-[#0066CC] hover:bg-[#0055b3] focus:outline-none disabled:bg-blue-400 transition-colors cursor-pointer"
                  >
                    {isCreatingQuote ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Creando Cotización...
                      </>
                    ) : (
                      <>
                        Generar Nueva Cotización <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
