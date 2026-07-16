"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/types/getProducts";
import Image from "next/image";

interface ItemCardProps {
  item: Product;
  index?: number;
}

export default function ProductCard({ item }: ItemCardProps) {
  const itemPath = `/products/${item.id}`;
  const isLocalBackendImage = item.image?.includes("192.168.1.71:8080");

  return (
    <motion.div className="w-full">
      <Link href={itemPath} className="block h-full">
        <div
          className="
            group
            relative
            flex
            h-80
            flex-col
            overflow-hidden
            rounded-2xl

            border
            border-gray-200
            dark:border-gray-700

            bg-gradient-to-b
            from-white
            via-gray-50
            to-gray-100

            dark:bg-gradient-to-br
            dark:from-gray-900
            dark:via-gray-800
            dark:to-gray-700

            shadow-md
            shadow-gray-200/40

            dark:shadow-xl
            dark:shadow-black/30

            transition-all
            duration-500
            ease-out

            hover:-translate-y-2
            hover:scale-[1.02]

            hover:border-pink-300
            dark:hover:border-pink-500/50

            hover:shadow-[0_20px_50px_rgba(236,72,153,0.18)]
          "
        >

          {/* Image */}
          <div
            className="
              relative
              h-44
              w-full
              overflow-hidden
              bg-gray-100
              dark:bg-gray-800
            "
          >
            <Image
              width={400}
              height={300}
              src={item.image}
              alt={item.title}
              unoptimized={isLocalBackendImage}
              loading="eager"
              className="
                h-full
                w-full
                object-cover

                transition-transform
                duration-500

                group-hover:scale-110
              "
            />


            {/* Superhost */}
            {item.is_superhost && (
              <div
                className="
                  absolute
                  left-3
                  top-3

                  rounded-full
                  bg-gradient-to-r
                  from-pink-500
                  to-rose-500

                  px-3
                  py-1

                  text-xs
                  font-semibold
                  text-white

                  shadow-lg
                  shadow-pink-500/30
                "
              >
                Superhost
              </div>
            )}


            {/* Rating */}
            <div
              className="
                absolute
                right-3
                top-3

                rounded-full

                bg-white/90
                dark:bg-gray-900/90

                px-2
                py-0.5

                text-sm
                font-semibold

                text-gray-800
                dark:text-gray-100

                shadow-md

                backdrop-blur
              "
            >
              <span aria-hidden="true">★</span> {item.rating}
            </div>

          </div>


          {/* Content */}
          <div className="flex flex-1 flex-col p-3">

            <div className="mb-2 flex items-start gap-2">

              <h3
                className="
                  flex-1
                  text-sm
                  font-semibold

                  text-gray-900
                  dark:text-white
                "
              >
                {item.title}
              </h3>


              <span
                className="
                  whitespace-nowrap
                  rounded-full

                  bg-gray-100
                  dark:bg-gray-700

                  px-2
                  py-0.5

                  text-[11px]
                  font-medium

                  capitalize

                  text-gray-600
                  dark:text-gray-300
                "
              >
                {item.category}
              </span>

            </div>


            <h3
              className="
                flex-1

                text-sm

                text-gray-700
                dark:text-gray-300
              "
            >
              {item.city && item.country
                ? `${item.city}, ${item.country}`
                : item.address || "-"}
            </h3>


            {/* Footer */}
            <div className="mt-auto flex items-end justify-between">

              <div className="flex flex-col">

                <span
                  className="
                    text-sm
                    font-bold

                    text-pink-500
                    dark:text-pink-400
                  "
                >
                  BDT {item.price_per_night} Taka
                </span>


                <span
                  className="
                    text-xs

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  per day
                </span>

              </div>


              <span
                className="
                  rounded-full

                  bg-gray-100
                  dark:bg-gray-700

                  px-2
                  py-1

                  text-xs

                  text-gray-500
                  dark:text-gray-300
                "
              >
                New
              </span>

            </div>

          </div>

        </div>
      </Link>
    </motion.div>
  );
}