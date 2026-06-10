import DashboardShell from "@/src/components/dashboard/DashboardShell";
import OverviewDashboard from "@/src/components/dashboard/OverviewDashboard";

export default function DashboardPage() {
  return (
    <DashboardShell
      activeItem="overview"
      eyebrow="StayNest admin"
      title="Welcome back, Admin"
      description="Monitor bookings, listings, revenue, and host activity from one simple workspace."
      actionLabel="Add listing"
    >
      <OverviewDashboard />
    </DashboardShell>
  );
}
