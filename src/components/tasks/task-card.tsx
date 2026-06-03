import { CalendarDays } from "lucide-react";
import type { Task, TaskPriority } from "@/types";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  task: Task;
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  urgent: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-sm transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-white">
          {task.title}
        </h3>

        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
            priorityClasses[task.priority],
          )}
        >
          {task.priority}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
        {task.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.labels.map((label) => (
          <span
            key={label.id}
            className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300"
          >
            {label.name}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="size-3.5" />
          <span>{task.dueDate}</span>
        </div>

        <div
          title={task.assignee.name}
          className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white"
        >
          {task.assignee.initials}
        </div>
      </div>
    </article>
  );
}
