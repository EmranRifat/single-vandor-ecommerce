"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/queries";
import { Product } from "@/lib/types/getProducts";
import { Category } from "@/lib/types/types";
import { useGetProductData } from "@/lib/hooks/product/useGetProducts";
import ProductCard from "../components/Products/ProductCard";
import Footer from "../components/common/footer/footer";
import TabsComponent from "../components/common/Tabs/tabs";
import { Spinner } from "@heroui/react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("apartments");
  const [showAll, setShowAll] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const tabCategoryNameMap: Record<string, string> = {
    apartments: "Apartment",
    hotels: "Hotel",
    rooms: "Home",
  };

  const selectedCategoryName =
    tabCategoryNameMap[activeCategory] || activeCategory;

  const selectedCategoryId = categories.find(
    (category: Category) =>
      category.name.toLowerCase() === selectedCategoryName.toLowerCase())?.id;

  const payload = {
    page: 1,
    limit: 100,
    category: selectedCategoryId ?? selectedCategoryName,
  };

  const { data, isLoading , isFetching, isError, error} = useGetProductData(payload);
  
  const listings = data?.listings || [];
  const visibleListings = showAll ? listings : listings.slice(0,8);
  console.log("listings-->", listings);
  // console.log("visibleListings-->", visibleListings);
  // console.log("showAll-->", showAll);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center text-center py-6 bg-gray-50">
        <div className="w-fit">
          <TabsComponent
            activeTab={activeCategory}
            onTabChange={setActiveCategory}
          />
        </div>
      </div>
     
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-20">
          <Spinner color="success" />{" "}
          <p className="text-gray-500 text-lg">Loading ...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500 text-lg">
            {error?.message || "Unable to load products."}
          </p>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      ) : null}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between mb-6"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {activeCategory === "apartments"
                ? "Apartments"
                : activeCategory === "hotels"
                  ? "Hotels"
                  : "Rooms"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleListings.map((product: Product, index: number) => (
              <ProductCard key={product.id} item={product} index={index} />
            ))}
          </div>
          {listings.length > 12 && !showAll ? (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="px-6 py-3 rounded-full bg-linear-to-r from-orange-500 to-red-600 text-white font-medium shadow-lg hover:scale-105 hover:from-blue-600 hover:to-red-600 transition-all duration-300"
              >
                See more
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
}
