import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TicketsPage } from "@/components/tickets/tickets-page";

export default function TicketsRoute() {
  return (
    <DashboardShell>
      <TicketsPage />
    </DashboardShell>
  );
}
