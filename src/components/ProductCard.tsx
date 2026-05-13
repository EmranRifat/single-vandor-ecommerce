"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Item } from "../types/items";

interface ItemCardProps {
  item: Item;
  index?: number;
}


export default function ProductCard({ item, index = 0 }:ItemCardProps) {
 
  const itemPath = `/products/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link href={itemPath} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
          <div className="relative aspect-4/3 w-full bg-gray-100">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {item.is_superhost && (
              <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                Superhost
              </div>
            )}

            <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-900">
              <span aria-hidden="true">&#9733;</span> {item.rating}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
              {item.category}
            </p>

            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {item.title}
            </h3>

            <p className="mb-2 text-sm text-gray-600">
              {item.city}, {item.country}
            </p>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {item.description}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ${item.price_per_night}
                </span>
                <span className="ml-1 text-sm text-gray-500">/ night</span>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-gray-900 p-2 text-white transition-colors hover:bg-gray-800"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
              <span>{item.reviews_count} reviews</span>
              <span className="truncate text-right">
                Host: {item.host_name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}