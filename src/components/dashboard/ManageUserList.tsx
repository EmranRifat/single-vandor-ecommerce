"use client";

import { useGetAllUsers } from "@/lib/hooks/dashboard/useGetAllBooking";
import { Pagination } from "@heroui/react";
import { useState } from "react";
import { Select, Label, ListBox } from "@heroui/react";
import { useUpdateUserRole } from "@/lib/hooks/dashboard/useUpdateUserRole";

export default function UserTable() {
  const [roleModal, setRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const updateRoleMutation = useUpdateUserRole();

  const {
    data: userData,
    isLoading,
    isFetching,
    error,
    refetch,
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
      case "superadmin":
        return "bg-purple-100 text-purple-700";

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
                <th
                  key={column}
                  className="whitespace-nowrap px-5 py-4 font-semibold"
                >
                  {column}
                </th>
              ))}
              <th className="w-[220px] px-5 py-4 text-center">Action</th>{" "}
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
                <tr
                  key={user.id}
                  className="
            transition
            duration-200
            hover:bg-slate-50
          "
                >
                  {/* Number */}
                  <td className="px-5 py-4 font-medium text-slate-600">
                    {startIndex + index}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                  </td>

                  {/* Email */}
                  <td className="max-w-[220px] px-5 py-4">
                    <p className="truncate text-slate-600">{user.email}</p>
                  </td>

                  {/* User ID */}
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      #{user.id}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${getRoleStyle(user.role)}
              `}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className="
                rounded-full
                bg-emerald-100
                px-3
                py-1
                text-xs
                font-semibold
                text-emerald-700
              "
                    >
                      Active
                    </span>
                  </td>

                  {/* Action */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setSelectedRole(user.role);
                        setRoleModal(true);
                      }}
                      className="
                mr-2
                rounded-lg
                bg-emerald-100
                px-3
                py-2
                text-xs
                font-semibold
                text-emerald-700
                transition
                hover:bg-emerald-500
                hover:text-white
                hover:shadow-md
                active:scale-95
              "
                    >
                      Change Role
                    </button>

                    <button
                      disabled
                      className="
                rounded-lg
                bg-rose-100
                px-3
                py-2
                text-xs
                font-semibold
                text-rose-700
                transition
                hover:bg-rose-500
                hover:text-white
                hover:shadow-md
                active:scale-95
              "
                    >
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

      {roleModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => {
            setRoleModal(false);
            setSelectedUser(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Update User Role
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Change user permission level
                </p>
              </div>

              <button
                onClick={() => {
                  setRoleModal(false);
                  setSelectedUser(null);
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2">
              <div>
                <p className="font-semibold text-slate-800">
                  {selectedUser.name}
                </p>

                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>

              <span
                className={`
            rounded-full px-3 py-1 text-xs font-semibold
             ${getRoleStyle(selectedUser.role)}
          `}
              >
                {formatRole(selectedUser.role)}
              </span>
            </div>

            {/* Role Select */}
            <div className="mt-5">
              <Select
                className="w-full"
                selectedKey={selectedRole}
                onSelectionChange={(key) => setSelectedRole(key as string)}
              >
                <Label>Select New Role</Label>

                <Select.Trigger className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Select.Value>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                        selectedRole,
                      )}`}
                    >
                      {formatRole(selectedRole)}
                    </span>
                  </Select.Value>

                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="user" textValue="User">
                      User
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item id="host" textValue="Host">
                      Host
                      <ListBox.ItemIndicator />
                    </ListBox.Item>

                    <ListBox.Item id="admin" textValue="Admin">
                      Admin
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => {
                  setRoleModal(false);
                  setSelectedUser(null);
                }}
                className="
            rounded-xl
            bg-slate-100
            px-5
            py-2.5
            text-sm
            font-medium
            text-slate-700
            hover:bg-slate-200
          "
              >
                Cancel
              </button>

              <button
                disabled={updateRoleMutation.isPending}
                onClick={() => {
                  updateRoleMutation.mutate(
                    {
                      id: selectedUser.id,
                      role: selectedRole,
                    },
                    {
                      onSuccess: () => {
                        refetch();
                        setRoleModal(false);
                        setSelectedUser(null);
                      },
                    },
                  );
                }}
                className="
              rounded-lg
              bg-emerald-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              hover:bg-emerald-700
              disabled:opacity-50
              "
              >
                {updateRoleMutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
