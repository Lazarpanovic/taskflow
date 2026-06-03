"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { kanbanColumns } from "@/data/columns";
import type { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { TaskCardPreview } from "@/components/tasks/task-card";

type SetTasks = (value: Task[] | ((tasks: Task[]) => Task[])) => void;

type KanbanBoardProps = {
  tasks: Task[];
  setTasks: SetTasks;
  onTaskClick: (task: Task) => void;
};

const columnIds = kanbanColumns.map((column) => column.id);

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && columnIds.includes(value as TaskStatus);
}

export function KanbanBoard({
  tasks,
  setTasks,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeTaskId = event.active.id.toString();
    const task = tasks.find((item) => item.id === activeTaskId);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeTaskId = active.id.toString();
    const overColumnId = over.id.toString();

    if (!isTaskStatus(overColumnId)) {
      return;
    }

    const activeTask = tasks.find((task) => task.id === activeTaskId);

    if (!activeTask) {
      return;
    }

    if (activeTask.status === overColumnId) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === activeTaskId
          ? {
              ...task,
              status: overColumnId,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <section className="-mx-4 mt-6 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-4">
          {kanbanColumns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id,
            );

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskClick={onTaskClick}
              />
            );
          })}
        </div>
      </section>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCardPreview task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
