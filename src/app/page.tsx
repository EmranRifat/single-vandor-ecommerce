"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";

import { getCategories } from "@/lib/queries";
import { Product } from "@/lib/types/getProducts";
import { Category } from "@/lib/types/types";
import { useGetProductData } from "@/lib/hooks/product/useGetProducts";
import ProductCard from "../components/Products/ProductCard";
import Footer from "../components/common/footer/footer";
import TabsComponent from "../components/common/Tabs/tabs";
import Navbar from "../components/Navbar/index";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import Choice from "../components/Home/Choice";
import AppStore from "../components/Home/Appstore";

export default function HomeClient() {
  const [activeCategory, setActiveCategory] = useState("apartments");
  const [showAll, setShowAll] = useState(false);
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(true);
  const [isLocationExpanded, setIsLocationExpanded] = useState(true);

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
      category.name.toLowerCase() === selectedCategoryName.toLowerCase(),
  )?.id;

  const payload = {
    page: 1,
    limit: 100,
    category: selectedCategoryId ?? selectedCategoryName,
  };

  const { data, isLoading, isFetching, isError, error } =
    useGetProductData(payload);

  const listings = data?.listings || [];
  const visibleListings = showAll ? listings : listings.slice(0, 8);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
<div
  className="
    flex flex-col items-center justify-center
    py-8

    bg-gradient-to-br
    from-pink-50
    via-rose-50
    to-white

    dark:from-gray-950
    dark:via-gray-900
    dark:to-gray-800

    transition-all duration-300
  "
>
  <div className="w-fit">
    <TabsComponent
      activeTab={activeCategory}
      onTabChange={setActiveCategory}
    />
  </div>
</div>

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-20">
          <Spinner color="success" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Loading ...
          </p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500 dark:text-red-400 text-lg">
            {error?.message || "Unable to load products."}
          </p>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No products found in this category.
          </p>
        </div>
      ) : null}

      <section
        className="
    py-12

    bg-gradient-to-br
    from-gray-50
    via-white
    to-rose-50

    dark:bg-gradient-to-br
    dark:from-gray-950
    dark:via-gray-900
    dark:to-gray-800

    transition-colors
    duration-300
  "
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                {activeCategory === "apartments"
                  ? "Apartments"
                  : activeCategory === "hotels"
                    ? "Hotels"
                    : "Rooms"}
              </h2>

              <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {visibleListings.map((product: Product, index: number) => (
              <ProductCard key={product.id} item={product} index={index} />
            ))}
          </div>

          {listings.length > 8 && !showAll && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="
            rounded-full

            bg-gradient-to-r
            from-pink-500
            via-rose-500
            to-orange-500

            px-8
            py-3

            font-semibold
            text-white

            shadow-lg
            shadow-pink-500/30

            transition-all
            duration-300

            hover:-translate-y-1
            hover:scale-105
            hover:shadow-xl
            hover:shadow-pink-500/40

            active:scale-95
          "
              >
                See More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lottie animations */}

      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-5">
        {/* Discount Card */}
        <div
          onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
          className="group cursor-pointer rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl relative"
        >
          <div className="flex items-center justify-center">
            <div
              className={`transition-all duration-300 origin-center ${isDiscountExpanded ? "w-24 h-24" : "w-0 h-0 overflow-hidden"}`}
            >
              {isDiscountExpanded && (
                <img
                  src="/lottie/Discount.svg"
                  alt="Discount"
                  className="h-24 w-24 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                />
              )}
            </div>
          </div>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">
            》
          </span>
          {isDiscountExpanded && (
            <p className="mt-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-red-500 dark:group-hover:text-red-400 animate-fadeIn">
              Discount
            </p>
          )}
        </div>

        {/* Location Card */}

        <div
          onClick={() => setIsLocationExpanded(!isLocationExpanded)}
          className="group cursor-pointer rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl relative"
        >
          <div className="flex items-center justify-center">
            <div
              className={`transition-all duration-300 origin-center ${isLocationExpanded ? "w-24 h-24" : "w-0 h-0 overflow-hidden"}`}
            >
              {isLocationExpanded && (
                <img
                  src="/lottie/Location.svg"
                  alt="Location"
                  className="h-24 w-24 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                />
              )}
            </div>
          </div>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">
            》
          </span>
          {isLocationExpanded && (
            <p className="mt-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 animate-fadeIn">
              Location
            </p>
          )}
        </div>
      </div>

      {/* 
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 p-4 ">
        <Player
          autoplay
          loop
          src="/static/animations/delivery.json"
          style={{ height: "300px", width: "300px" }}
        >
        </Player>
      </div> */}

      <Choice />
      <AppStore />
      <Footer />
    </div>
  );
}
