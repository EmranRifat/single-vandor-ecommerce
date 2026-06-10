import DashboardShell from "@/src/components/dashboard/DashboardShell";
import MessagesView from "@/src/components/dashboard/MessagesView";

export default function AdminMessagesPage() {
  return (
    <DashboardShell
      activeItem="messages"
      eyebrow="Admin messages"
      title="Manage messages"
      description="Review support messages and host communication."
    >
      <MessagesView />
    </DashboardShell>
  );
}
