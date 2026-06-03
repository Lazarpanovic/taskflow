import { kanbanColumns } from "@/data/columns";
import type { Task } from "@/types";
import { KanbanColumn } from "./kanban-column";

type KanbanBoardProps = {
  tasks: Task[];
};

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  return (
    <section className="mt-6 overflow-x-auto pb-4">
      <div className="flex gap-4">
        {kanbanColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <KanbanColumn key={column.id} column={column} tasks={columnTasks} />
          );
        })}
      </div>
    </section>
  );
}
