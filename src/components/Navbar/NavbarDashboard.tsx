"use client";

import Image from "next/image";
import Link from "next/link";
import UserAvatarComponent from "./UserAvatarComponent";
import SidebarToggler from "./SidebarToggler";
import { useAuth } from "@/lib/auth-context";

export default function NavBarDashboard() {
  const { user, loading } = useAuth();

  return (
    <header className="flex w-full items-center bg-postGreen h-16 border-b">
      <div className="w-full">
        <div className="relative flex items-center justify-between">
          <div className="flex justify-between items-center gap-2">
            <SidebarToggler />

            <Link href="/" className="pl-2">
              <Image
                src="/static/images/logo/logo-post-dark.svg"
                alt="logo"
                width={40}
                height={40}
              />
            </Link>

            <p className="text-nowrap text-[22px] md:text-2xl text-white">
              Hotel Booking
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/become-a-host"
              className="hidden md:block rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              Become a host
            </Link>

            {!loading && user ? (
              <div className="flex gap-3 items-center mr-4">
                <p className="text-white font-medium text-sm md:text-base truncate max-w-48">
                  {user.name}
                </p>

                <UserAvatarComponent user={user} />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-md bg-primary py-3 px-8 text-base font-bold text-white md:block"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        
      </div>
    </header>
  );
}
