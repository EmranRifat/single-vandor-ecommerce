"use client";

import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { Pagination as HeroPagination, Spinner } from "@heroui/react";

import { motion } from "framer-motion";

import Link from "next/link";

import { ChevronRight, X } from "lucide-react";

import Cookies from "js-cookie";

import ItemCard from "@/src/components/Products/ProductCard";

import { useGetProductData } from "@/lib/hooks/product/useGetProducts";

import ProductFilters, {
  applyProductFilters,
  countActiveFilters,
  DEFAULT_FILTERS,
  MAX_PRICE,
  ProductFiltersState,
} from "@/src/components/Products/ProductFilters";

import { GetProductsPayload, Product } from "@/lib/types/getProducts";
import Choice from "@/src/components/Home/Choice";
import AppStore from "@/src/components/Home/Appstore";
import Footer from "@/src/components/common/footer/footer";

const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: Array<number | "start-ellipsis" | "end-ellipsis"> = [1];

  const start = Math.max(2, page - 1);

  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) {
    pages.push("start-ellipsis");
  }

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  if (end < totalPages - 1) {
    pages.push("end-ellipsis");
  }

  pages.push(totalPages);

  return pages;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const token = Cookies.get("token") || "";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_FILTERS);
  const activeFilterCount = countActiveFilters(filters);

  useEffect(() => {
    setPage(1);
  }, [categoryId, city, filters]);

  const payload: GetProductsPayload = {
    page,

    limit,

    token,

    category: categoryId || undefined,

    city: city || undefined,

    min_price: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,

    max_price:
      filters.priceRange[1] < MAX_PRICE ? filters.priceRange[1] : undefined,

    min_rating: filters.minRating > 0 ? filters.minRating : undefined,

    is_superhost: filters.superhostOnly || undefined,

    sort_by: filters.sortBy !== "recommended" ? filters.sortBy : undefined,
  };

  const { data, isLoading, isFetching, isError } = useGetProductData(payload);

  const items = data?.listings || [];

  const filteredItems = useMemo(
    () => applyProductFilters(items, filters),

    [items, filters],
  );

  const pagination = data?.pagination;

  const totalItems = pagination?.total ?? 0;

  const totalPages = pagination?.totalPages ?? 1;

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, totalItems);

  const paginationItems = getPageNumbers(page, totalPages);

  const categories: { id: string; name: string }[] = [
    { id: "1", name: "Apartment" },
    { id: "2", name: "Hotel" },
    { id: "3", name: "Room" },
  ];

  const currentCategory = categories.find((c) => c.id === categoryId);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const activeFilterChips = [
    filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_PRICE
      ? {
          key: "price",

          label: `৳${filters.priceRange[0].toLocaleString()} – ৳${filters.priceRange[1].toLocaleString()}`,

          onRemove: () =>
            setFilters((current) => ({
              ...current,

              priceRange: DEFAULT_FILTERS.priceRange,
            })),
        }
      : null,

    filters.minRating > 0
      ? {
          key: "rating",

          label: `${filters.minRating}+ rating`,

          onRemove: () =>
            setFilters((current) => ({ ...current, minRating: 0 })),
        }
      : null,

    filters.superhostOnly
      ? {
          key: "superhost",

          label: "Superhost",

          onRemove: () =>
            setFilters((current) => ({ ...current, superhostOnly: false })),
        }
      : null,

    filters.sortBy !== "recommended"
      ? {
          key: "sort",

          label: filters.sortBy.replace("_", " "),

          onRemove: () =>
            setFilters((current) => ({ ...current, sortBy: "recommended" })),
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;

    label: string;

    onRemove: () => void;
  }>;

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
     from-gray-50
     via-white
     to-gray-100

    dark:bg-gradient-to-br
    dark:from-gray-950
    dark:via-gray-900
    dark:to-gray-800

    transition-colors
    duration-300
  "
    >
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-4">
        {/* show laoder when is laoding data  */}
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center gap-3 py-20">
            <Spinner color="success" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>

            <ChevronRight className="w-4 h-4" />

            <span className="text-gray-900 dark:text-gray-400 font-semibold">
              {city
                ? `Stays in ${city}`
                : currentCategory
                  ? currentCategory.name
                  : "All Products"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-2">
            {city
              ? `Stays in ${city}`
              : currentCategory
                ? currentCategory.name
                : "At a Glance ️⛳️ All Listings"}
          </h1>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-slate-100 dark:bg-gray-800 p-6 shadow-sm">
              <ProductFilters
                categories={categories}
                selectedCategoryId={categoryId}
                city={city || undefined}
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3"
          >
            {activeFilterChips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Active
                </span>

                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700 transition hover:bg-pink-100"
                  >
                    {chip.label}

                    <X className="h-3 w-3" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(Math.min(limit, 6))].map((_, i) => (
                  <div
                    key={i}
                    className="h-105 rounded-lg bg-white shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">Failed to load data.</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredItems.map((item: Product, index: number) => (
                    <ItemCard key={item.id} item={item} index={index} />
                  ))}
                </div>

                {totalItems > 0 && (
                  <div
                    className="
      mt-8
      rounded-2xl
      border border-gray-200 dark:border-gray-700

      bg-gradient-to-br
      from-white
      via-gray-50
      to-gray-100

      dark:from-gray-900
      dark:via-gray-800
      dark:to-gray-700

      px-5
      py-4

      shadow-md shadow-gray-200/40
      dark:shadow-xl dark:shadow-black/30

      transition-all
      duration-300
    "
                  >
                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                      {/* Info */}
                      <div className="text-center text-sm text-gray-600 dark:text-gray-300 md:text-left">
                        Showing{" "}
                        <span className="font-semibold">{startItem}</span>–
                        <span className="font-semibold">{endItem}</span> of{" "}
                        <span className="font-semibold">{totalItems}</span>
                        {pagination?.totalPages
                          ? ` · Page ${page} of ${totalPages}`
                          : ""}
                      </div>

                      {/* Pagination */}
                      <div className="flex justify-center">
                        <HeroPagination>
                          <HeroPagination.Content className="flex flex-wrap items-center justify-center gap-2">
                            {/* Previous */}
                            <HeroPagination.Previous
                              type="button"
                              isDisabled={page <= 1}
                              onClick={() =>
                                setPage((current) => Math.max(current - 1, 1))
                              }
                              className="
                inline-flex
                h-9
                items-center
                justify-center

                rounded-xl

                border border-gray-200
                dark:border-gray-600

                bg-gray-100
                dark:bg-gray-800

                px-3

                text-sm
                font-semibold

                text-gray-700
                dark:text-gray-200

                transition-all
                duration-300

                hover:bg-pink-50
                hover:text-pink-700

                dark:hover:bg-gray-700
                dark:hover:text-pink-300

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                            >
                              Prev
                            </HeroPagination.Previous>

                            {/* Page Numbers */}
                            {paginationItems.map((item) =>
                              item === "start-ellipsis" ||
                              item === "end-ellipsis" ? (
                                <HeroPagination.Ellipsis
                                  key={item}
                                  className="px-2 text-gray-500 dark:text-gray-400"
                                />
                              ) : (
                                <HeroPagination.Item key={item}>
                                  <HeroPagination.Link
                                    type="button"
                                    isActive={item === page}
                                    onClick={() => setPage(item)}
                                    className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all duration-300 ${
                                      item === page
                                        ? "border-pink-500 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                                        : `
                          border-gray-200
                          dark:border-gray-600

                          bg-gray-100
                          dark:bg-gray-800

                          text-gray-700
                          dark:text-gray-200

                          hover:bg-pink-50
                          hover:text-pink-700

                          dark:hover:bg-gray-700
                          dark:hover:text-pink-300
                        `
                                    }`}
                                  >
                                    {item}
                                  </HeroPagination.Link>
                                </HeroPagination.Item>
                              ),
                            )}

                            {/* Next */}
                            <HeroPagination.Next
                              type="button"
                              isDisabled={page >= totalPages}
                              onClick={() =>
                                setPage((current) =>
                                  Math.min(current + 1, totalPages),
                                )
                              }
                              className="
                inline-flex
                h-9
                items-center
                justify-center

                rounded-xl

                border border-gray-200
                dark:border-gray-600

                bg-gray-100
                dark:bg-gray-800

                px-3

                text-sm
                font-semibold

                text-gray-700
                dark:text-gray-200

                transition-all
                duration-300

                hover:bg-pink-50
                hover:text-pink-700

                dark:hover:bg-gray-700
                dark:hover:text-pink-300

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                            >
                              Next
                            </HeroPagination.Next>
                          </HeroPagination.Content>
                        </HeroPagination>
                      </div>

                      {/* Per Page */}
                      <div className="flex justify-center md:justify-end">
                        <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Per page</span>

                          <select
                            value={limit}
                            onChange={(event) => {
                              setLimit(Number(event.target.value));
                              setPage(1);
                            }}
                            className="
              h-9

              rounded-xl

              border border-gray-200
              dark:border-gray-600

              bg-gray-100
              dark:bg-gray-800

              px-3

              text-sm

              text-gray-900
              dark:text-white

              transition-all
              duration-300

              focus:border-pink-400
              focus:outline-none
              focus:ring-2
              focus:ring-pink-200

              dark:focus:ring-pink-500/30
            "
                          >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : items.length > 0 ? (
              <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 px-6 py-16 text-center">
                <p className="text-lg font-semibold text-gray-900">
                  No stays match your filters
                </p>

                <p className="mt-2 text-gray-500">
                  Try widening the price range or removing some filters.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-6 inline-flex items-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Reset filters
                </button>
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
      <Choice />
      <AppStore />
      <Footer />
    </div>
  );
}
