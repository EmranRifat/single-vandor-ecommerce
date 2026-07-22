"use client";

import { GetReviewsResponse } from "@/lib/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";


const fetchReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<GetReviewsResponse> => {

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://192.168.1.71:8080";

  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Login token is required");
  }


  const url = new URL(`${baseUrl}/api/admin/reviews`);

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


  const result: GetReviewsResponse = await response.json();


  if (!response.ok || result.status !== "success") {
    throw new Error(
      result.message || "Failed to fetch reviews"
    );
  }


  return result;
};



export const useGetReviews = ( page: number = 1, limit: number = 10) => {

  return useQuery({
    queryKey: [ "admin","reviews",  page,limit,],
    queryFn: () =>
      fetchReviews(page, limit),

    placeholderData: (previousData) =>
      previousData,
  });
};