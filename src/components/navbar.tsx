"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ShopHub
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <ShoppingCart />
          </Link>

          {loading ? (
            <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse" />
          ) : !user ? (
            <Link
              href="/login"
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}