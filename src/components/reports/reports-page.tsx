"use client";

import {
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  Flame,
  Layers3,
} from "lucide-react";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Task, TaskPriority, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

const TASKS_STORAGE_KEY = "taskflow-tasks";

const statuses: TaskStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "done",
];

const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

const statusLabels: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const progressClasses = {
  backlog: "bg-slate-400",
  todo: "bg-blue-500",
  "in-progress": "bg-violet-500",
  review: "bg-amber-500",
  done: "bg-emerald-500",
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  urgent: "bg-rose-500",
};

function getPercentage(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function ReportMetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof BarChart3;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
          <Icon className="size-5" />
        </div>
      </div>
    </article>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  colorClass,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}) {
  const percentage = getPercentage(value, total);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {value} · {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn("h-full rounded-full", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ReportsPage() {
  const [tasks, , isInitialized] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    demoTasks,
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const sprintTasks = tasks.filter((task) => task.status !== "backlog").length;
  const urgentTasks = tasks.filter((task) => task.priority === "urgent").length;
  const completionRate = getPercentage(completedTasks, totalTasks);

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Analytics
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Reports
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Track sprint progress, workload distribution, task priorities, and
          delivery status based on your current local TaskFlow data.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportMetricCard
          label="Total Tasks"
          value={totalTasks}
          description="All tasks across sprint and backlog."
          icon={Layers3}
        />

        <ReportMetricCard
          label="Current Sprint"
          value={sprintTasks}
          description="Tasks currently planned outside backlog."
          icon={Clock3}
        />

        <ReportMetricCard
          label="Completed"
          value={`${completionRate}%`}
          description={`${completedTasks} tasks marked as done.`}
          icon={CheckCircle2}
        />

        <ReportMetricCard
          label="Urgent"
          value={urgentTasks}
          description="Tasks that need the fastest attention."
          icon={Flame}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <BarChart3 className="size-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">
                Status Breakdown
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Distribution of tasks by workflow status.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {statuses.map((status) => {
              const value = tasks.filter(
                (task) => task.status === status,
              ).length;

              return (
                <BreakdownRow
                  key={status}
                  label={statusLabels[status]}
                  value={value}
                  total={totalTasks}
                  colorClass={progressClasses[status]}
                />
              );
            })}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <CircleDot className="size-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">
                Priority Breakdown
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Overview of workload urgency and priority.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {priorities.map((priority) => {
              const value = tasks.filter(
                (task) => task.priority === priority,
              ).length;

              return (
                <BreakdownRow
                  key={priority}
                  label={priorityLabels[priority]}
                  value={value}
                  total={totalTasks}
                  colorClass={progressClasses[priority]}
                />
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}
