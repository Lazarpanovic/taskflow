"use client";

import { useDroppable } from "@dnd-kit/core";
import type { KanbanColumn as KanbanColumnType, Task } from "@/types";
import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/tasks/task-card";

type KanbanColumnProps = {
  column: KanbanColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
};

export function KanbanColumn({
  column,
  tasks,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex max-h-[720px] min-h-[480px] min-w-[300px] flex-1 flex-col rounded-3xl border border-slate-200 bg-slate-100/80 transition dark:border-slate-800 dark:bg-slate-900/70",
        isOver &&
          "border-blue-400 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-950/20",
      )}
    >
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">
              {column.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {column.description}
            </p>
          </div>

          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        ) : (
          <div className="flex h-32 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}
