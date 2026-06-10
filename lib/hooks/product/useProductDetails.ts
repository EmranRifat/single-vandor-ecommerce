import { ProductDetailsApiResponse, ProductDetailsPayload, ProductDetailsResponse } from "@/lib/types/types";
import { useQuery } from "@tanstack/react-query";


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
