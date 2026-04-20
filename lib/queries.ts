import { Item } from "@/src/types/items";
import { Category } from "./types";

export type ProductDetail = Item & {
  name?: string;
  price?: number;
  manufacturer?: string;
  slug?: string;
  compare_at_price?: number | null;
  category_id?: string | null;
  images?: string[];
  stock?: number;
  featured?: boolean;
  product_category?: {
    id: string;
    name: string;
  };
};

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
    ...options,
  });

  const result = await response.json();

  if (!response.ok || result.status === "error") {
    throw new Error(result.message || result.error || "Request failed");
  }

  return result.data as T;
}

export const getCategories = async (): Promise<Category[]> => {
  return fetchJSON<Category[]>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product-categories`
  );
};

export const getCategory = async (id: string): Promise<Category> => {
  return fetchJSON<Category>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product-categories/${id}`
  );
};

export const getProduct = async (id: string): Promise<ProductDetail | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    return null;
  }

  const endpoints = [
    `${baseUrl}/api/product/${id}`,
    `${baseUrl}/api/products/${id}`,
    `${baseUrl}/api/listings/${id}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      const result = await response.json();
      const data =
        result?.data ?? result?.product ?? result?.listing ?? result ?? null;

      if (data && typeof data === "object") {
        return data as ProductDetail;
      }
    } catch {
      continue;
    }
  }

  return null;
};
