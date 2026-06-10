import AdminTable from "./AdminTable";
import { reviews } from "./dashboard-data";

export default function ReviewsView() {
  return (
    <div className="mt-8">
      <AdminTable
        title="Reviews table"
        description="Guest feedback waiting for review."
        columns={["Guest", "Listing", "Rating", "Status"]}
        rows={reviews}
      />
    </div>
  );
}
