import { Item } from "@/src/types/items";
import { Category } from "./types/types";

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

export type ManualBookingPayload = {
  listing_id: string;
  payment_method: "manual";
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_amount: number;
  currency: string;
  billing_address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  card_last4: string;
  card_expiration: string;
  terms_accepted: boolean;
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
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product-categories`,
  );
};

export const createManualBooking = async (
  payload: ManualBookingPayload,
): Promise<unknown> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  return fetchJSON<unknown>(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const getCategory = async (id: string): Promise<Category> => {
  return fetchJSON<Category>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product-categories/${id}`,
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
