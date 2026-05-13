import { useQuery } from "@tanstack/react-query";
import { ApiResponse, GetProductsPayload } from "../../types/getProducts";

const defaultResponse: ApiResponse = {
  success: false,
  listings: [],
  message: "",
  pagination: {
    limit: 0,
    page: 0,
    totalPages: 0,
  },
};

const fetchProducts = async (
  payload: GetProductsPayload,
): Promise<ApiResponse> => {
  const params = new URLSearchParams();

  if (payload.page) {
    params.append("page", payload.page.toString());
  }

  if (payload.limit) {
    params.append("limit", payload.limit.toString());
  }

  if (payload.category) {
    params.append("category", payload.category);
  }

  if (payload.city) {
    params.append("city", payload.city);
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/listings?${params.toString()}`;

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(payload.token ? { Authorization: `Bearer ${payload.token}` } : {}),
      },
      cache: "no-store",
    });

    console.log("response.status =>", response.status);
    console.log("response.ok =>", response.ok);

    if (!response.ok) {
      throw new Error(
        response?.statusText || `Request failed: ${response.status}`,
      );
    }

    const res = await response.json();

    console.log("response data => ", res);

    return res;
  } catch (err) {
    console.error(err);
    return defaultResponse;
  }
};

export const useGetProductData = (payload: GetProductsPayload) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["product_data", payload],
    queryFn: () => fetchProducts(payload),
  });
};
