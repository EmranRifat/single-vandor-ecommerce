"use client";

import { useMemo, useState } from "react";
import { Pagination as HeroPagination } from "@heroui/react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import Filters from "./filters";
import {
  useDeleteBooking,
  useGetBookings,
} from "@/lib/hooks/dashboard/UseGetAllUsers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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

const getPaymentBadgeClass = (paymentMethod?: string) => {
  const normalized = paymentMethod?.toLowerCase();

  if (normalized === "manual") {
    return "bg-pink-100 text-pink-700 border border-pink-200";
  }

  if (normalized === "sslcommerz" || normalized === "ssl") {
    return "bg-slate-100 text-slate-900 border border-slate-200";
  }

  return "bg-slate-100 text-slate-700 border border-slate-200";
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

export default function BookingList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [bookingToDelete, setBookingToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useGetBookings(page, limit);

  const { mutateAsync: deleteBooking, isPending: isDeleting } =
    useDeleteBooking();

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const result = await deleteBooking(bookingToDelete.id);
      toast.success(
        (result as { message?: string })?.message ||
          "Booking deleted successfully.",
      );
      setBookingToDelete(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete booking.";
      toast.error(message);
    }
  };

  const bookings = data?.data ?? [];

  const pagination = data?.pagination;
  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const pageIndexOffset = (page - 1) * limit;
  const paginationItems = getPageNumbers(page, totalPages);

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const searchMatch = [
        item.booking_id,
        item.booked_by_name,
        item.booked_by_email,
        item.booked_by_role,
        item.user_name,
        item.user_email,
        item.user_role,
        item.listing_id,
        item.payment_method,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const statusMatch =
        statusFilter === "all" ||
        item.payment_method?.toLowerCase() === statusFilter.toLowerCase();

      return searchMatch && statusMatch;
    });
  }, [bookings, searchTerm, statusFilter]);

  return (
    <div className="mt-0 rounded-xl ">
      <div className="">
        {/* <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                All bookings Data
              </h2>
              <p className="text-sm text-slate-500">
                Loaded from the bookings data hook.
              </p>
            </div>
          </div>
        </div> */}

        <div className="bg-white ">
          <Filters
            className="rounded-2xl p-3 shadow-sm"
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
            total={bookings.length}
            visible={filteredBookings.length}
          />
        </div>

        {isLoading && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-md text-slate-700">Loading bookings...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-rose-600">
              {(error as Error | undefined)?.message ||
                "Failed to load bookings."}
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredBookings.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              {bookings.length === 0
                ? "No bookings found."
                : "No bookings match your search and filters."}
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredBookings.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead
                className={`
            bg-[#e3edf7]
            dark:bg-gray-700/70
            text-gray-700
            dark:text-gray-300
            text-center
            text-xs
            sm:text-sm
            font-semibold
            py-4
            px-2
            h-13
            border-b
            border-gray-200
            dark:border-gray-700
            rounded-none
            first:rounded-none
            last:rounded-none
            before:hidden
          `}
              >
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Booking ID</th>
                  {/* <th className="px-4 py-3">List ing ID</th> */}
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Booked by</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>

                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((item, index) => {
                  const totalGuests = (item.adults || 0) + (item.children || 0);
                  const bookingIdValue = item.booking_id ?? item.id;
                  const emailValue =
                    item.booked_by_email || item.user_email || "-";
                  const roleValue =
                    item.booked_by_role || item.user_role || "-";
                  const streetValue =
                    item.user_street || item.billing_street || "";
                  const cityValue = item.user_city || item.billing_city || "";
                  const zipValue = item.user_zip || item.billing_zip || "";
                  const countryValue =
                    item.user_country || item.billing_country || "Bangladesh";
                  const hasStreet = !!streetValue;
                  const hasCity = !!cityValue;
                  const hasZip = !!zipValue;
                  const hasAnyAddress = hasStreet || hasCity || hasZip;
                  return (
                    <tr key={item.id} className="align-top hover:bg-slate-50">
                      <td className="px-4 py-4 text-center text-slate-600">
                        {pageIndexOffset + index + 1}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-700 text-center">
                        #{bookingIdValue}
                      </td>

                      {/* <td className="px-4 py-4 font-mono text-xs text-slate-600 text-center">
                      <div className="group relative inline-block">
                        <span className="cursor-pointer">
                          {item.listing_id
                            ? `${item.listing_id.slice(0, 8)}...`
                            : "-"}
                        </span>

                    
                      </div>
                    </td> */}

                      <td className="px-4 py-4 text-slate-700">
                        <div className="flex items-center gap-3">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_title || "Product image"}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-500">
                              N/A
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {item.product_title || "No title"}
                            </p>
                            {item.listing_id && (
                              <p className="truncate text-[11px] text-slate-500">
                                {item.listing_id}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-900 text-center">
                        {item.booked_by_name || item.user_name || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-center">
                        {emailValue}
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-center">
                        {roleValue}
                      </td>

                      <td className="px-4 py-4 text-slate-600 text-center">
                        {totalGuests} ({item.adults || 0}A /{" "}
                        {item.children || 0}
                        C)
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadgeClass(
                            item.payment_method,
                          )}`}
                        >
                          {item.payment_method || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900 text-center">
                        {Number(item.total_amount || 0).toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          {item.currency}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {hasAnyAddress ? (
                          <div className="max-w-[220px] text-left">
                            {hasStreet && (
                              <p
                                className="line-clamp-2 text-xs font-medium text-slate-900"
                                title={streetValue}
                              >
                                {streetValue}
                              </p>
                            )}

                            {(hasCity || hasZip) && (
                              <p className="mt-1 text-[11px] text-slate-500">
                                {hasCity && <span>{cityValue}</span>}
                                {hasCity && hasZip && ", "}
                                {hasZip && <span>{zipValue}</span>}
                              </p>
                            )}

                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              {countryValue}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center text-slate-600">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setBookingToDelete({
                              id: item.id,
                              name: item.booked_by_name || `#${item.id}`,
                            })
                          }
                          disabled={isDeleting}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Delete booking ${item.id}`}
                          title="Delete booking"
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
                {pagination?.totalPages
                  ? ` · Page ${page} of ${totalPages}`
                  : ""}
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
                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition ${
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

        {/* Delete confirmation modal */}
        {bookingToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() => !isDeleting && setBookingToDelete(null)}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Delete booking
                </h3>
                <button
                  type="button"
                  onClick={() => setBookingToDelete(null)}
                  disabled={isDeleting}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      Are you sure you want to delete this booking?
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Booking{" "}
                      <span className="font-semibold text-slate-700">
                        #{bookingToDelete.id}
                      </span>{" "}
                      by{" "}
                      <span className="font-semibold text-slate-700">
                        {bookingToDelete.name}
                      </span>{" "}
                      will be permanently removed. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setBookingToDelete(null)}
                  disabled={isDeleting}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteBooking}
                  disabled={isDeleting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:from-rose-700 hover:to-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "Deleting…" : "Delete booking"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
