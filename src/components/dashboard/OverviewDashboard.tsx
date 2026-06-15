import {
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  Home,
  ShieldCheck,
} from "lucide-react";
// import AdminTable from "./AdminTable";
import { bookings, listings, pendingTasks, stats, users } from "./dashboard-data";

const statIcons = [CircleDollarSign, Home, ClipboardList, ShieldCheck];

export default function OverviewDashboard() {
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index];

          return (
            <article
              key={stat.label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-normal">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                {stat.change}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h3 className="text-lg font-bold tracking-normal">
                Recent bookings
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Latest guest reservations awaiting admin attention.
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Guest</th>
                  <th className="px-5 py-4">Property</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={`${booking.guest}-${booking.property}`}>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {booking.guest}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {booking.property}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {booking.date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          booking.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold tracking-normal">Admin tasks</h3>
          <p className="mt-1 text-sm text-slate-500">
            Items that need review before the day ends.
          </p>

          <div className="mt-5 space-y-3">
            {pendingTasks.map((task, index) => (
              <div
                key={task}
                className="flex gap-3 rounded-lg border border-slate-200 p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                  {index + 1}
                </span>
                <p className="text-sm font-medium leading-6 text-slate-700">
                  {task}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
{/* 
      <div className="mt-6 grid gap-6">
        <AdminTable
          title="Listings"
          description="Manage properties submitted by hosts."
          columns={["Title", "Host", "Category", "Price", "Status"]}
          rows={listings}
        />

        <AdminTable
          title="Users"
          description="Review guest, host, and admin accounts."
          columns={["Name", "Email", "Role", "Joined", "Status"]}
          rows={users}
        />
      </div> */}
    </>
  );
}
