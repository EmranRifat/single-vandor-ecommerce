"use client";

import { useMemo, useState } from "react";
import { Pagination as HeroPagination } from "@heroui/react";
import { Trash2 } from "lucide-react";
import Filters from "./filters";
import { useGetProductData } from "@/lib/hooks/product/useGetProducts";
import { Product } from "@/lib/types/getProducts";
import { useDeleteHostListing } from "@/lib/hooks/dashboard/useDeleteHostListing";

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}${url}`;
};

const getStatusClass = (status?: string) => {
  const normalized = status?.toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "published" ||
    normalized === "active" ||
    normalized === "confirmed"
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    normalized === "pending" ||
    normalized === "draft" ||
    normalized === "open"
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    normalized === "rejected" ||
    normalized === "reject" ||
    normalized === "cancelled"
  ) {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-slate-100 text-slate-700";
};
const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: Array<number | "start-ellipsis" | "end-ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) {
    pages.push("start-ellipsis");
  }
  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }
  if (end < totalPages - 1) {
    pages.push("end-ellipsis");
  }
  pages.push(totalPages);
  return pages;
};

export default function ListingsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const selectedCategoryName = undefined;
  const selectedCategoryId = undefined;

  const payload = {
    page,
    limit,
    category: selectedCategoryId ?? selectedCategoryName,
  };

  const { data, isLoading, isError, error } = useGetProductData(payload);
  const { mutateAsync: deleteListing, isPending: isDeleting } =
    useDeleteHostListing();
  const listings = useMemo<(Product & { status?: string })[]>(
    () => data?.listings ?? [],
    [data],
  );

  const pagination = data?.pagination;
  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const pageIndexOffset = (page - 1) * limit;
  const paginationItems = getPageNumbers(page, totalPages);

  const filteredListings = useMemo<(Product & { status?: string })[]>(() => {
    return listings.filter((item) => {
      const searchMatch = [
        item.title,
        item.description,
        item.category,
        item.city,
        item.host_name,
        item.status,
      ].some(
        (value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ??
          false,
      );

      const statusMatch =
        statusFilter === "all" ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      const typeMatch =
        typeFilter === "all" ||
        item.category?.toLowerCase() === typeFilter.toLowerCase();

      return searchMatch && statusMatch && typeMatch;
    });
  }, [listings, searchTerm, statusFilter, typeFilter]);

  const handleDeleteListing = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteListing({ id });
      alert("Listing deleted successfully.");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setDeletingId(null);
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
        <h2 className="text-xl font-semibold text-slate-900">
          Product listings
        </h2>
        <p className="text-sm text-slate-500">
          Loaded from the product data hook.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-md text-slate-700">Loading products...</p>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-rose-600">
            {error?.message || "Failed to load product listings."}
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredListings.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            {listings.length === 0
              ? "No product listings found."
              : "No product listings match your search and filters."}
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
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Host</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status </th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((item, index) => {
                const imageUrl = getImageUrl(item.image);
                return (
                  <tr key={item.id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-600">
                      {pageIndexOffset + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      {imageUrl ? (
                        <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <img
                            src={imageUrl}
                            alt={item.title || "Listing image"}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[10px] text-slate-500">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-mono text-xs">
                      {item.id && (
                        <>
                          {item.id.split("-").slice(0, 2).join("-")}
                          <br />
                          {item.id.split("-").slice(2).join("-")}
                        </>
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
                    <td className="px-4 py-4 text-slate-600">
                      {item.category || "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-600 max-w-50">
                      <p className="line-clamp-2 wrap-break-word">
                        {item.address || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.host_name || "-"}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      ৳{Number(item.price_per_night || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(item.status)}`}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(item.updated_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        aria-label={`Delete ${item.title || "listing"}`}
                        disabled={isDeleting && deletingId === item.id}
                        onClick={() => handleDeleteListing(item.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && totalItems > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
            {/* Left */}
            <div className="text-center md:text-left">
              Showing {startItem}–{endItem} of {totalItems}
              {pagination?.totalPages ? ` · Page ${page} of ${totalPages}` : ""}
            </div>

            {/* Center */}
            <div className="flex justify-center">
              <HeroPagination>
                <HeroPagination.Content className="flex flex-wrap items-center justify-center gap-2">
                  <HeroPagination.Previous
                    type="button"
                    isDisabled={page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(current - 1, 1))
                    }
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </HeroPagination.Previous>

                  {paginationItems.map((item) =>
                    item === "start-ellipsis" || item === "end-ellipsis" ? (
                      <HeroPagination.Ellipsis
                        key={item}
                        className="px-2 text-slate-500"
                      />
                    ) : (
                      <HeroPagination.Item key={item}>
                        <HeroPagination.Link
                          type="button"
                          isActive={item === page}
                          onClick={() => setPage(item)}
                          className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border px-3 text-sm font-semibold transition ${
                            item === page
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </HeroPagination.Link>
                      </HeroPagination.Item>
                    ),
                  )}

                  <HeroPagination.Next
                    type="button"
                    isDisabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(current + 1, totalPages))
                    }
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </HeroPagination.Next>
                </HeroPagination.Content>
              </HeroPagination>
            </div>

            {/* Right */}
            <div className="flex justify-center md:justify-end">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <span>Rows</span>
                <select
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));
                    setPage(1);
                  }}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={70}>70</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
