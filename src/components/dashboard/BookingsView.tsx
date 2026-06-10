import AdminTable from "./AdminTable";
import { bookings } from "./dashboard-data";

export default function BookingsView() {
  return (
    <div className="mt-8">
      <AdminTable
        title="Bookings table"
        description="Reservations that need admin visibility."
        columns={["Guest", "Property", "Date", "Status"]}
        rows={bookings}
      />
    </div>
  );
}
