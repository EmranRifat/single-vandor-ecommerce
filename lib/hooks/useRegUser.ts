import { NewUser, RegUserResponse } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const registerUser = async (newUser: NewUser): Promise<RegUserResponse> => {
  const formData = new FormData();
  formData.append("email", newUser.email);
  formData.append("name", newUser.name);
  formData.append("password", newUser.password);
  formData.append("token", newUser.token);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();
  console.log("reg res data fetch ..> ", data);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Registration failed");
  }

  return data;
};

export const useRegInviteUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.message);
    },
  });
};