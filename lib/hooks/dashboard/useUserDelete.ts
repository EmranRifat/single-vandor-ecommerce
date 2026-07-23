"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://192.168.1.71:8080";

type Payload = {
  id: number;
};

const deleteUser = async ({ id }: Payload) => {
  const token = Cookies.get("token") || "";

  const response = await fetch(`${baseUrl}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete user");
  }

  return result;
};
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin_users"],
      });
    },
  });
};