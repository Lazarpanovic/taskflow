import type { Task } from "@/types/task";

export const demoTasks: Task[] = [
  {
    id: "task-1",
    title: "Design dashboard layout",
    description:
      "Create a responsive SaaS-style dashboard layout with sidebar, header, board area, and statistics cards.",
    status: "todo",
    priority: "high",
    dueDate: "2026-06-10",
    labels: [
      {
        id: "label-design",
        name: "Design",
        color: "violet",
      },
      {
        id: "label-ui",
        name: "UI",
        color: "blue",
      },
    ],
    assignee: {
      name: "Lazar Panović",
      initials: "LP",
    },
    createdAt: "2026-06-03T10:00:00.000Z",
    updatedAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Implement Kanban columns",
    description:
      "Render Backlog, To Do, In Progress, Review, and Done columns using reusable components.",
    status: "in-progress",
    priority: "urgent",
    dueDate: "2026-06-12",
    labels: [
      {
        id: "label-feature",
        name: "Feature",
        color: "emerald",
      },
    ],
    assignee: {
      name: "Lazar Panović",
      initials: "LP",
    },
    createdAt: "2026-06-03T11:00:00.000Z",
    updatedAt: "2026-06-03T11:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Add localStorage persistence",
    description:
      "Persist tasks in the browser so board changes remain after page refresh.",
    status: "backlog",
    priority: "medium",
    dueDate: "2026-06-15",
    labels: [
      {
        id: "label-storage",
        name: "Storage",
        color: "amber",
      },
    ],
    assignee: {
      name: "Lazar Panović",
      initials: "LP",
    },
    createdAt: "2026-06-03T12:00:00.000Z",
    updatedAt: "2026-06-03T12:00:00.000Z",
  },
  {
    id: "task-4",
    title: "Build task details modal",
    description:
      "Create a modal where users can view and edit title, description, priority, due date, labels, and assignee.",
    status: "review",
    priority: "high",
    dueDate: "2026-06-18",
    labels: [
      {
        id: "label-modal",
        name: "Modal",
        color: "rose",
      },
      {
        id: "label-crud",
        name: "CRUD",
        color: "cyan",
      },
    ],
    assignee: {
      name: "Lazar Panović",
      initials: "LP",
    },
    createdAt: "2026-06-03T13:00:00.000Z",
    updatedAt: "2026-06-03T13:00:00.000Z",
  },
  {
    id: "task-5",
    title: "Prepare portfolio README",
    description:
      "Write a polished README with project overview, features, tech stack, screenshots, and deployment link.",
    status: "done",
    priority: "low",
    dueDate: "2026-06-20",
    labels: [
      {
        id: "label-docs",
        name: "Docs",
        color: "slate",
      },
    ],
    assignee: {
      name: "Lazar Panović",
      initials: "LP",
    },
    createdAt: "2026-06-03T14:00:00.000Z",
    updatedAt: "2026-06-03T14:00:00.000Z",
  },
];
