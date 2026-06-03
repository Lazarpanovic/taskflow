"use client";

import { X } from "lucide-react";
import { navigationItems } from "@/data/navigation";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <aside className="relative flex h-full w-[min(320px,85vw)] flex-col border-r border-slate-200 bg-white px-5 py-6 text-slate-950 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-white">
        <div className="flex items-center justify-between gap-4">
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

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={onClose}
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

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            TaskFlow MVP
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Responsive Kanban dashboard for portfolio presentation.
          </p>
        </div>
      </aside>
    </div>
  );
}
