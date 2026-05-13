"use client";

import { Product } from "@/lib/types/getProducts";
import { useRef } from "react";




type Props = {
  products?: Product[];
};

export default function Gallery({products}:Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">New Arrivals</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory"
      >
        {products?.map((item:Product) => (
          <div
            key={item.id}
            className="min-w-[250px] bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[160px] object-cover"
            />

            <div className="p-3 text-center font-medium">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}