"use client";

import { useState } from "react";
import {
  BedDouble,
  CalendarCheck,
  LayoutDashboard,
  Menu,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    key: "host_listings",
    label: "Host Listings",
    icon: BedDouble,
    href: "/admin/dashboard/host_listings",
  },
  {
    key: "listings",
    label: " Listings",
    icon: CalendarCheck,
    href: "/admin/dashboard/listings",
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: CalendarCheck,
    href: "/admin/dashboard/bookings",
  },
  {
    key: "users",
    label: "Users",
    icon: Users,
    href: "/admin/dashboard/users",
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: Star,
    href: "/admin/dashboard/reviews",
  },

  {
    key: "logs",
    label: "Logs",
    icon: Star,
    href: "/admin/dashboard/logs",
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    href: "/admin/dashboard/settings",
  },
];

type DashboardSidebarProps = {
  activeItem: string;
};

export default function DashboardSidebar({
  activeItem,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar with hamburger button on the LEFT */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Admin panel
            </p>
            <h1 className="truncate text-base font-bold tracking-normal text-slate-950">
              Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* Mobile slide-in drawer that mirrors the desktop vertical sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[90%] flex-col bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Admin panel
                  </p>
                  <h2 className="text-base font-bold tracking-normal text-slate-950">
                    Dashboard
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 overflow-y-auto px-3 py-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === activeItem;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sidebar (unchanged from original) */}
      <aside className="hidden border-b border-slate-200 bg-white px-4 py-5 lg:sticky lg:top-0 lg:z-20 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Admin panel</p>
            <h1 className="text-xl font-bold tracking-normal">Dashboard</h1>
          </div>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeItem;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
