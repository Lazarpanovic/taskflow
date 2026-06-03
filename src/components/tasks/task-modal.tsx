"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/types";

type TaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

const statuses: TaskStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "done",
];

function createTaskId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}`;
}

function formatStatusLabel(status: TaskStatus) {
  return status
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function TaskModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: TaskModalProps) {
  const isEditing = Boolean(task);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium",
  );
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [labels, setLabels] = useState(
    task?.labels.map((label) => label.name).join(", ") ?? "",
  );
  const [assigneeName, setAssigneeName] = useState(
    task?.assignee.name ?? "Lazar Panović",
  );
  const [assigneeInitials, setAssigneeInitials] = useState(
    task?.assignee.initials ?? "LP",
  );

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && description.trim().length > 0;
  }, [title, description]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const now = new Date().toISOString();

    const parsedLabels = labels
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label, index) => ({
        id: `${label.toLowerCase().replaceAll(" ", "-")}-${index}`,
        name: label,
        color: "blue",
      }));

    const nextTask: Task = {
      id: task?.id ?? createTaskId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
      labels: parsedLabels,
      assignee: {
        name: assigneeName.trim() || "Unassigned",
        initials: assigneeInitials.trim().toUpperCase() || "UA",
      },
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    };

    onSave(nextTask);
  };

  const handleDelete = () => {
    if (!task) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    onDelete(task.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {isEditing ? "Task Details" : "New Task"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
              {isEditing ? "Edit task" : "Add new task"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-96px)] space-y-5 overflow-y-auto px-6 py-6"
        >
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build task modal"
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the task..."
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item[0].toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {formatStatusLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Labels
            </label>
            <input
              value={labels}
              onChange={(event) => setLabels(event.target.value)}
              placeholder="Design, Feature, Bug"
              className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <p className="mt-2 text-xs text-slate-500">
              Separate labels with commas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Assignee name
              </label>
              <input
                value={assigneeName}
                onChange={(event) => setAssigneeName(event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Initials
              </label>
              <input
                value={assigneeInitials}
                onChange={(event) => setAssigneeInitials(event.target.value)}
                maxLength={3}
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
              >
                Delete task
              </button>
            ) : (
              <div />
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isEditing ? "Save changes" : "Create task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
