"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

type Payload = {
    id: string;
};

const deleteHostListing = async ({ id }: Payload) => {
    const token = Cookies.get("token") || "";

    const response = await fetch(`${baseUrl}/api/admin/host-listings/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete listing");
    }

    return response.json();
};

export const useDeleteHostListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHostListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_host_listings"] });
            queryClient.invalidateQueries({ queryKey: ["product_data"] });
        },
    });
};
