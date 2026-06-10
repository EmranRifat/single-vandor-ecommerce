import DashboardShell from "@/src/components/dashboard/DashboardShell";
import SettingsView from "@/src/components/dashboard/SettingsView";

export default function AdminSettingsPage() {
  return (
    <DashboardShell
      activeItem="settings"
      eyebrow="Admin settings"
      title="Dashboard settings"
      description="Control review, verification, and notification preferences."
    >
      <SettingsView />
    </DashboardShell>
  );
}
