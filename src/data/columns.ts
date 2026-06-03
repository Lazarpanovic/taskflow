import type { KanbanColumn } from "@/types/task";

export const kanbanColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Ideas and incoming tasks",
  },
  {
    id: "todo",
    title: "To Do",
    description: "Ready to be picked up",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Currently being worked on",
  },
  {
    id: "review",
    title: "Review",
    description: "Waiting for feedback",
  },
  {
    id: "done",
    title: "Done",
    description: "Completed tasks",
  },
];
