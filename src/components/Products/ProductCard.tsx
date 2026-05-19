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
      <motion.div className="w-full">
        <Link href={itemPath} className="block h-full">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow h-80">
            <div className="relative w-full h-44 bg-gray-100">
              <Image
                width={400}
                height={300}
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

            <div className="flex flex-1 flex-col p-2">
             
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-900 flex-1">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500 capitalize bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap text-xxs">
                  {item.category}
                </span>
              </div>
               <h3 className="text-sm text-gray-800 flex-1">
                              {item.city}, {item.country}
                            </h3>

              <div className="mt-auto flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-pink-500">
                    BDT {item.price_per_night} Taka
                  </span>
                  <span className="text-xs text-gray-500">per day</span>
                </div>
                <span className="text-xs text-gray-400">New</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
