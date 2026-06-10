import DashboardShell from "@/src/components/dashboard/DashboardShell";
import UsersView from "@/src/components/dashboard/UsersView";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      activeItem="users"
      eyebrow="Admin users"
      title="Manage users"
      description="Review guest, host, and admin accounts."
    >
      <UsersView />
    </DashboardShell>
  );
}
