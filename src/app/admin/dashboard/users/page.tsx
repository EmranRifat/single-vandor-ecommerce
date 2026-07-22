import UserListTable from "@/src/components/dashboard/ManageUserList";
import DashboardShell from "@/src/components/dashboard/DashboardShell";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      activeItem="users"
      eyebrow="Admin users"
      title="Manage users"
      description="Review guest, host, and admin accounts."
    >
      <UserListTable />
    </DashboardShell>
  );
}
