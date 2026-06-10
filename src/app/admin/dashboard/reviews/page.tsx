import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ReviewsView from "@/src/components/dashboard/ReviewsView";

export default function AdminReviewsPage() {
  return (
    <DashboardShell
      activeItem="reviews"
      eyebrow="Admin reviews"
      title="Manage reviews"
      description="Moderate guest feedback and listing review status."
    >
      <ReviewsView />
    </DashboardShell>
  );
}
