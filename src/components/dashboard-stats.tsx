import { CheckCircle2, Clock3, Flame, ListTodo } from "lucide-react";
import type { Task } from "@/types";

type DashboardStatsProps = {
  tasks: Task[];
};

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const urgentTasks = tasks.filter((task) => task.priority === "urgent").length;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock3,
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
    },
    {
      label: "Urgent",
      value: urgentTasks,
      icon: Flame,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
                  {stat.value}
                </p>
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
