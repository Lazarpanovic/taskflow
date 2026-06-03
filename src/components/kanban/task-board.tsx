"use client";

import { useMemo, useState } from "react";
import { DashboardStats } from "@/components/dashboard-stats";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskModal } from "@/components/tasks/task-modal";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Task, TaskPriority, TaskStatus } from "@/types";

const TASKS_STORAGE_KEY = "taskflow-tasks";

const CURRENT_SPRINT_STATUSES: TaskStatus[] = [
  "todo",
  "in-progress",
  "review",
  "done",
];

export function TaskBoard() {
  const [tasks, setTasks, isInitialized] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    demoTasks,
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<
    TaskPriority | "all"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">(
    "all",
  );

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => CURRENT_SPRINT_STATUSES.includes(task.status))
      .filter((task) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          task.title.toLowerCase().includes(normalizedSearch) ||
          task.description.toLowerCase().includes(normalizedSearch) ||
          task.assignee.name.toLowerCase().includes(normalizedSearch) ||
          task.assignee.initials.toLowerCase().includes(normalizedSearch) ||
          task.labels.some((label) =>
            label.name.toLowerCase().includes(normalizedSearch),
          );

        const matchesPriority =
          selectedPriority === "all" || task.priority === selectedPriority;

        const matchesStatus =
          selectedStatus === "all" || task.status === selectedStatus;

        return matchesSearch && matchesPriority && matchesStatus;
      });
  }, [tasks, searchQuery, selectedPriority, selectedStatus]);

  const openCreateTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };

  const saveTask = (task: Task) => {
    setTasks((currentTasks) => {
      const taskExists = currentTasks.some((item) => item.id === task.id);

      if (taskExists) {
        return currentTasks.map((item) => (item.id === task.id ? task : item));
      }

      return [task, ...currentTasks];
    });

    closeTaskModal();
  };

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );

    closeTaskModal();
  };

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all tasks to demo data?",
    );

    if (!confirmed) {
      return;
    }

    setTasks(demoTasks);
    clearFilters();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPriority("all");
    setSelectedStatus("all");
  };

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>

        <div className="h-[560px] animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Project Management
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Current Sprint Board
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Track active sprint work across a focused drag-and-drop workflow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetDemoData}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Reset demo data
          </button>

          <button
            type="button"
            onClick={openCreateTaskModal}
            className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Add task
          </button>
        </div>
      </div>

      <DashboardStats tasks={filteredTasks} />

      <TaskFilters
        searchQuery={searchQuery}
        selectedPriority={selectedPriority}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchQuery}
        onPriorityChange={setSelectedPriority}
        onStatusChange={setSelectedStatus}
        onClearFilters={clearFilters}
      />

      {filteredTasks.length > 0 ? (
        <KanbanBoard
          tasks={filteredTasks}
          setTasks={setTasks}
          onTaskClick={openEditTaskModal}
          visibleStatuses={CURRENT_SPRINT_STATUSES}
        />
      ) : (
        <div className="mt-6 flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">
            No matching tasks
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Try changing your search query or clearing the active filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Clear filters
          </button>
        </div>
      )}

      {isTaskModalOpen ? (
        <TaskModal
          key={selectedTask?.id ?? "new-task"}
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          onSave={saveTask}
          onDelete={deleteTask}
        />
      ) : null}
    </>
  );
}
