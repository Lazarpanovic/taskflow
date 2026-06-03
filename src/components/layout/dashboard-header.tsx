import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back, Lazar
          </p>
          <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            TaskFlow Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Bell className="size-4" />
          </button>

          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-800">
            LP
          </div>
        </div>
      </div>
    </header>
  );
}
