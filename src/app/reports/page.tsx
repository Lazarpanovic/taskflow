import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReportsPage } from "@/components/reports/reports-page";

export default function ReportsRoute() {
  return (
    <DashboardShell>
      <ReportsPage />
    </DashboardShell>
  );
}
