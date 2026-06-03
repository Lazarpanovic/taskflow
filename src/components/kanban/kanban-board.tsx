"use client";

import { useMemo, useState } from "react";
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
  visibleStatuses?: TaskStatus[];
};

function moveTaskBeforeTarget(
  tasks: Task[],
  activeTaskId: string,
  targetTaskId: string,
  nextStatus: TaskStatus,
) {
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  if (!activeTask) {
    return tasks;
  }

  const updatedActiveTask: Task = {
    ...activeTask,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  const withoutActiveTask = tasks.filter((task) => task.id !== activeTaskId);
  const targetIndex = withoutActiveTask.findIndex(
    (task) => task.id === targetTaskId,
  );

  if (targetIndex === -1) {
    return [...withoutActiveTask, updatedActiveTask];
  }

  return [
    ...withoutActiveTask.slice(0, targetIndex),
    updatedActiveTask,
    ...withoutActiveTask.slice(targetIndex),
  ];
}

function moveTaskToColumnEnd(
  tasks: Task[],
  activeTaskId: string,
  nextStatus: TaskStatus,
) {
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  if (!activeTask) {
    return tasks;
  }

  const updatedActiveTask: Task = {
    ...activeTask,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  const withoutActiveTask = tasks.filter((task) => task.id !== activeTaskId);

  const lastIndexInColumn = withoutActiveTask
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => task.status === nextStatus)
    .at(-1)?.index;

  if (lastIndexInColumn === undefined) {
    return [...withoutActiveTask, updatedActiveTask];
  }

  return [
    ...withoutActiveTask.slice(0, lastIndexInColumn + 1),
    updatedActiveTask,
    ...withoutActiveTask.slice(lastIndexInColumn + 1),
  ];
}

export function KanbanBoard({
  tasks,
  setTasks,
  onTaskClick,
  visibleStatuses,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const visibleColumns = useMemo(() => {
    if (!visibleStatuses) {
      return kanbanColumns;
    }

    return kanbanColumns.filter((column) =>
      visibleStatuses.includes(column.id),
    );
  }, [visibleStatuses]);

  const visibleColumnIds = useMemo(
    () => visibleColumns.map((column) => column.id),
    [visibleColumns],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const isVisibleTaskStatus = (value: unknown): value is TaskStatus => {
    return (
      typeof value === "string" &&
      visibleColumnIds.includes(value as TaskStatus)
    );
  };

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
    const overId = over.id.toString();

    if (activeTaskId === overId) {
      return;
    }

    const activeTask = tasks.find((task) => task.id === activeTaskId);

    if (!activeTask) {
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);

    if (overTask) {
      if (!visibleColumnIds.includes(overTask.status)) {
        return;
      }

      setTasks((currentTasks) =>
        moveTaskBeforeTarget(
          currentTasks,
          activeTaskId,
          overTask.id,
          overTask.status,
        ),
      );

      return;
    }

    if (!isVisibleTaskStatus(overId)) {
      return;
    }

    setTasks((currentTasks) =>
      moveTaskToColumnEnd(currentTasks, activeTaskId, overId),
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
          {visibleColumns.map((column) => {
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
