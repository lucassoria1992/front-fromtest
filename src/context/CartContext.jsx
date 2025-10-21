import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    if (!product || !product._id) return;
    setItems(prev => {
      const idx = prev.findIndex(i => i._id === product._id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: Math.min(99, (copy[idx].quantity || 1) + qty) };
        return copy;
      }
      return [...prev, {
        _id: product._id,
        nombre: product.nombre,
        price: Number(product.price) || 0,
        imagen: product.imagen,
        quantity: Math.max(1, qty)
      }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: Math.max(1, Math.min(99, qty)) } : i));

  const clearCart = () => setItems([]);

  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: items.reduce((acc, it) => acc + (it.quantity || 1), 0),
    totalPrice: items.reduce((acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 1), 0)
  }), [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
