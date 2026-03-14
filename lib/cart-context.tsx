'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
  sessionId: string;
  cartCount: number;
  setCartCount: (count: number) => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let id = localStorage.getItem('session_id');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session_id', id);
    }
    setSessionId(id);
  }, []);

  const refreshCart = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <CartContext.Provider value={{ sessionId, cartCount, setCartCount, refreshCart }}>
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
