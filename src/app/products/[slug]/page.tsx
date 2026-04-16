'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/lib/queries';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShoppingCart, Heart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/slices/cartSlice';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();

  // const { data: product, isLoading } = useQuery({
  //   queryKey: ['product', slug],
  //   queryFn: () => getProduct(slug)
  // });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      router.push('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                    -{discount}%
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-gray-900 scale-95'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {product.categories && (
                <Link
                  href={`/products?category=${product.categories.slug}`}
                  className="text-sm text-blue-600 hover:underline uppercase tracking-wider mb-2"
                >
                  {product.categories.name}
                </Link>
              )}

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% protected</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors font-semibold"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 font-semibold min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors font-semibold"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {product.stock} items available
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border-2 border-gray-900 text-gray-900 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </motion.button>
              </div>

              {product.stock < 10 && product.stock > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 font-semibold">
                    Only {product.stock} left in stock - order soon!
                  </p>
                </div>
              )}

              {product.stock === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">
                    This item is currently out of stock
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
