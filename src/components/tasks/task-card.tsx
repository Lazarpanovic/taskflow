"use client";

import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { CalendarDays, GripVertical } from "lucide-react";
import type { Task, TaskPriority } from "@/types";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
};

type TaskCardPreviewProps = {
  task: Task;
  isOverlay?: boolean;
  dragHandle?: React.ReactNode;
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  medium:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-300",
  urgent: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300",
};

export function TaskCardPreview({
  task,
  isOverlay = false,
  dragHandle,
}: TaskCardPreviewProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-950",
        isOverlay
          ? "w-[280px] rotate-2 cursor-grabbing border-blue-300 shadow-2xl dark:border-blue-500"
          : "hover:border-slate-300 dark:hover:border-slate-700",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-slate-950 dark:text-white">
          {task.title}
        </h3>

        {dragHandle}
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {task.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.labels.map((label) => (
          <span
            key={label.id}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {label.name}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <CalendarDays className="size-3.5" />
          <span>{task.dueDate || "No due date"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
              priorityClasses[task.priority],
            )}
          >
            {task.priority}
          </span>

          <div
            title={task.assignee.name}
            className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white"
          >
            {task.assignee.initials}
          </div>
        </div>
      </div>
    </article>
  );
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const dragHandle = (
    <button
      type="button"
      className="shrink-0 cursor-grab rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing dark:hover:bg-slate-800 dark:hover:text-slate-300"
      aria-label={`Drag ${task.title}`}
      onClick={(event) => event.stopPropagation()}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none will-change-transform",
        isDragging && "opacity-30",
      )}
    >
      <button type="button" onClick={onClick} className="block w-full">
        <TaskCardPreview task={task} dragHandle={dragHandle} />
      </button>
    </div>
  );
}
