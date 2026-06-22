"use client";

import { useAuth } from "@/lib/auth-context";
import { Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "../components/Products/SearchBar";

export default function Navbar() {
  const { user, logout_user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout_user();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-360 items-center justify-between gap-5 px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white">
            <Home size={22} strokeWidth={2.4} />
          </span>
          <span className="text-2xl font-bold tracking-tight text-gray-950">
            StayNest
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/become-a-host"
            className="hidden md:block rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            Become a host
          </Link>

          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
          ) : !user ? (
            <Link
              href="/login"
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="max-w-32 truncate font-medium text-gray-700">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-3 py-1 text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
