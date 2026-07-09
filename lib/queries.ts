import {
  Category,
  ManualBookingPayload,
  ProductDetail,
  SslPaymentInitPayload,
  SslPaymentInitResponse,
} from "./types/types";
import Cookies from "js-cookie";



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




// export const createManualBooking = async (
//   payload: ManualBookingPayload,
// ): Promise<unknown> => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

//   if (!baseUrl) {
//     throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
//   }

//   return fetchJSON<unknown>(`${baseUrl}/api/bookings`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
// };


type ManualBookingResponse = {
  data: unknown;
  message?: string;
};

export const createManualBooking = async (payload: ManualBookingPayload): Promise<ManualBookingResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  console.log("ManualBookingPayload", payload)
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  const token = Cookies.get("token");
  const normalizedPayload = { ...payload } as Record<string, unknown>;

  if (
    Object.prototype.hasOwnProperty.call(normalizedPayload, "user_addres") &&
    !Object.prototype.hasOwnProperty.call(normalizedPayload, "user_address")
  ) {
    normalizedPayload.user_address = normalizedPayload.user_addres;
    delete normalizedPayload.user_addres;
  }

  const response = await fetch(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(normalizedPayload),
  });

  const rawText = await response.text();
  let result: { message?: string; error?: string; status?: string; data?: unknown } = {};
  try {
    result = rawText ? JSON.parse(rawText) : {};
  } catch {
    result = { message: rawText };
  }

  console.log("createManualBooking response", {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body: rawText,
    parsed: result,
  });

  if (!response.ok || result.status === "error") {
    const serverMessage =
      result.message ||
      result.error ||
      (rawText ? rawText : "") ||
      `Request failed with status ${response.status}`;
    throw new Error(serverMessage);
  }

  return { data: result.data, message: result.message };
};

export const initSslCommerzPayment = async (
  payload: SslPaymentInitPayload,
): Promise<SslPaymentInitResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  const token = Cookies.get("token");
  const response = await fetch(`${baseUrl}/api/payment/ssl/init`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as SslPaymentInitResponse & {
    message?: string;
    error?: string;
    status?: string;
  };

  if (!response.ok || result.status === "error") {
    throw new Error(
      result.message || result.error || "Failed to initialize SSLCommerz payment",
    );
  }

  return result;
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
