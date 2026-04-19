"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/queries";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useProductList } from "@/lib/http/product/useGetProducts";
import Cookies from "js-cookie";
import { Category, Item } from "@/src/types/items";
import ItemCard from "@/src/components/itemsCard";
import { ItemListPayload } from "@/lib/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const token = Cookies.get("token") || "";

  const payload: ItemListPayload = {
    page: 1,
    limit: 10,
    token,
    category: categoryId || undefined,
  };

  const { data, isLoading, error } = useProductList(payload);
  const items = data?.data || [];

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const currentCategory = categories.find((c: Category) => c.id === categoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">
              {currentCategory ? currentCategory.name : "All Products"}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentCategory ? currentCategory.name : "All Products"}
          </h1>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Categories
              </h2>

              <div className="space-y-2">
                <Link href="/products">
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      !categoryId
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    New Arrivals
                  </motion.button>
                </Link>

                {categories.map((category: Category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                  >
                    <motion.button
                      whileHover={{ x: 4 }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        categoryId === category.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] rounded-lg bg-white shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">Failed to load data.</p>
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item: Item, index: number) => (
                  <ItemCard key={item.id} item={item} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No data found in this category.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
