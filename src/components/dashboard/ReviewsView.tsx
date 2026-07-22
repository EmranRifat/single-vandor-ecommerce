import UserListTable from "./ManageUserList";
import AdminTable from "./ManageUserList";
import { reviews } from "./dashboard-data";

export default function ReviewsView() {
  return (
    <div className="mt-8">
      <UserListTable />
    </div>
  );
}
