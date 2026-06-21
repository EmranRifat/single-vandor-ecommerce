"use server";

import { cookies } from "next/headers";
import { VerifiedUser } from "../types";

export const verify_cookies = async (): Promise<VerifiedUser | null> => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) return null;

  const user = JSON.parse(userCookie);

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};