import AdminTable from "./AdminTable";
import { users } from "./dashboard-data";

export default function UsersView() {
  return (
    <div className="mt-8">
      <AdminTable
        title="Users table"
        description="Guest, host, and admin accounts."
        columns={["Name", "Email", "Role", "Joined", "Status"]}
        rows={users}
      />
    </div>
  );
}
