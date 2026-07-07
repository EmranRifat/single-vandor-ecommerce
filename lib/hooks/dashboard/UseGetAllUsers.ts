"use client";

import { GetAllUsersResponse } from "@/lib/types/types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const fetchAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<GetAllUsersResponse> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Login token is required");
  }

  const url = new URL(`${baseUrl}/api/admin/allUsers`);
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

  const result: GetAllUsersResponse = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result;
};


export const useGetAllUsers = (page: number = 1, limit: number = 5
) => {
  return useQuery({
    queryKey: ["admin", "allUsers", page, limit],
    queryFn: () => fetchAllUsers(page, limit),
    placeholderData: (previousData) => previousData,
  });
};