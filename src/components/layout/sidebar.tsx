import { BarChart3, CheckSquare, FolderKanban, Settings } from "lucide-react";

const navigationItems = [
  {
    label: "Board",
    icon: FolderKanban,
    isActive: true,
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    isActive: false,
  },
  {
    label: "Reports",
    icon: BarChart3,
    isActive: false,
  },
  {
    label: "Settings",
    icon: Settings,
    isActive: false,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white lg:block">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-500 text-sm font-bold text-white">
            TF
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">TaskFlow</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Project dashboard
            </p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={
                  item.isActive
                    ? "flex w-full items-center gap-3 rounded-2xl bg-blue-500 px-4 py-3 text-left text-sm font-medium text-white"
                    : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">
          Portfolio Project
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Built with Next.js, TypeScript, Tailwind CSS, dnd-kit and
          localStorage.
        </p>
      </div>
    </aside>
  );
}
