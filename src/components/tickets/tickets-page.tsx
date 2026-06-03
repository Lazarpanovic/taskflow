"use client";

import { TaskCardPreview } from "@/components/tasks/task-card";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Task } from "@/types";

const TASKS_STORAGE_KEY = "taskflow-tasks";

function TicketSection({
  title,
  description,
  tasks,
}: {
  title: string;
  description: string;
  tasks: Task[];
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {tasks.length} {tasks.length === 1 ? "ticket" : "tickets"}
        </span>
      </div>

      {tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCardPreview key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
          No tickets in this section
        </div>
      )}
    </section>
  );
}

export function TicketsPage() {
  const [tasks, , isInitialized] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    demoTasks,
  );

  const currentSprintTasks = tasks.filter((task) => task.status !== "backlog");
  const backlogTasks = tasks.filter((task) => task.status === "backlog");

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        <div className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Sprint Planning
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Tickets
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Review tickets currently planned for the sprint and keep future work
          organized in the backlog.
        </p>
      </div>

      <TicketSection
        title="Current Sprint Tickets"
        description="Tasks that are actively planned, in progress, in review, or completed."
        tasks={currentSprintTasks}
      />

      <TicketSection
        title="Backlog Tickets"
        description="Ideas, requests, and future work that are not part of the active sprint yet."
        tasks={backlogTasks}
      />
    </div>
  );
}
