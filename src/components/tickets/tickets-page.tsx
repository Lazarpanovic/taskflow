"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowRightCircle } from "lucide-react";
import { TaskCardPreview } from "@/components/tasks/task-card";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const TASKS_STORAGE_KEY = "taskflow-tasks";

const CURRENT_SPRINT_DROP_ZONE_ID = "current-sprint-drop-zone";

type TicketSectionProps = {
  id?: string;
  title: string;
  description: string;
  tasks: Task[];
  variant: "sprint" | "backlog";
  onMoveToSprint?: (taskId: string) => void;
};

type DraggableTicketCardProps = {
  task: Task;
  variant: "sprint" | "backlog";
  onMoveToSprint?: (taskId: string) => void;
};

function DraggableTicketCard({
  task,
  variant,
  onMoveToSprint,
}: DraggableTicketCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        type: "ticket",
        task,
      },
      disabled: variant !== "backlog",
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        variant === "backlog" && "touch-none will-change-transform",
        isDragging && "opacity-30",
      )}
    >
      <div
        className={cn(
          variant === "backlog" && "cursor-grab active:cursor-grabbing",
        )}
        {...(variant === "backlog" ? listeners : {})}
        {...(variant === "backlog" ? attributes : {})}
      >
        <TaskCardPreview task={task} />
      </div>

      {variant === "backlog" && onMoveToSprint ? (
        <button
          type="button"
          onClick={() => onMoveToSprint(task.id)}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          <ArrowRightCircle className="size-4" />
          Move to Sprint
        </button>
      ) : null}
    </div>
  );
}

function TicketSection({
  id,
  title,
  description,
  tasks,
  variant,
  onMoveToSprint,
}: TicketSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id ?? title,
    disabled: variant !== "sprint",
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/70",
        variant === "sprint" &&
          isOver &&
          "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20",
      )}
    >
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

      {variant === "sprint" ? (
        <div
          className={cn(
            "mb-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500 transition dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400",
            isOver &&
              "border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-300",
          )}
        >
          Drop backlog tickets here to move them into the current sprint.
        </div>
      ) : null}

      {tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <DraggableTicketCard
              key={task.id}
              task={task}
              variant={variant}
              onMoveToSprint={onMoveToSprint}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300 px-4 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
          {variant === "sprint"
            ? "No tickets in the current sprint yet. Drop backlog tickets here."
            : "No backlog tickets right now."}
        </div>
      )}
    </section>
  );
}

export function TicketsPage() {
  const [tasks, setTasks, isInitialized] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    demoTasks,
  );

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const currentSprintTasks = tasks.filter((task) => task.status !== "backlog");
  const backlogTasks = tasks.filter((task) => task.status === "backlog");

  const moveTaskToSprint = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "todo",
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id.toString();
    const task = tasks.find((item) => item.id === taskId);

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

    if (overId !== CURRENT_SPRINT_DROP_ZONE_ID) {
      return;
    }

    const draggedTask = tasks.find((task) => task.id === activeTaskId);

    if (!draggedTask || draggedTask.status !== "backlog") {
      return;
    }

    moveTaskToSprint(activeTaskId);
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        <div className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
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
          id={CURRENT_SPRINT_DROP_ZONE_ID}
          title="Current Sprint Tickets"
          description="Tasks that are actively planned, in progress, in review, or completed."
          tasks={currentSprintTasks}
          variant="sprint"
        />

        <TicketSection
          title="Backlog Tickets"
          description="Ideas, requests, and future work that are not part of the active sprint yet."
          tasks={backlogTasks}
          variant="backlog"
          onMoveToSprint={moveTaskToSprint}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCardPreview task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
