"use client";

import { Dispatch, SetStateAction } from "react";
import { RefreshCw } from "lucide-react";

type AllLogsFilterProps = {
  searchTerm: string;
  methodFilter: string;
  operationFilter: string;
  resultFilter: string;
  methodOptions: string[];
  operationOptions: string[];
  visible: number;
  total: number;
  isFetching: boolean;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setMethodFilter: Dispatch<SetStateAction<string>>;
  setOperationFilter: Dispatch<SetStateAction<string>>;
  setResultFilter: Dispatch<SetStateAction<string>>;
  onRefresh: () => void;
  onReset: () => void;
};

export default function AllLogsFilter({
  searchTerm,
  methodFilter,
  operationFilter,
  resultFilter,
  methodOptions,
  operationOptions,
  visible,
  total,
  isFetching,
  setSearchTerm,
  setMethodFilter,
  setOperationFilter,
  setResultFilter,
  onRefresh,
  onReset,
}: AllLogsFilterProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="min-w-0">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Path, user, IP, status"
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="min-w-0">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Method
            </span>
            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All methods</option>
              {methodOptions.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Operation
            </span>
            <select
              value={operationFilter}
              onChange={(event) => setOperationFilter(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All operations</option>
              {operationOptions.map((operation) => (
                <option key={operation} value={operation}>
                  {operation}
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Result
            </span>
            <select
              value={resultFilter}
              onChange={(event) => setResultFilter(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All results</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500">
            {visible} of {total} shown
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
