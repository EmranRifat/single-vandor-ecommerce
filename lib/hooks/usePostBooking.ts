// import { ManualBookingPayload, SslPaymentInitPayload, SslPaymentInitResponse } from "../types/types";

// type ManualBookingResponse = {
//   data: unknown;
//   message?: string;
// };

// export const createManualBooking = async (payload: ManualBookingPayload): Promise<ManualBookingResponse> => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

//   if (!baseUrl) {
//     throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
//   }

//   const token = Cookies.get("token");
//   const response = await fetch(`${baseUrl}/api/bookings`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify(payload),
//   });

//   const result = await response.json();

//   if (!response.ok || result.status === "error") {
//     throw new Error(result.message || result.error || "Failed to create booking");
//   }

//   return result;
// };

// export const initSslCommerzPayment = async (
//   payload: SslPaymentInitPayload,
// ): Promise<SslPaymentInitResponse> => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

//   if (!baseUrl) {
//     throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
//   }

//   const token = Cookies.get("token");
//   const response = await fetch(`${baseUrl}/api/payment/ssl/init`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: JSON.stringify(payload),
//   });

//   const result = (await response.json()) as SslPaymentInitResponse & {
//     message?: string;
//     error?: string;
//     status?: string;
//   };

//   if (!response.ok || result.status === "error") {
//     throw new Error(
//       result.message || result.error || "Failed to initialize SSLCommerz payment",
//     );
//   }

//   return result;
// };




