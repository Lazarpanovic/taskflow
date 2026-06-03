"use client";

import { MonitorCog, Moon, RotateCcw, Settings, Sun } from "lucide-react";
import { demoTasks } from "@/data/tasks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "@/providers/theme-provider";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

const TASKS_STORAGE_KEY = "taskflow-tasks";

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    demoTasks,
  );

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all TaskFlow demo data?",
    );

    if (!confirmed) {
      return;
    }

    setTasks(demoTasks);
  };

  const settings = [
    {
      label: "Light",
      value: "light" as const,
      icon: Sun,
      description: "Clean SaaS-style light dashboard.",
    },
    {
      label: "Dark",
      value: "dark" as const,
      icon: Moon,
      description: "Low-light dashboard experience.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Preferences
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Manage your TaskFlow appearance, local demo data, and portfolio
          project preferences.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SettingsCard
          title="Appearance"
          description="Choose how TaskFlow should look on this device. The setting is saved in localStorage."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {settings.map((item) => {
              const Icon = item.icon;
              const isActive = theme === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTheme(item.value)}
                  className={cn(
                    "rounded-3xl border p-4 text-left transition",
                    isActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700",
                  )}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl",
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
                      )}
                    >
                      <Icon className="size-5" />
                    </div>

                    {isActive ? (
                      <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <p className="font-semibold text-slate-950 dark:text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </SettingsCard>

        <SettingsCard
          title="Demo Data"
          description="TaskFlow is a frontend portfolio project, so all tasks are stored locally in the browser."
        >
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                <MonitorCog className="size-5" />
              </div>

              <div>
                <p className="font-semibold text-slate-950 dark:text-white">
                  Local browser storage
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  You currently have {tasks.length} tasks stored on this device.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetDemoData}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <RotateCcw className="size-4" />
              Reset demo data
            </button>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Project Info"
        description="Portfolio-ready technical summary for TaskFlow."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "Next.js App Router",
            "TypeScript",
            "Tailwind CSS",
            "dnd-kit",
            "localStorage",
            "Responsive UI",
            "Light/Dark Mode",
            "Kanban Workflow",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
