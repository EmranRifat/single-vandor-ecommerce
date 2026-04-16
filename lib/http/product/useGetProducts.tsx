import { ProductListPayload, ProductListResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const defaultProductListResponse: ProductListResponse = {
  message: "Failed to fetch products",
  success: false,
  data: [],
  meta: {
    limit: 10,
    page: 1,
    total: 0,
    total_pages: 0,
  },
};

const fetchProductList = async (payload: ProductListPayload): Promise<ProductListResponse> => {
  
  const params = new URLSearchParams();
  if (payload.page) params.append("page", String(payload.page));
  if (payload.limit) params.append("limit", String(payload.limit));
  if (payload.q) params.append("q", payload.q);
  if (payload.category) params.append("category_id", payload.category);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/product?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(payload.token
        ? { Authorization: `Bearer ${payload.token}` }
        : {}),
    },
    cache: "no-store",
  });

  const res = await response.json();
  console.log("product list response =>", res);

  if (!response.ok) {
    throw new Error(res.message || res.error || `Fetch error: ${response.status}`);
  }

  if (res.status === "success") {
    return {
      message: "Products fetched successfully",
      success: true,
      data: res.data || [],
      meta: res.meta || {
        limit: payload.limit || 10,
        page: payload.page || 1,
        total: res.data?.length || 0,
        total_pages: 1,
      },
    };
  }

  return defaultProductListResponse;
};

export const useProductList = (payload: ProductListPayload) => {
  return useQuery<ProductListResponse>({
    queryKey: [
      "productList",
      payload.page,
      payload.limit,
      payload.q,
      payload.category,
      payload.token,
    ],
    queryFn: () => fetchProductList(payload),
  });
};