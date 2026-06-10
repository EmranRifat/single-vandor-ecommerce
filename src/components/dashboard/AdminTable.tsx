import { ReactNode } from "react";

type AdminTableProps = {
  title: string;
  description: string;
  columns: string[];
  rows: Array<Record<string, string | ReactNode>>;
  statusKey?: string;
};

function getStatusClass(status: string) {
  if (["Published", "Active", "Verified", "Confirmed", "Open"].includes(status)) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (["Pending", "Draft", "High"].includes(status)) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function AdminTable({
  title,
  description,
  columns,
  rows,
  statusKey = "status",
}: AdminTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <h3 className="text-lg font-bold tracking-normal">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          className="hidden h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
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
            {rows.map((row) => {
              const rowKey =
                typeof row.id === "string" ? row.id : Object.values(row).join("-");

              return (
                <tr key={rowKey}>
                  {columns.map((column) => {
                    const key = column === "#" ? "index" : column.toLowerCase();
                    const value = row[key] ?? "";
                    const isStatus = key === statusKey;

                    return (
                      <td
                        key={`${rowKey}-${column}`}
                        className="px-5 py-4 text-slate-600"
                      >
                        {isStatus && typeof value === "string" ? (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(value)}`}
                          >
                            {value}
                          </span>
                        ) : typeof value === "string" ? (
                          <span
                            className={
                              column === columns[0]
                                ? "font-semibold text-slate-900"
                                : ""
                            }
                          >
                            {key === "id" && value.length > 20
                              ? `${value.slice(0, 20)}...`
                              : value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                      aria-label={rowKey ? `Manage listing ${rowKey}` : "Manage listing"}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
