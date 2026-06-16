import {
  BedDouble,
  CalendarCheck,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    key: "host_listings",
    label: "Host Listings",
    icon: BedDouble,
    href: "/admin/dashboard/host_listings",
  },
  {
    key: "listings",
    label: " Listings",
    icon: CalendarCheck,
    href: "/admin/dashboard/listings",
  },
   {
    key: "bookings",
    label: "Bookings",
    icon: CalendarCheck,
    href: "/admin/dashboard/bookings",
  },
  {
    key: "users",
    label: "Users",
    icon: Users,
    href: "/admin/dashboard/users",
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: Star,
    href: "/admin/dashboard/reviews",
  },
 
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    href: "/admin/dashboard/settings",
  },
];

type DashboardSidebarProps = {
  activeItem: string;
};

export default function DashboardSidebar({
  activeItem,
}: DashboardSidebarProps) {
  return (
    <aside className="border-b border-slate-200 bg-white px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Admin panel</p>
          <h1 className="text-xl font-bold tracking-normal">Dashboard</h1>
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeItem;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
