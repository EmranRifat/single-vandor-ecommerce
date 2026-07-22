"use client";

import { GetBookingsResponse } from "@/lib/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const fetchBookings = async (page: number = 1, limit: number = 1): Promise<GetBookingsResponse> => {

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Login token is required");
  }

  const url = new URL(`${baseUrl}/api/admin/bookings`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result: GetBookingsResponse = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to fetch bookings");
  }

  return result;
};

export const useGetBookings = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["admin", "bookings", page, limit],
    queryFn: () => fetchBookings(page, limit),
    placeholderData: (previousData) => previousData,
  });
};






const deleteBooking = async (id: number | string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Login token is required");
  }

  const response = await fetch(`${baseUrl}/api/admin/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let result: { status?: string; message?: string; error?: string } = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok || result.status === "error") {
    throw new Error(result.message || result.error || "Failed to delete booking");
  }

  return { id, ...result };
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
};