"use client";

import { DashboardStats } from "@/components/dashboard-stats";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Task } from "@/types";

const TASKS_STORAGE_KEY = "taskflow-tasks";

export function TaskBoard() {
  const [tasks, setTasks, isInitialized] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    demoTasks,
  );

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all tasks to demo data?",
    );

    if (!confirmed) {
      return;
    }

    setTasks(demoTasks);
  };

  const moveFirstTaskToDone = () => {
    setTasks((currentTasks) =>
      currentTasks.map((task, index) =>
        index === 0
          ? {
              ...task,
              status: "done",
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>

        <div className="h-[560px] animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Project Management
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Kanban Board
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Plan, prioritize, and track your work across a clean drag-and-drop
            workflow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetDemoData}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Reset demo data
          </button>

          <button
            type="button"
            onClick={moveFirstTaskToDone}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Move first to done
          </button>

          <button
            type="button"
            className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Add task
          </button>
        </div>
      </div>

      <DashboardStats tasks={tasks} />

      <KanbanBoard tasks={tasks} />
    </>
  );
}
