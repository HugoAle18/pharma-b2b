'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Producto } from '../types';

export interface CartItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (producto: Producto, cantidad: number) => void;
  removeFromCart: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pharmab2b_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('pharmab2b_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto: Producto, cantidad: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.producto.id === producto.id);
      if (existingItem) {
        const newCantidad = existingItem.cantidad + cantidad;
        return prevCart.map((item) =>
          item.producto.id === producto.id
            ? {
                ...item,
                cantidad: newCantidad,
                subtotal: newCantidad * producto.precio_unitario,
              }
            : item
        );
      }
      return [
        ...prevCart,
        {
          producto,
          cantidad,
          subtotal: cantidad * producto.precio_unitario,
        },
      ];
    });
  };

  const removeFromCart = (productoId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.producto.id !== productoId));
  };

  const updateQuantity = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.producto.id === productoId
          ? {
              ...item,
              cantidad,
              subtotal: cantidad * item.producto.precio_unitario,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
