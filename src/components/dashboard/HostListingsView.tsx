"use client";

import { useMemo, useState } from "react";
import Filters from "./filters";
import { useGetHostListing } from "@/lib/hooks/dashboard/useGetHostListing";
import { HostListingItem } from "@/lib/types/types";
import Cookies from "js-cookie";
import { useUpdateHostListingStatus } from "@/lib/hooks/dashboard/useUpdateListing";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatFacilities = (facilities?: Record<string, boolean>) => {
  if (!facilities) return "-";

  const active = Object.entries(facilities)
    .filter(([, value]) => value)
    .map(([key]) =>
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase()),
    );

  return active.length ? active.join(", ") : "-";
};

const getStatusClass = (status?: string) => {
  const normalized = status?.toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "published" ||
    normalized === "active" ||
    normalized === "confirmed"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    normalized === "pending" ||
    normalized === "draft" ||
    normalized === "open"
  ) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    normalized === "rejected" ||
    normalized === "declined" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-slate-50 text-slate-600";
};

export default function HostListingView() {
  const { data, isLoading, isError, error } = useGetHostListing();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const token = Cookies.get("token") || "";

  const { mutateAsync: updateStatus, isPending } = useUpdateHostListingStatus();

  const listings = useMemo<HostListingItem[]>(() => data?.data ?? [], [data]);
  const filteredListings = useMemo<HostListingItem[]>(() => {
    return listings.filter((item) => {
      const searchMatch = [item.title, item.location, item.description]
        .filter(Boolean)
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const statusMatch =
        statusFilter === "all" || item.status?.toLowerCase() === statusFilter;

      const typeMatch =
        typeFilter === "all" || item.propertyType?.toLowerCase() === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [listings, searchTerm, statusFilter, typeFilter]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const getImageUrl = (url?: string) => {
    if (!url) return "";

    if (url.startsWith("blob:")) return "";
    if (url.startsWith("http")) return url;

    return `${API_URL}${url}`;
  };

  // function to handle status update
  const handleUpdateStatus = async (id: string, status: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this listing?`,
    );

    if (!confirmed) return;

    try {
      await updateStatus({ id, status });

      alert(`Listing ${status.toLowerCase()} successfully.`);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <Filters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        setSearchTerm={setSearchTerm}
        setStatusFilter={setStatusFilter}
        setTypeFilter={setTypeFilter}
        onReset={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setTypeFilter("all");
        }}
        total={listings.length}
        visible={filteredListings.length}
      />

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Listings table</h2>
        <p className="text-sm text-slate-500">Properties submitted by hosts.</p>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-md text-slate-700">Loading listings ...</p>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-rose-600">
            {error?.message || "Failed to load listings."}
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredListings.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            {listings.length === 0
              ? "No listings found."
              : "No listings match your search and filters."}
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredListings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-300 w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Host</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 min-w-35">Location</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Beds/Baths</th>
                <th className="px-4 py-3">Check In/Out</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Facilities</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((item, index) => {
                const image = getImageUrl(item.photos?.[0]);
                console.log("PHOTO FROM API:", item.photos?.[0]);
                console.log("FINAL IMAGE:", image);
                return (
                  <tr key={item.id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-600">{index + 1}</td>

                    <td className="px-4 py-4">
                      {image ? (
                        <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <img
                            src={image}
                            alt={item.title || "Listing image"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.log("Image failed:", e.currentTarget.src);
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[10px] text-slate-500">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {item.title || "-"}
                      </p>
                      <p className="mt-1 line-clamp-2 max-w-xs text-xs text-slate-500">
                        {item.description || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-mono text-xs">
                      {item.id}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      #{item.host_id}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.propertyType || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600 min-w-35">
                      <p className="wrap-break-word">{item.location || "-"}</p>
                      <p className="text-xs text-slate-400">
                        {item.latitude}, {item.longitude}
                      </p>
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-900">
                      ৳{Number(item.rentPerNight || 0).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.bedrooms} bed / {item.bathrooms} bath
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.checkIn || "-"} / {item.checkOut || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(item.availableFrom)} -{" "}
                      {formatDate(item.availableTo)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="max-w-xs text-xs text-slate-600">
                        {formatFacilities(item.facilities)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          item.status,
                        )}`}
                      >
                        {item.status || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          // onClick={() => console.log("Approve", item.id)}
                          onClick={() =>
                            handleUpdateStatus(item.id, "approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          onClick={() =>
                            handleUpdateStatus(item.id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
