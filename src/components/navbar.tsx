'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getCartItems } from '@/lib/queries';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sessionId, cartCount, setCartCount } = useCart();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart', sessionId],
    queryFn: () => getCartItems(sessionId),
    enabled: !!sessionId,
    onSuccess: (data) => {
      const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    }
  });

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ShopHub
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/products"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                All Products
              </Link>
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-gray-900 hidden md:block">
              <Search className="w-5 h-5" />
            </button>

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/products"
                className="block text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
