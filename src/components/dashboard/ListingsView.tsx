"use client";

import { useMemo } from "react";
import AdminTable from "./AdminTable";
import { useGetHostListing } from "@/lib/hooks/dashboard/useGetHostListing";

export default function ListingsView() {
  const { data, isLoading, isError, error } = useGetHostListing();

  const rows = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return data.data.map((item, index) => ({
      index: `${index + 1}`,
      id: item.id,
      image: item.photos?.[0] ? (
        <div className="h-12 w-16 overflow-hidden rounded-md border border-slate-200">
          <img
            src={item.photos[0]}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-12 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[10px] text-slate-500">
          No image
        </div>
      ),
      title: item.title,
      location: item.location,
      description: item.description
        ? `${item.description.slice(0, 50)}${item.description.length > 50 ? "..." : ""}`
        : "",
      host: `#${item.host_id}`,
      category: item.propertyType,
      price: item.rentPerNight,
      status: item.status || "",
    }));
  }, [data]);

  return (
    <div className="mt-8 space-y-4">
      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Loading listings...</p>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-rose-600">
            {error?.message || "Failed to load listings."}
          </p>
        </div>
      ) : data?.data.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">No listings found.</p>
        </div>
      ) : null}

      <AdminTable
        title="Listings table"
        description="Properties submitted by hosts."
        columns={[
          "#",
          "ID",
          "Image",
          "Title",
          "Location",
          "Description",
          "Host",
          "Category",
          "Price",
          "Status",
        ]}
        rows={rows}
      />
    </div>
  );
}
