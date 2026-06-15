"use client";

import { Breadcrumbs } from "@heroui/react";
import DashboardSidebar from "./DashboardSidebar";

type DashboardShellProps = {
  activeItem: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  children: React.ReactNode;
};

const breadcrumbLabels: Record<string, string> = {
  overview: "Overview",
  listings: "Listings",
  bookings: "Bookings",
  users: "Users",
  reviews: "Reviews",
  messages: "Messages",
  settings: "Settings",
};

export default function DashboardShell({
  activeItem,
  eyebrow,
  title,
  description,
  actionLabel,
  children,
}: DashboardShellProps) {
  const activeLabel = breadcrumbLabels[activeItem] || "Overview";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-screen-2.5xl flex-col lg:flex-row">
        <DashboardSidebar activeItem={activeItem} />

        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Breadcrumbs className="mb-4">
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/admin/dashboard">
              Dashboard
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>{activeLabel}</Breadcrumbs.Item>
          </Breadcrumbs>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">
                {eyebrow}
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-normal text-slate-950">
                {title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {description}
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
