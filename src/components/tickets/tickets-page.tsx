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
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { formatDate, getDueDateStatus } from "@/lib/date";
import type { Task, TaskPriority, TaskStatus } from "@/types";

const TASKS_STORAGE_KEY = "taskflow-tasks";

const CURRENT_SPRINT_DROP_ZONE_ID = "current-sprint-drop-zone";
const BACKLOG_DROP_ZONE_ID = "backlog-drop-zone";

type TicketSectionVariant = "sprint" | "backlog";

type TicketSectionProps = {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  variant: TicketSectionVariant;
  onMoveToSprint: (taskId: string) => void;
  onMoveToBacklog: (taskId: string) => void;
  onMoveToTop: (taskId: string, variant: TicketSectionVariant) => void;
  onMoveToBottom: (taskId: string, variant: TicketSectionVariant) => void;
};

type TicketRowProps = {
  task: Task;
  variant: TicketSectionVariant;
  onMoveToSprint: (taskId: string) => void;
  onMoveToBacklog: (taskId: string) => void;
  onMoveToTop: (taskId: string, variant: TicketSectionVariant) => void;
  onMoveToBottom: (taskId: string, variant: TicketSectionVariant) => void;
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  medium:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-300",
  urgent: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300",
};

const statusClasses: Record<TaskStatus, string> = {
  backlog: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  todo: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  "in-progress": "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  review: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
};

const dueDateClasses = {
  none: "text-slate-400 dark:text-slate-500",
  normal: "text-slate-500 dark:text-slate-400",
  "due-soon":
    "rounded-full bg-amber-500/10 px-2 py-1 text-amber-600 dark:text-amber-300",
  overdue:
    "rounded-full bg-rose-500/10 px-2 py-1 text-rose-600 dark:text-rose-300",
};

function formatStatusLabel(status: TaskStatus) {
  return status
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function getSectionStatus(variant: TicketSectionVariant): TaskStatus {
  return variant === "backlog" ? "backlog" : "todo";
}

function getTaskVariant(task: Task): TicketSectionVariant {
  return task.status === "backlog" ? "backlog" : "sprint";
}

function isTaskInVariant(task: Task, variant: TicketSectionVariant) {
  if (variant === "backlog") {
    return task.status === "backlog";
  }

  return task.status !== "backlog";
}

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

function moveTaskToSectionEnd(
  tasks: Task[],
  activeTaskId: string,
  variant: TicketSectionVariant,
) {
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  if (!activeTask) {
    return tasks;
  }

  const nextStatus = getSectionStatus(variant);
  const updatedActiveTask: Task = {
    ...activeTask,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  const withoutActiveTask = tasks.filter((task) => task.id !== activeTaskId);

  const lastIndexInSection = withoutActiveTask
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => isTaskInVariant(task, variant))
    .at(-1)?.index;

  if (lastIndexInSection === undefined) {
    return [...withoutActiveTask, updatedActiveTask];
  }

  return [
    ...withoutActiveTask.slice(0, lastIndexInSection + 1),
    updatedActiveTask,
    ...withoutActiveTask.slice(lastIndexInSection + 1),
  ];
}

function moveTaskToSectionTop(
  tasks: Task[],
  taskId: string,
  variant: TicketSectionVariant,
) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return tasks;
  }

  const nextStatus = getSectionStatus(variant);
  const updatedTask: Task = {
    ...task,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  const withoutTask = tasks.filter((item) => item.id !== taskId);
  const firstIndexInSection = withoutTask.findIndex((item) =>
    isTaskInVariant(item, variant),
  );

  if (firstIndexInSection === -1) {
    return [updatedTask, ...withoutTask];
  }

  return [
    ...withoutTask.slice(0, firstIndexInSection),
    updatedTask,
    ...withoutTask.slice(firstIndexInSection),
  ];
}

