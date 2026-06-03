import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsPage } from "@/components/settings/settings-page";

export default function SettingsRoute() {
  return (
    <DashboardShell>
      <SettingsPage />
    </DashboardShell>
  );
}
