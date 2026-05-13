"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/queries";
import { ArrowRight, Package, Truck, Shield, Headphones } from "lucide-react";

import { Product } from "@/lib/types/getProducts";
import { Category } from "@/lib/types/types";
import { useGetProductData } from "@/lib/hooks/product/useGetProducts";
import ProductCard from "../components/Products/ProductCard";
import { Button, Card, ScrollShadow } from "@heroui/react";
import Gallery from "../components/Home/Gallery";
import SearchBar from "../components/Products/SearchBar";
import { menuItems, navItems } from "../components/ui/menuItem/items";
import { usePathname } from "next/navigation";
import Footer from "../components/common/footer/footer";
import TabsComponent from "../components/common/Tabs/tabs";

export default function Home() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("apartments");
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
    limit: 6,
    category: selectedCategoryId ?? selectedCategoryName,
  };
  const { data, isError } = useGetProductData(payload);
  console.log("data-->", data);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center text-center py-10 bg-gray-50">
        <div className="w-fit">
          <TabsComponent
            activeTab={activeCategory}
            onTabChange={setActiveCategory}
          />
        </div>
      </div>
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
            <Button size="sm" variant="secondary">
              {" "}
              <Link href={"/products"}>view all {">"} </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            {data?.listings
              .slice(0, 6)
              .map((product: Product, index: number) => (
                <ProductCard key={product.id} item={product} index={index} />
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
