'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart } from '@/lib/slices/cartSlice';
import type { RootState } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-6 p-6 border-b last:border-b-0"
                  >
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors mb-2 block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-2xl font-bold text-gray-900 mb-4">
                        ${item.product.price.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              dispatch(updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity - 1
                              }))
                            }
                            className="px-3 py-2 hover:bg-gray-100 transition-colors font-semibold"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-6 py-2 font-semibold min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity + 1
                              }))
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(removeFromCart(item.productId))}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 50 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/checkout')}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <Link href="/products">
                <button className="w-full mt-4 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
