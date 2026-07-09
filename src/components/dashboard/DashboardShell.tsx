"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@heroui/react";
import DashboardSidebar from "./DashboardSidebar";

type DashboardShellProps = {
  activeItem?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  children: React.ReactNode;
};

type PageConfig = {
  activeItem: string;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
};

const pageConfig: Record<string, PageConfig> = {
  "/admin/dashboard": {
    activeItem: "overview",
    eyebrow: "Dashboard",
    title: "Overview",
    description: "View your dashboard overview.",
    breadcrumbLabel: "Overview",
  },
  "/admin/dashboard/bookings": {
    activeItem: "bookings",
    eyebrow: "Admin Bookings Table",
    title: "",
    description: "",
    breadcrumbLabel: "Bookings",
  },
  "/admin/dashboard/users": {
    activeItem: "users",
    eyebrow: "Admin Users",
    title: "Manage Users",
    description: "Manage all users.",
    breadcrumbLabel: "Users",
  },
  "/admin/dashboard/listings": {
    activeItem: "listings",
    eyebrow: "Admin Listings",
    title: "Manage Listings",
    description: "Manage all listings.",
    breadcrumbLabel: "Listings",
  },
  "/admin/dashboard/messages": {
    activeItem: "messages",
    eyebrow: "Admin Messages",
    title: "Manage Messages",
    description: "Read and reply to customer messages.",
    breadcrumbLabel: "Messages",
  },
  "/admin/dashboard/logs": {
    activeItem: "logs",
    eyebrow: "Admin Logs",
    title: "Activity Logs",
    description: "View recent activity and system logs.",
    breadcrumbLabel: "Logs",
  },
  "/admin/dashboard/reviews": {
    activeItem: "reviews",
    eyebrow: "Admin Reviews",
    title: "Manage Reviews",
    description: "Moderate and reply to customer reviews.",
    breadcrumbLabel: "Reviews",
  },
  "/admin/dashboard/settings": {
    activeItem: "settings",
    eyebrow: "Admin Settings",
    title: "Settings",
    description: "Configure your workspace and account.",
    breadcrumbLabel: "Settings",
  },
  "/admin/dashboard/host_listings": {
    activeItem: "host_listings",
    eyebrow: "Host Listings",
    title: "Manage Host Listings",
    description: "Manage all host listings.",
    breadcrumbLabel: "Host Listings",
  },
};

const breadcrumbLabels: Record<string, string> = {
  overview: "Overview",
  listings: "Listings",
  bookings: "Bookings",
  users: "Users",
  reviews: "Reviews",
  messages: "Messages",
  settings: "Settings",
  logs: "Logs",
};

const findPageConfig = (pathname: string): PageConfig | null => {
  if (pageConfig[pathname]) return pageConfig[pathname];

  const matched = Object.keys(pageConfig).find(
    (key) => pathname.startsWith(`${key}/`) || pathname === key,
  );
  return matched ? pageConfig[matched] : null;
};

export default function DashboardShell({
  activeItem,
  eyebrow,
  title,
  description,
  actionLabel,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const derived = findPageConfig(pathname);

  const resolvedActiveItem = activeItem ?? derived?.activeItem ?? "overview";
  const resolvedEyebrow = eyebrow ?? derived?.eyebrow ?? "Dashboard";
  const resolvedTitle = title ?? derived?.title ?? "Dashboard";
  const resolvedDescription =
    description ?? derived?.description ?? "Manage your workspace.";
  const resolvedBreadcrumbLabel =
    derived?.breadcrumbLabel ??
    breadcrumbLabels[resolvedActiveItem] ??
    "Overview";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-screen-2.5xl flex-col lg:flex-row">
        <DashboardSidebar activeItem={resolvedActiveItem} />

        <section className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
          <Breadcrumbs className="mb-4 hidden sm:flex">
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/admin/dashboard">
              Dashboard
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>{resolvedBreadcrumbLabel}</Breadcrumbs.Item>
          </Breadcrumbs>

          <div className="mb-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">
                {resolvedEyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
                {resolvedTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {resolvedDescription}
              </p>
            </div>

            {actionLabel ? (
              <button className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                {actionLabel}
              </button>
            ) : null}
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
