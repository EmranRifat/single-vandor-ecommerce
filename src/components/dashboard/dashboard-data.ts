export const stats = [
  {
    label: "Total Revenue",
    value: "$24,820",
    change: "+12.4%",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Active Listings",
    value: "128",
    change: "+8 new",
    accent: "bg-sky-50 text-sky-700",
  },
  {
    label: "Pending Bookings",
    value: "34",
    change: "6 today",
    accent: "bg-amber-50 text-amber-700",
  },
  {
    label: "Verified Hosts",
    value: "72",
    change: "+5.1%",
    accent: "bg-violet-50 text-violet-700",
  },
];

export const bookings = [
  {
    guest: "Sarah Ahmed",
    property: "Lake View Apartment",
    date: "Jun 12, 2026",
    status: "Confirmed",
  },
  {
    guest: "Tanvir Hasan",
    property: "City Center Room",
    date: "Jun 14, 2026",
    status: "Pending",
  },
  {
    guest: "Nadia Islam",
    property: "Family Stay Hotel",
    date: "Jun 18, 2026",
    status: "Confirmed",
  },
];


export const listings = [
  {
    title: "Lake View Apartment",
    host: "Rahim Uddin",
    category: "Apartment",
    price: "$85/night",
    status: "Published",
  },
  {
    title: "City Center Room",
    host: "Nadia Islam",
    category: "Room",
    price: "$42/night",
    status: "Pending",
  },
  {
    title: "Family Stay Hotel",
    host: "Tanvir Hasan",
    category: "Hotel",
    price: "$110/night",
    status: "Published",
  },
  {
    title: "Cox's Bazar Beach Stay",
    host: "Samira Khan",
    category: "Apartment",
    price: "$96/night",
    status: "Draft",
  },
];

export const users = [
  {
    name: "Sarah Ahmed",
    email: "sarah@example.com",
    role: "Guest",
    joined: "Jun 02, 2026",
    status: "Active",
  },
  {
    name: "Rahim Uddin",
    email: "rahim@example.com",
    role: "Host",
    joined: "May 28, 2026",
    status: "Verified",
  },
  {
    name: "Nadia Islam",
    email: "nadia@example.com",
    role: "Host",
    joined: "May 19, 2026",
    status: "Pending",
  },
  {
    name: "Admin User",
    email: "admin@staynest.com",
    role: "Admin",
    joined: "Apr 11, 2026",
    status: "Active",
  },
];

export const pendingTasks = [
  "Review 9 newly submitted host listings",
  "Approve 3 refund requests",
  "Reply to 5 guest support messages",
];

export const reviews = [
  {
    guest: "Sarah Ahmed",
    listing: "Lake View Apartment",
    rating: "5.0",
    status: "Published",
  },
  {
    guest: "Nadia Islam",
    listing: "Family Stay Hotel",
    rating: "4.8",
    status: "Pending",
  },
];

export const messages = [
  {
    sender: "Tanvir Hasan",
    subject: "Booking date change",
    priority: "High",
    status: "Open",
  },
  {
    sender: "Rahim Uddin",
    subject: "Listing verification",
    priority: "Normal",
    status: "Pending",
  },
];
