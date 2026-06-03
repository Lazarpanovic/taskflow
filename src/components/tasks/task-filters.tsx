"use client";

import { Search, X } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/types";

type TaskFiltersProps = {
  searchQuery: string;
  selectedPriority: TaskPriority | "all";
  selectedStatus: TaskStatus | "all";
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onStatusChange: (value: TaskStatus | "all") => void;
  onClearFilters: () => void;
};

const priorities: Array<TaskPriority | "all"> = [
  "all",
  "low",
  "medium",
  "high",
  "urgent",
];

const statuses: Array<TaskStatus | "all"> = [
  "all",
  "backlog",
  "todo",
  "in-progress",
  "review",
  "done",
];

function formatOptionLabel(value: string) {
  if (value === "all") {
    return "All";
  }

  return value
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function TaskFilters({
  searchQuery,
  selectedPriority,
  selectedStatus,
  onSearchChange,
  onPriorityChange,
  onStatusChange,
  onClearFilters,
}: TaskFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedPriority !== "all" ||
    selectedStatus !== "all";

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, description, label, or assignee..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(event) =>
            onPriorityChange(event.target.value as TaskPriority | "all")
          }
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              Priority: {formatOptionLabel(priority)}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(event) =>
            onStatusChange(event.target.value as TaskStatus | "all")
          }
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              Status: {formatOptionLabel(status)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
        >
          <X className="size-4" />
          Clear
        </button>
      </div>
    </section>
  );
}
