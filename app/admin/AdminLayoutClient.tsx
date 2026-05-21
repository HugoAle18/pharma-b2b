'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '../(auth)/actions';
import {
  ShieldAlert,
  FolderLock,
  Package,
  Users,
  FileSpreadsheet,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';

interface AdminLayoutClientProps {
  profile: {
    nombre_completo: string;
    rol: string;
  } | null;
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  profile,
  children,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const links = [
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Clientes B2B', href: '/admin/clientes', icon: Users },
    { name: 'Pedidos Globales', href: '/admin/ordenes', icon: ShoppingBag },
  ];

  const getPageTitle = () => {
    if (pathname.startsWith('/admin/productos')) return 'Gestión de Productos';
    if (pathname.startsWith('/admin/clientes')) return 'Aprobación de Clientes';
    if (pathname.startsWith('/admin/ordenes')) return 'Pedidos Recibidos';
    return 'Panel de Administración';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#1a5f3c] text-white shrink-0 shadow-lg justify-between">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-green-800">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Pharma<span className="text-green-300">Admin</span>
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
                      ? 'bg-green-800 text-white font-semibold shadow-inner'
                      : 'text-green-100 hover:bg-green-800/40 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & signout */}
        <div className="p-4 border-t border-green-800 bg-green-950/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-800 rounded-lg text-green-150">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{profile?.nombre_completo}</p>
              <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-green-350">
                ADMINISTRADOR
              </span>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-900/60 hover:bg-red-700/80 text-green-105 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-green-800/50 hover:border-transparent"
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
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-[#1a5f3c] text-white shadow-xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-green-800">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Pharma<span className="text-green-300">Admin</span>
              </span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-green-100 hover:bg-green-800 focus:outline-none"
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
                        ? 'bg-green-800 text-white font-semibold'
                        : 'text-green-100 hover:bg-green-800/40 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-green-800 bg-green-950/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-800 rounded-lg text-green-150">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{profile?.nombre_completo}</p>
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-green-350">
                    ADMINISTRADOR
                  </span>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-900/60 hover:bg-red-700/80 text-green-105 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-green-800/50 hover:border-transparent"
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
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-[#1a5f3c] md:text-xl truncate">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-green-55 text-[#1a5f3c] border border-green-200/50 rounded-lg text-xs font-bold">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Acceso Administrador</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">{children}</main>
      </div>
    </div>
  );
}
