"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

type Payload = {
  id: number;
  role: string;
};

const updateUserRole = async ({ id, role }: Payload) => {
  const token = Cookies.get("token") || "";

  const response = await fetch(
    `${baseUrl}/api/admin/users/${id}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update user role");
  }

  return response.json();
};


export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: updateUserRole,


    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

  });
};