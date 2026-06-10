import AdminTable from "./AdminTable";
import { messages } from "./dashboard-data";

export default function MessagesView() {
  return (
    <div className="mt-8">
      <AdminTable
        title="Messages table"
        description="Support and host messages that need a response."
        columns={["Sender", "Subject", "Priority", "Status"]}
        rows={messages}
        statusKey="priority"
      />
    </div>
  );
}
