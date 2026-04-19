import { ItemListResponse, ItemListPayload } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const fetchProductList = async (
  payload: ItemListPayload
): Promise<ItemListResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const url = new URL("/api/listings", baseUrl);

  if (payload.page != null) {
    url.searchParams.append("page", String(payload.page));
  }
  if (payload.limit != null) {
    url.searchParams.append("limit", String(payload.limit));
  }
  if (payload.q) {
    url.searchParams.append("q", payload.q);
  }
  if (payload.category) {
    url.searchParams.append("category", String(payload.category));
  }

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

  console.log("response.status =>", response.status);
  console.log("response.ok =>", response.ok);

  const res = await response.json();
  console.log("Fetched items List Data =>", res);

  if (!response.ok) {
    throw new Error(res?.message || `Request failed: ${response.status}`);
  }

  return {
    message: res?.message || "Listings fetched successfully",
    success: res?.success ?? false,
    data: Array.isArray(res?.listings) ? res.listings : [],
    meta: {
      limit: res?.pagination?.limit ?? payload.limit ?? 10,
      page: res?.pagination?.page ?? payload.page ?? 1,
      total_pages: res?.pagination?.totalPages ?? 0,
    },
  };
};

export const useProductList = (payload: ItemListPayload) => {
  return useQuery<ItemListResponse, Error>({
    queryKey: ["productList", payload],
    queryFn: () => fetchProductList(payload),
  });
};