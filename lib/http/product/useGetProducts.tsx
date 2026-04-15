import { useQuery } from "@tanstack/react-query";

export interface ProductCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  product_category_id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  manufacturer: string;
  created_at: string;
  updated_at: string;
  product_category: ProductCategory;
}

export interface ProductMeta {
  limit: number;
  page: number;
  total: number;
  total_pages: number;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  meta: ProductMeta;
}

export interface ProductListPayload {
  token?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export const defaultProductListResponse: ProductListResponse = {
  success: false,
  data: [],
  meta: {
    limit: 10,
    page: 1,
    total: 0,
    total_pages: 0,
  },
};

const fetchProductList = async (
  payload: ProductListPayload,
): Promise<ProductListResponse> => {
  const params = new URLSearchParams();

  if (payload.page) params.append("page", String(payload.page));
  if (payload.limit) params.append("limit", String(payload.limit));
  if (payload.q) params.append("q", payload.q);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product?${params.toString()}`;

  console.log("acessss-->", payload.token);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${payload.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }

    const res: ProductListResponse = await response.json();
    console.log("res json.....", res);

    if (res.success) {
      return res;
    } else {
      return defaultProductListResponse;
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};

export const useProductList = (payload: ProductListPayload) => {
  return useQuery<ProductListResponse>({
    queryKey: [
      "productList",
      payload.page,
      payload.limit,
      payload.q,
      payload.token,
    ],
    queryFn: () => fetchProductList(payload),
  });
};
