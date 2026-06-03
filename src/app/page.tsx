import { TaskBoard } from "@/components/kanban/task-board";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function Home() {
  return (
    <DashboardShell>
      <TaskBoard />
    </DashboardShell>
  );
}
