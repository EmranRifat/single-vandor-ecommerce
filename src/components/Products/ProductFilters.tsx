"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Category, SideCategory } from "@/lib/types/types";
import { Slider } from "../ui/slider";

export type ProductSortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "newest";

export type ProductFiltersState = {
  priceRange: [number, number];
  minRating: number;
  superhostOnly: boolean;
  sortBy: ProductSortOption;
};

export const MAX_PRICE = 50000;

export const DEFAULT_FILTERS: ProductFiltersState = {
  priceRange: [0, MAX_PRICE],
  minRating: 0,
  superhostOnly: false,
  sortBy: "recommended",
};

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
];

const RATING_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 4.5, label: "4.5+" },
];

type ProductFiltersProps = {
  categories: SideCategory[];
  selectedCategoryId: string;
  city?: string;
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
  activeFilterCount: number;
};

const formatPrice = (value: number) =>
  `৳${value.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;

const buildProductsHref = (categoryId?: string, city?: string) => {
  const params = new URLSearchParams();
  if (categoryId) params.set("category", categoryId);
  if (city) params.set("city", city);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
};

export default function ProductFilters({
  categories,
  selectedCategoryId,
  city,
  filters,
  onFiltersChange,
  onReset,
  activeFilterCount,
}: ProductFiltersProps) {
  const updateFilters = (partial: Partial<ProductFiltersState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white  shadow-md shadow-pink-200">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300">
              Filters
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Refine your search
            </p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 dark:bg-gray-400 px-3 py-1.5 text-xs font-semibold text-pink-700 transition hover:bg-pink-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </motion.button>
        )}
      </div>

      <div
        className="
    rounded-2xl
    border border-gray-200 dark:border-gray-700

    bg-gradient-to-br
    from-gray-50
    via-white
    to-gray-100

    dark:from-gray-900
    dark:via-gray-800
    dark:to-gray-700

    p-5

    shadow-lg shadow-gray-200/40
    dark:shadow-xl dark:shadow-black/30

    transition-all duration-300
  "
      >
        <div className="mb-5 flex items-center gap-2">
          <Tag className="h-4 w-4 text-pink-500" />

          <h3
            className="
        text-sm
        font-semibold
        uppercase
        tracking-wider
        text-gray-700
        dark:text-gray-200
      "
          >
            Categories
          </h3>
        </div>

        <div className="space-y-2">
          <Link href={buildProductsHref(undefined, city)}>
            <motion.span
              whileHover={{ x: 4 }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                !selectedCategoryId
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                  : `
      bg-gray-100
      text-gray-700
      ring-1 ring-gray-200
      hover:bg-pink-50
      hover:text-pink-700
      hover:ring-pink-200

      dark:bg-gray-800
      dark:text-gray-200
      dark:ring-gray-700
      dark:hover:bg-gray-700
      dark:hover:text-pink-300
      dark:hover:ring-pink-500/40
    `
              }`}
            >
              All Stays
            </motion.span>
          </Link>

          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;

            return (
              <Link
                key={category.id}
                href={buildProductsHref(category.id, city)}
              >
                <motion.span
                  whileHover={{ x: 4 }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                      : `
                  bg-white
                  text-gray-700
                  ring-1 ring-gray-200
                  hover:bg-pink-50
                  hover:ring-pink-200

                  dark:bg-[#091139]
                  dark:text-gray-200
                  dark:ring-gray-700
                  dark:hover:bg-gray-700
                  dark:hover:ring-pink-500/40
                `
                  }`}
                >
                  {category.name}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="
    rounded-2xl
    border border-gray-200 dark:border-gray-700
    bg-gradient-to-b from-white via-gray-50 to-gray-100
    dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black
    p-5
    shadow-lg shadow-gray-200/40
    dark:shadow-xl dark:shadow-black/30
    transition-all duration-300
  "
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">
            Price Range
          </h3>

          <span
            className="
        rounded-full
        bg-gray-100
        px-2.5
        py-1
        text-xs
        font-medium
        text-gray-600
        dark:bg-gray-700
        dark:text-gray-200
      "
          >
            per night
          </span>
        </div>

        <div className="mb-5 flex items-center justify-between text-sm font-semibold">
          <span className="text-gray-900 dark:text-white">
            {formatPrice(filters.priceRange[0])}
          </span>

          <span className="text-gray-300 dark:text-gray-600">—</span>

          <span className="text-gray-900 dark:text-white">
            {formatPrice(filters.priceRange[1])}
          </span>
        </div>

        <Slider
          min={0}
          max={MAX_PRICE}
          step={500}
          value={filters.priceRange}
          onValueChange={(value) =>
            updateFilters({ priceRange: value as [number, number] })
          }
          className="
      py-2
      [&_[role=slider]]:border-pink-500
      [&_[role=slider]]:bg-white
      dark:[&_[role=slider]]:bg-gray-900
      [&_[role=slider]]:shadow-md
      [&_.bg-primary]:bg-gradient-to-r
      [&_.bg-primary]:from-pink-500
      [&_.bg-primary]:to-rose-500
    "
        />

        <div className="mt-5 grid grid-cols-2 gap-2">
          {[5000, 10000, 20000, 30000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateFilters({ priceRange: [0, preset] })}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 ${
                filters.priceRange[0] === 0 && filters.priceRange[1] === preset
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-200 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700 dark:hover:ring-pink-500/40"
              }`}
            >
              Under {formatPrice(preset)}
            </button>
          ))}
        </div>
      </div>

      <div
        className="
    rounded-2xl
    border border-gray-200 dark:border-gray-700
    bg-gradient-to-b from-white via-gray-50 to-gray-100
    dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-700 dark:to-black
    p-5
    shadow-lg shadow-gray-200/40
    dark:shadow-xl dark:shadow-black/30
    transition-all duration-300
  "
      >
        <div className="mb-5 flex items-center gap-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">
            Guest Rating
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => {
            const isActive = filters.minRating === option.value;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => updateFilters({ minRating: option.value })}
                className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:ring-amber-200 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700 dark:hover:text-amber-300 dark:hover:ring-amber-500/40"
                }`}
              >
                {option.value > 0 && <Star className="h-3 w-3 fill-current" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="
    rounded-2xl
    border border-gray-200 dark:border-gray-700
    bg-gradient-to-br
    from-gray-50
    via-gray-100
    to-gray-200
    dark:from-gray-900
    dark:via-gray-800
    dark:to-gray-700
    p-5
    shadow-lg shadow-gray-200/40
    dark:shadow-xl dark:shadow-black/30
    transition-all duration-300
  "
      >
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={filters.superhostOnly}
            onCheckedChange={(checked) =>
              updateFilters({ superhostOnly: checked === true })
            }
            className="
        mt-0.5
        border-pink-300
        data-[state=checked]:border-pink-500
        data-[state=checked]:bg-pink-500
      "
          />

          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Superhost only
              </span>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              Show stays from experienced hosts with excellent reviews.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

export function countActiveFilters(filters: ProductFiltersState): number {
  let count = 0;

  if (filters.priceRange[0] > DEFAULT_FILTERS.priceRange[0]) count += 1;
  if (filters.priceRange[1] < DEFAULT_FILTERS.priceRange[1]) count += 1;
  if (filters.minRating > 0) count += 1;
  if (filters.superhostOnly) count += 1;
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count += 1;

  return count;
}

export function applyProductFilters(
  items: import("@/lib/types/getProducts").Product[],
  filters: ProductFiltersState,
) {
  const filtered = items.filter((item) => {
    const price = Number(item.price_per_night || 0);
    const rating = Number(item.rating || 0);

    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    if (filters.minRating > 0 && rating < filters.minRating) {
      return false;
    }

    if (filters.superhostOnly && !item.is_superhost) {
      return false;
    }

    return true;
  });

  const sorted = [...filtered];

  switch (filters.sortBy) {
    case "price_asc":
      sorted.sort(
        (a, b) =>
          Number(a.price_per_night || 0) - Number(b.price_per_night || 0),
      );
      break;
    case "price_desc":
      sorted.sort(
        (a, b) =>
          Number(b.price_per_night || 0) - Number(a.price_per_night || 0),
      );
      break;
    case "rating_desc":
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
    default:
      break;
  }

  return sorted;
}
