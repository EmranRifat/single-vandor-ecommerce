"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Menu, CircleUserRound } from "lucide-react";
import { menuItems, navItems } from "../components/ui/menuItem/items";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "../components/Products/SearchBar";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
   const { user, logout, loading } = useAuth();
 const router = useRouter();
    const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-360 items-center justify-between px-6 lg:px-10">
        {/* Left */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg"
            alt="Airbnb"
            width={102}
            height={32}
            priority
          />
        </Link>

        <div>
          <SearchBar />
        </div>

        {/* Center */}
        {/* <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex flex-col items-center justify-center text-sm font-medium transition ${
                  isActive ? "text-black" : "text-gray-500 hover:text-black"
                }`}
              >
                {item.badge && (
                  <span className="absolute -top-3 rounded-full bg-blue-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}

                <span className="text-2xl">{item.icon}</span>

                <span className="mt-1">{item.title}</span>

                {isActive && (
                  <span className="absolute -bottom-2 h-0.75 w-full rounded-full bg-black" />
                )}
              </Link>
            );
          })}
        </nav> */}

        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-full px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 md:block">
            Become a host
          </button>

          {/* <button className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100">
            <Globe size={18} />
          </button> */}

          {/* Profile Menu */}
          <div className="relative" ref={menuRef}>
            {/* <Button
              size="sm"
              aria-expanded={openMenu}
              aria-label="Open user menu"
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-gray-300 px-3 py-2 shadow-sm transition hover:shadow-md"
            >
              <Menu size={18} />
              <CircleUserRound size={28} className="text-gray-500" />
            </Button> */}

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
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          )}

            {/* Dropdown */}
            {/* {openMenu && (
              <div className="absolute right-0 top-14 w-65 overflow-hidden rounded-3xl border border-gray-200 bg-white py-3 shadow-xl transition-all duration-400 ease-out animate-in fade-in zoom-in-95">
                <div className="flex flex-col">
                  {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.title}
                        className="flex items-center gap-4 px-5 py-4 text-left text-[17px] font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Icon
                          size={22}
                          className="text-gray-500"
                          strokeWidth={2}
                        />

                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
}
