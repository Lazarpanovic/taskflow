import type { ReactNode } from "react";
import { DashboardHeader } from "./dashboard-header";
import { Sidebar } from "./sidebar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <DashboardHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
