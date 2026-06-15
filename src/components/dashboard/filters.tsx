import React from "react";

type FiltersProps = {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  onReset: () => void;
  total: number;
  visible: number;
};

export default function Filters({
  searchTerm,
  statusFilter,
  typeFilter,
  setSearchTerm,
  setStatusFilter,
  setTypeFilter,
  onReset,
  total,
  visible,
}: FiltersProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="min-w-0">
            <span className="text-sm font-semibold text-slate-700">Search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, location, description"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="min-w-0">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="active">Active</option>
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-sm font-semibold text-slate-700">Type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All types</option>
              <option value="apartment">Apartment</option>
              <option value="room">Room</option>
              <option value="house">House</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {visible} of {total} listings
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
