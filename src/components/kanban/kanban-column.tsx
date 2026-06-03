import type { KanbanColumn as KanbanColumnType, Task } from "@/types";
import { TaskCard } from "@/components/tasks/task-card";

type KanbanColumnProps = {
  column: KanbanColumnType;
  tasks: Task[];
};

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  return (
    <section className="flex max-h-[720px] min-h-[480px] min-w-[280px] flex-1 flex-col rounded-3xl border border-slate-800 bg-slate-900/70">
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-white">{column.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{column.description}</p>
          </div>

          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="flex h-32 items-center justify-center rounded-3xl border border-dashed border-slate-800 text-sm text-slate-500">
            No tasks here
          </div>
        )}
      </div>
    </section>
  );
}
