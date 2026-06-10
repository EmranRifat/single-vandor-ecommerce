import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ListingsView from "@/src/components/dashboard/ListingsView";

export default function AdminListingsPage() {
  return (
    <DashboardShell
      activeItem="listings"
      eyebrow="Admin listings"
      title="Manage listings"
      description="Review listing status, hosts, categories, and nightly pricing."
      actionLabel="Add listing"
    >
      <ListingsView />
    </DashboardShell>
  );
}
