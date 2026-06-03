"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";

export function DashboardHeader() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Welcome back, Lazar
              </p>
              <h1 className="truncate text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                TaskFlow Dashboard
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white">
              <Bell className="size-4" />
            </button>

            <div className="hidden size-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-800 sm:flex">
              LP
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </>
  );
}
