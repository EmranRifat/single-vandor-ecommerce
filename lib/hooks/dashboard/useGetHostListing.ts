"use client";

import { HostListingListResponse } from "@/lib/types/types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";


const fetchHostListings = async (): Promise<HostListingListResponse> => {
    const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

    const token = Cookies.get("token") || "";

    if (!token) {
        throw new Error("Login token is required");
    }

    const response = await fetch(`${baseUrl}/api/admin/host-listings`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(
            message || `Failed to fetch host listings: ${response.status}`,
        );
    }

    const result = (await response.json()) as HostListingListResponse;

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch host listings");
    }

    return result;
};

export const useGetHostListing = () => {
    return useQuery<HostListingListResponse, Error>({
        queryKey: ["admin_host_listings"],
        queryFn: fetchHostListings,
        staleTime: 60 * 1000,
    });
};
