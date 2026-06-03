export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskLabel = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  labels: TaskLabel[];
  assignee: {
    name: string;
    initials: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type KanbanColumn = {
  id: TaskStatus;
  title: string;
  description: string;
};
