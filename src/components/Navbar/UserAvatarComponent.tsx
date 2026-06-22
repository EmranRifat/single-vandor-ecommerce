"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

type UserAvatarProps = {
  user: {
    id: string | number;
    name: string;
    email: string;
    role: string;
    token?: string;
  };
};

const UserAvatar = ({ user }: UserAvatarProps) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const displayName = user.name || user.email || "User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const handleLogOut = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("access");
    Cookies.remove("refresh");

    setUser(null);
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400 text-sm font-semibold text-white shadow-sm transition hover:bg-red-400Dark focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          aria-label="Open user menu"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-red-400 text-gray-100">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 bg-white text-gray-900">
        <DropdownMenuLabel className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-red-400 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
              <p className="text-xs capitalize text-gray-400">{user.role}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/admin/dashboard")}
        >
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/become-a-host")}
        >
          Become a host
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
          onClick={handleLogOut}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
