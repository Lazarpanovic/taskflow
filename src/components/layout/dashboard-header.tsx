import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Welcome back, Lazar</p>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            TaskFlow Dashboard
          </h1>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex size-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:text-white">
            <Bell className="size-4" />
          </button>

          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-white">
            LP
          </div>
        </div>
      </div>

      <div className="mt-4 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>
      </div>
    </header>
  );
}