function TicketRowPreview({ task }: { task: Task }) {
  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-950 dark:text-white">
              {task.title}
            </h3>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
                statusClasses[task.status],
              )}
            >
              {formatStatusLabel(task.status)}
            </span>

            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
                priorityClasses[task.priority],
              )}
            >
              {task.priority}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="size-3.5 text-slate-400 dark:text-slate-500" />
            <span className={dueDateClasses[dueDateStatus]}>
              {formatDate(task.dueDate)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {task.labels.slice(0, 3).map((label) => (
              <span
                key={label.id}
                className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {label.name}
              </span>
            ))}
          </div>

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

function TicketRow({
  task,
  variant,
  onMoveToSprint,
  onMoveToBacklog,
  onMoveToTop,
  onMoveToBottom,
}: TicketRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      type: "ticket",
      task,
    },
  });

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: task.id,
    data: {
      type: "ticket",
      task,
    },
  });

  const setNodeRef = (node: HTMLDivElement | null) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative touch-none will-change-transform",
        isMenuOpen ? "z-50" : "z-0",
        isDragging && "opacity-30",
        isOver && !isDragging && "rounded-2xl ring-2 ring-blue-400",
      )}
    >
      <div
        className="relative flex cursor-grab flex-col gap-2 rounded-2xl border border-transparent transition hover:border-slate-200 active:cursor-grabbing dark:hover:border-slate-800 sm:flex-row sm:items-center"
        {...listeners}
        {...attributes}
      >
        <div className="min-w-0 flex-1">
          <TicketRowPreview task={task} />
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen((current) => !current);
            }}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <MoreHorizontal className="size-5" />
          </button>

          {isMenuOpen ? (
            <div
              className={cn(
                "absolute right-0 z-[999] w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950",
                variant === "sprint" ? "top-12" : "bottom-12",
              )}
            >
              {variant === "backlog" ? (
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMoveToSprint(task.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  Move to sprint
                </button>
              ) : (
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMoveToBacklog(task.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  Move to backlog
                </button>
              )}

              <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />

              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onMoveToTop(task.id, variant);
                  setIsMenuOpen(false);
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                Move to top
              </button>

              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onMoveToBottom(task.id, variant);
                  setIsMenuOpen(false);
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                Move to bottom
              </button>
            </div>
          ) : null}
        </div>
      </div>
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
  onMoveToBacklog,
  onMoveToTop,
  onMoveToBottom,
}: TicketSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "overflow-visible rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/70",
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

      <div
        className={cn(
          "mb-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center text-sm text-slate-500 transition dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400",
          isOver &&
            "border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-300",
        )}
      >
        {variant === "sprint"
          ? "Drop tickets here to move them into the current sprint."
          : "Drop tickets here to move them back to backlog."}
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TicketRow
              key={task.id}
              task={task}
              variant={variant}
              onMoveToSprint={onMoveToSprint}
              onMoveToBacklog={onMoveToBacklog}
              onMoveToTop={onMoveToTop}
              onMoveToBottom={onMoveToBottom}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
          {variant === "sprint"
            ? "No tickets in the current sprint yet."
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
        distance: 8,
      },
    }),
  );

  const currentSprintTasks = tasks.filter((task) => task.status !== "backlog");
  const backlogTasks = tasks.filter((task) => task.status === "backlog");

  const moveTaskToSprint = (taskId: string) => {
    setTasks((currentTasks) =>
      moveTaskToSectionEnd(currentTasks, taskId, "sprint"),
    );
  };

  const moveTaskToBacklog = (taskId: string) => {
    setTasks((currentTasks) =>
      moveTaskToSectionEnd(currentTasks, taskId, "backlog"),
    );
  };

  const moveTaskToTop = (taskId: string, variant: TicketSectionVariant) => {
    setTasks((currentTasks) =>
      moveTaskToSectionTop(currentTasks, taskId, variant),
    );
  };

  const moveTaskToBottom = (taskId: string, variant: TicketSectionVariant) => {
    setTasks((currentTasks) =>
      moveTaskToSectionEnd(currentTasks, taskId, variant),
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

    if (activeTaskId === overId) {
      return;
    }

    const activeTask = tasks.find((task) => task.id === activeTaskId);

    if (!activeTask) {
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);

    if (overTask) {
      const targetVariant = getTaskVariant(overTask);
      const nextStatus = getSectionStatus(targetVariant);

      setTasks((currentTasks) =>
        moveTaskBeforeTarget(
          currentTasks,
          activeTaskId,
          overTask.id,
          nextStatus,
        ),
      );

      return;
    }

    if (overId === CURRENT_SPRINT_DROP_ZONE_ID) {
      moveTaskToSprint(activeTaskId);
      return;
    }

    if (overId === BACKLOG_DROP_ZONE_ID) {
      moveTaskToBacklog(activeTaskId);
    }
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
            Review active sprint tickets and move future work between the sprint
            and backlog with drag and drop.
          </p>
        </div>

        <TicketSection
          id={CURRENT_SPRINT_DROP_ZONE_ID}
          title="Current Sprint Tickets"
          description="Tasks that are actively planned, in progress, in review, or completed."
          tasks={currentSprintTasks}
          variant="sprint"
          onMoveToSprint={moveTaskToSprint}
          onMoveToBacklog={moveTaskToBacklog}
          onMoveToTop={moveTaskToTop}
          onMoveToBottom={moveTaskToBottom}
        />

        <TicketSection
          id={BACKLOG_DROP_ZONE_ID}
          title="Backlog Tickets"
          description="Ideas, requests, and future work that are not part of the active sprint yet."
          tasks={backlogTasks}
          variant="backlog"
          onMoveToSprint={moveTaskToSprint}
          onMoveToBacklog={moveTaskToBacklog}
          onMoveToTop={moveTaskToTop}
          onMoveToBottom={moveTaskToBottom}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-[min(760px,90vw)] rotate-1">
            <TicketRowPreview task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
