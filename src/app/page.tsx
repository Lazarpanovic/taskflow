import { DashboardStats } from "@/components/dashboard-stats";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { demoTasks } from "@/data/tasks";

export default function Home() {
  return (
    <DashboardShell>
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-blue-400">
            Project Management
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Kanban Board
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Plan, prioritize, and track your work across a clean drag-and-drop
            workflow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white">
            Reset demo data
          </button>

          <button className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400">
            Add task
          </button>
        </div>
      </div>

      <DashboardStats tasks={demoTasks} />

      <KanbanBoard tasks={demoTasks} />
    </DashboardShell>
  );
}
