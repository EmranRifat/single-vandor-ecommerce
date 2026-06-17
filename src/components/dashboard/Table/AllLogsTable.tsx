"use client";

import { useMemo, useState } from "react";
import { useGetAllLogs } from "@/lib/hooks/dashboard/useGetAllLogs";
import AllLogsFilter from "./AllLogsFilter";

const formatDate = (value?: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getMethodClass = (method: string) => {
  const normalized = method.toUpperCase();

  if (normalized === "GET") return "bg-sky-50 text-sky-700";
  if (normalized === "POST") return "bg-emerald-50 text-emerald-700";
  if (normalized === "PATCH" || normalized === "PUT") {
    return "bg-amber-50 text-amber-700";
  }
  if (normalized === "DELETE") return "bg-rose-50 text-rose-700";

  return "bg-slate-50 text-slate-700";
};

const getStatusClass = (statusCode: number, isError: boolean) => {
  if (isError || statusCode >= 400) return "bg-rose-50 text-rose-700";
  if (statusCode >= 300) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
};

const getResultStatusClass = (status?: string, isError?: boolean) => {
  const normalized = status?.toLowerCase();

  if (normalized === "success") return "bg-emerald-50 text-emerald-700";
  if (normalized === "error" || isError) return "bg-rose-50 text-rose-700";

  return "bg-slate-100 text-slate-700";
};

const AllLogsTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetAllLogs({
      page,
      limit,
    });

  const logs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const methodOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.method).filter(Boolean))),
    [logs],
  );
  const operationOptions = useMemo(
    () =>
      Array.from(new Set(logs.map((log) => log.operation).filter(Boolean))),
    [logs],
  );
  const filteredLogs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !search ||
        [
          log.id,
          log.method,
          log.operation,
          log.path,
          log.query,
          log.statusCode,
          log.status,
          log.message,
          log.ipAddress,
          log.userEmail,
          log.userId,
          log.errorType,
          log.errorMessage,
        ].some((value) =>
          value?.toString().toLowerCase().includes(search),
        );

      const matchesMethod =
        methodFilter === "all" || log.method === methodFilter;

      const matchesOperation =
        operationFilter === "all" || log.operation === operationFilter;

      const matchesResult =
        resultFilter === "all" ||
        (resultFilter === "success" && !log.isError && log.statusCode < 400) ||
        (resultFilter === "error" && (log.isError || log.statusCode >= 400));

      return (
        matchesSearch && matchesMethod && matchesOperation && matchesResult
      );
    });
  }, [logs, methodFilter, operationFilter, resultFilter, searchTerm]);

  const resetFilters = () => {
    setSearchTerm("");
    setMethodFilter("all");
    setOperationFilter("all");
    setResultFilter("all");
  };

  return (
    <div className="mt-8 space-y-4">
      <AllLogsFilter
        searchTerm={searchTerm}
        methodFilter={methodFilter}
        operationFilter={operationFilter}
        resultFilter={resultFilter}
        methodOptions={methodOptions}
        operationOptions={operationOptions}
        visible={filteredLogs.length}
        total={logs.length}
        isFetching={isFetching}
        setSearchTerm={setSearchTerm}
        setMethodFilter={setMethodFilter}
        setOperationFilter={setOperationFilter}
        setResultFilter={setResultFilter}
        onRefresh={() => refetch()}
        onReset={resetFilters}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">API logs</h2>
          <p className="text-sm text-slate-500">
            Latest backend request logs from the admin API.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows</span>
          <select
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-700">Loading API logs...</p>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-rose-600">
            {error?.message || "Failed to load API logs."}
          </p>
        </div>
      )}

      {!isLoading && !isError && logs.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">No API logs found.</p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        logs.length > 0 &&
        filteredLogs.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              No API logs match the selected filters.
            </p>
          </div>
        )}

      {!isLoading && !isError && filteredLogs.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-280 w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-900 text-xs uppercase text-white">
                <tr>
                  <th className="w-14 px-3 py-2">#</th>
                  <th className="px-3 py-2">Request</th>
                  <th className="px-3 py-2">Message</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Status Code</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Network</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className="align-top transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-2 font-mono font-semibold text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-[11px] text-slate-400">
                          #{log.id}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${getMethodClass(
                                log.method,
                              )}`}
                            >
                              {log.method}
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                              {log.operation || "-"}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-[11px] font-semibold text-slate-900">
                            {log.path || "-"}
                          </p>
                          <p className="line-clamp-1 max-w-xl break-words font-mono text-[11px] text-slate-500">
                            {log.query || "No query"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <p className="line-clamp-1 max-w-xs break-words">
                        {log.message || "-"}
                      </p>
                      <p className="line-clamp-1 max-w-xs break-words text-rose-600">
                        {log.errorMessage || log.errorType || ""}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${getResultStatusClass(
                          log.status,
                          log.isError,
                        )}`}
                      >
                        {log.status || (log.isError ? "Error" : "Success")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${getStatusClass(
                          log.statusCode,
                          log.isError,
                        )}`}
                      >
                        {log.statusCode || "-"}
                      </span>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {log.latencyMs} ms
                      </p>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <p className="font-medium text-slate-900">
                        {log.userEmail || "Guest"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {log.userId ? `User #${log.userId}` : "No user id"}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <p className="font-mono text-[11px] text-slate-700">
                        {log.ipAddress || "-"}
                      </p>
                      <p
                        className="line-clamp-1 max-w-xs break-words text-[11px] text-slate-400"
                        title={log.userAgent}
                      >
                        {log.userAgent || "-"}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && !isError && total > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm md:flex-row md:items-center md:justify-between">
          <p>
            Showing {filteredLogs.length} filtered rows from {logs.length} loaded
            rows. Total {total}
            {isFetching ? " - Refreshing..." : ""}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllLogsTable;
