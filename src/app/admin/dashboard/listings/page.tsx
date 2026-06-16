import BookingsView from "@/src/components/dashboard/ListingsView";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ListingsView from "@/src/components/dashboard/ListingsView";

export default function AdminBookingsPage() {
  return (
    <DashboardShell
      activeItem="listings"
      eyebrow="Admin listings"
      title="Manage listings"
      description="Review and manage all product listings."
    >
      <ListingsView/>
    </DashboardShell>
  );
}
