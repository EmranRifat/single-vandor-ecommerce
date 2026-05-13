"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types/getProducts";
import Image from "next/image";

interface ItemCardProps {
  item: Product;
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ItemCardProps) {
  const itemPath = `/products/${item.id}`;

  return (
    <>
      <motion.div
         
      >
        <Link href={itemPath} className="block h-full">
          <div className="flex flex-col overflow-hidden  ">
            <div className="relative w-full h-44 bg-gray-100">
              <Image
                width={400}
                height={300}
                src={item.image}
                alt={item.title}
                className="h-full w-full border rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
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

            <div className="flex flex-1 flex-col py-2">
              <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {item.title}
              </h3>

              <div className="mt-auto flex items-center justify-between gap-3 pt-">
                <div>
                  <span className="text-lg   text-gray-900">
                    ${item.price_per_night}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">/ night</span>
                </div>
                <div className = "text-sm text-gray-500">
                  New
                </div>

                {/* <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-gray-900 p-2 text-white transition-colors hover:bg-gray-800"
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.div> */}
              </div>
{/* 
              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
                <span>{item.reviews_count} reviews</span>
                <span className="truncate text-right">
                  Host: {item.host_name}
                </span>
              </div> */}
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
