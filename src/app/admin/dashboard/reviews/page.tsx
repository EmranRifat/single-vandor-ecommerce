import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ReviewTable from "@/src/components/dashboard/ReviewTable";

export default function AdminReviewsPage() {
  return (
    <DashboardShell
      activeItem="reviews"
      eyebrow="Admin reviews"
      title="Manage reviews"
      description="Moderate guest feedback and listing review status."
    >
      <ReviewTable />
    </DashboardShell>
  );
}
