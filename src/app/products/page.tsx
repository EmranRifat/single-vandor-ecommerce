'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '@/lib/queries';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/src/components/product-card';
import { useProductList } from '@/lib/http/product/useGetProducts';
import Cookies from "js-cookie";
 
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  // const { data: products = [], isLoading } = useQuery({
  //   queryKey: ['products', categorySlug],
  //   queryFn: () => getProducts(categorySlug || undefined)
  // });

const token = Cookies.get("access") || "";



    const { data, isLoading, error } = useProductList({
    access: token,
    page: 1,
    limit: 10,
  });

  const products = data?.data || [];
  console.log("get data products..",data)



  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const currentCategory = categories.find(c => c.slug === categorySlug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">
              {currentCategory ? currentCategory.name : 'All Products'}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          {currentCategory && (
            <p className="text-gray-600 text-lg">{currentCategory.description}</p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>

              <div className="space-y-2">
                <Link href="/products">
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      !categorySlug
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </motion.button>
                </Link>

                {categories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.slug}`}>
                    <motion.button
                      whileHover={{ x: 4 }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        categorySlug === category.slug
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3"
          >
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm h-96 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
