import DashboardShell from "@/src/components/dashboard/DashboardShell";
import AllLogsTable from "@/src/components/dashboard/Table/AllLogsTable";

export default function AdminLogsPage() {
  return (
    <DashboardShell
      activeItem="logs"
      eyebrow="Admin logs"
      title="Manage logs"
      description="Review and manage all system logs."
    >
      <AllLogsTable />
    </DashboardShell>
  );
}
