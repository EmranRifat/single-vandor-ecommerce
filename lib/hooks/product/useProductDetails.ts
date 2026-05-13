import { useQuery } from "@tanstack/react-query";

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  city: string;
  country: string;
  image: string;
  category: string;
  rating: number;
  reviews_count: number;
  host_name: string;
  is_superhost: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductDetailsResponse {
  message: string;
  success: boolean;
  data: ProductItem | null;
}

export interface ProductDetailsPayload {
  id: string;
  token?: string;
}

interface ProductDetailsApiResponse {
  product: ProductItem;
  message: string;
  success: boolean;
}

const fetchProductDetails = async (
  payload: ProductDetailsPayload
): Promise<ProductDetailsResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  const url = new URL(`/api/listing/${payload.id}`, baseUrl);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(payload.token
        ? { Authorization: `Bearer ${payload.token}` }
        : {}),
    },
    cache: "no-store",
  });

  const res: ProductDetailsApiResponse = await response.json();
  console.log("Fetched product details =>", res);

  if (!response.ok) {
    throw new Error(res?.message || `Request failed: ${response.status}`);
  }

  return {
    message: res?.message || "Listing fetched successfully",
    success: res?.success ?? false,
    data: res?.product ?? null,
  };
};

export const useProductDetails = (payload: ProductDetailsPayload) => {
  return useQuery<ProductDetailsResponse, Error>({
    queryKey: ["productDetails", payload.id],
    queryFn: () => fetchProductDetails(payload),
    enabled: !!payload.id,
  });
};