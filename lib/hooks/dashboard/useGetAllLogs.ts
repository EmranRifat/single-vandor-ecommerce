"use client";

import { ApiLogsPayload, ApiLogsResponse } from "@/lib/types/types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

const fetchAllLogs = async (
  payload: ApiLogsPayload = {},
): Promise<ApiLogsResponse> => {
  const token = Cookies.get("token") || "";

  if (!token) {
    throw new Error("Login token is required");
  }

  const params = new URLSearchParams();

  if (payload.page) {
    params.append("page", payload.page.toString());
  }

  if (payload.limit) {
    params.append("limit", payload.limit.toString());
  }

  const query = params.toString();
  const response = await fetch(
    `${baseUrl}/api/admin/All-logs${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to fetch API logs: ${response.status}`);
  }

  const result = (await response.json()) as ApiLogsResponse;

  if (!result.success) {
    throw new Error(result.message || result.error || "Failed to fetch API logs");
  }

  return result;
};

export const useGetAllLogs = (payload: ApiLogsPayload = {}) => {
  return useQuery<ApiLogsResponse, Error>({
    queryKey: ["admin_all_logs", payload],
    queryFn: () => fetchAllLogs(payload),
    staleTime: 0,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });
};
