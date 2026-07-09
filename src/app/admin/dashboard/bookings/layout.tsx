import { Locale, getDictionary } from "@/dictionaries/dictionaty";

import NavBar from "@/src/components/Navbar";
import DashboardShell from "@/src/components/dashboard/DashboardShell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side hooks available for future auth/i18n logic
  // const dict = await getDictionary((await params).lang as Locale);

  return (
    <>
      {/* <NavBar /> */}
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
