"use client";

import { Pagination } from "@heroui/react";
import { useState } from "react";
import { useGetAllUsers } from "@/lib/hooks/dashboard/UseGetAllUsers";

export default function AdminTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const {
    data: userData,
    isLoading,
    isFetching,
    error,
  } = useGetAllUsers(currentPage, perPage);

  if (isLoading) {
    return (
      <section className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <p className="text-sm text-slate-500">Loading users...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error.message}</div>;
  }

  const data = userData?.data ?? [];
  const pagination = userData?.pagination;

  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, totalItems);

  const columns = ["#", "Name", "Email", "UserId", "Role", "Joined", "Status"];

  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-rose-100 text-rose-700";
      case "host":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-sky-100 text-sky-700";
    }
  };

  const formatRole = (role: string) =>
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-bold">Users Table</h3>
        <p className="mt-1 text-sm text-slate-500">
          Guest, host and admin accounts.
        </p>
      </div>

      <div className="relative overflow-x-auto">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
              <p className="text-sm font-medium text-slate-600">Loading...</p>
            </div>
          </div>
        )}

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4">
                  {column}
                </th>
              ))}
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              data.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-5 py-4">{startIndex + index}</td>

                  <td className="px-5 py-4">{user.name}</td>

                  <td className="px-5 py-4">{user.email}</td>

                  <td className="px-5 py-4">{user.id}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                        user.role,
                      )}`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                      Active
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button className="mr-2 rounded bg-emerald-100 px-3 py-2 text-xs">
                      Edit
                    </button>

                    <button className="rounded bg-rose-100 px-3 py-2 text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold">
              {startIndex}-{endIndex}
            </span>{" "}
            of <span className="font-semibold">{totalItems}</span> users
          </p>

          {totalPages > 1 && (
            <div className="flex items-center justify-center p-5">
              <Pagination>
                <Pagination.Content>
                  {/* Previous */}
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={currentPage === 1 || isFetching}
                      onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <Pagination.PreviousIcon />
                      <span>Previous</span>
                    </Pagination.Previous>
                  </Pagination.Item>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;

                    return (
                      <Pagination.Item key={page}>
                        <Pagination.Link
                          isActive={page === currentPage}
                          onPress={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Link>
                      </Pagination.Item>
                    );
                  })}

                  {/* Next */}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={currentPage === totalPages || isFetching}
                      onPress={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      <span>Next</span>
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
