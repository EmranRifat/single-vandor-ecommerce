"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

type Payload = {
    id: string;
    status: string;
};

const updateHostListingStatus = async ({
    id,
    status,
}: Payload) => {
    const token = Cookies.get("token") || "";

    const response = await fetch(
        `${baseUrl}/api/admin/host-listings/${id}/status`,
        {
            method: "PATCH", // Change to PUT if needed
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        },
    );

    if (!response.ok) {
        throw new Error("Failed to update status");
    }

    return response.json();
};

export const useUpdateHostListingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateHostListingStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin_host_listings"],
            });
        },
    });
};