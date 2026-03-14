'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ProductWithCategory } from '@/lib/database.types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithCategory;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-64 bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.compare_at_price && product.compare_at_price > product.price && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                SALE
              </div>
            )}
          </div>

          <div className="p-5">
            {product.categories && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {product.categories.name}
              </p>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>

            {product.stock < 10 && product.stock > 0 && (
              <p className="text-xs text-orange-600 mt-3">
                Only {product.stock} left in stock!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-xs text-red-600 mt-3">Out of stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
