"use client";

import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export type HostListingItem = {
    id: string;
    listingId: string | null;
    host_id: number;
    title: string;
    description: string;
    status: string;
    photos: string[];
    rentPerNight: string;
    bathrooms: number;
    bedrooms: number;
    checkIn: string;
    checkOut: string;
    facilities: Record<string, boolean>;
    kitchens: number;
    latitude: number;
    longitude: number;
    location: string;
    propertyType: string;
    availabilitySelectionMode: string;
    availableFrom: string;
    availableTo: string;
    created_at: string;
    updated_at: string;
};

export type HostListingResponse = {
    count: number;
    data: HostListingItem[];
    success: boolean;
    message?: string;
};

const fetchHostListings = async (): Promise<HostListingResponse> => {
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

    const result = (await response.json()) as HostListingResponse;

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch host listings");
    }

    return result;
};

export const useGetHostListing = () => {
    return useQuery<HostListingResponse, Error>({
        queryKey: ["admin_host_listings"],
        queryFn: fetchHostListings,
        staleTime: 60 * 1000,
    });
};
