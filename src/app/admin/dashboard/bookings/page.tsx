import BookingsView from "@/src/components/dashboard/BookingsView";
import DashboardShell from "@/src/components/dashboard/DashboardShell";

export default function AdminBookingsPage() {
  return (
    <DashboardShell
      activeItem="bookings"
      eyebrow="Admin bookings"
      title="Manage bookings"
      description="Track reservations, guest details, and booking statuses."
    >
      <BookingsView />
    </DashboardShell>
  );
}
