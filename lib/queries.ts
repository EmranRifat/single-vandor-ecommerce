import { Category, Product } from "./types";

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

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    return await fetchJSON<Product>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product/${id}`
    );
  } catch {
    return null;
  }
};