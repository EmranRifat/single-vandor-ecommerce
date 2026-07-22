"use client";

import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border bg-white p-8 text-center shadow">
          <h1 className="text-3xl font-bold text-red-600">401</h1>
          <p className="mt-2 text-gray-600">
            Please login to access this page.
          </p>
        </div>
      </div>
    );
  }

  const role = user.role;
  if (
    role != "admin" &&
    role != "Admin" &&
    role != "superadmin" &&
    role != "SuperAdmin"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-5xl font-bold text-red-600">403</h1>

          <h2 className="mt-4 text-2xl font-semibold">Access Denied</h2>

          <p className="mt-3 text-gray-600">
            Only <strong>Admin</strong> or <strong>SuperAdmin</strong> can
            access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
