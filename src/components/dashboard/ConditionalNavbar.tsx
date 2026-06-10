"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/src/Navbar/navbar";

const dashboardPaths = ["/dashboard", "/admin/dashboard"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHideNavbar = dashboardPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}
