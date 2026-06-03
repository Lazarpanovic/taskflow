export function formatDate(date: string) {
  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getDueDateStatus(date: string) {
  if (!date) {
    return "none";
  }

  const today = new Date();
  const dueDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffInMs = dueDate.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) {
    return "overdue";
  }

  if (diffInDays <= 3) {
    return "due-soon";
  }

  return "normal";
}
