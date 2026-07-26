export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joined: string;
  status: "active" | "inactive";
}

export const adminCustomers: AdminCustomer[] = [
  { id: "C-001", name: "James Mitchell", email: "james.m@example.com", phone: "+1 (555) 123-4567", orders: 3, totalSpent: 1247.94, joined: "2026-01-15", status: "active" },
  { id: "C-002", name: "Sarah Chen", email: "sarah.chen@example.com", phone: "+1 (555) 987-6543", orders: 2, totalSpent: 1829.55, joined: "2026-03-22", status: "active" },
  { id: "C-003", name: "Marcus Webb", email: "mwebb@example.com", phone: "+1 (555) 456-7890", orders: 5, totalSpent: 2156.80, joined: "2025-11-01", status: "active" },
  { id: "C-004", name: "Yuki Tanaka", email: "yuki.t@example.com", phone: "+81 80-1234-5678", orders: 1, totalSpent: 1101.56, joined: "2026-07-15", status: "active" },
  { id: "C-005", name: "Alex Rodriguez", email: "alex.r@example.com", phone: "+1 (555) 321-0987", orders: 1, totalSpent: 350.98, joined: "2026-07-16", status: "active" },
  { id: "C-006", name: "Emma Watson", email: "emma.w@example.com", phone: "+44 20 7946 0123", orders: 4, totalSpent: 2891.45, joined: "2025-09-12", status: "active" },
  { id: "C-007", name: "David Park", email: "david.p@example.com", phone: "+1 (555) 789-0123", orders: 2, totalSpent: 1684.76, joined: "2026-04-05", status: "inactive" },
  { id: "C-008", name: "Lara Thompson", email: "lara.t@example.com", phone: "+1 (555) 234-5678", orders: 3, totalSpent: 987.45, joined: "2026-02-18", status: "active" },
  { id: "C-009", name: "Oliver Black", email: "oliver.b@example.com", phone: "+1 (555) 876-5432", orders: 1, totalSpent: 917.97, joined: "2026-07-14", status: "active" },
  { id: "C-010", name: "Sophie Martin", email: "sophie.m@example.com", phone: "+33 1 23 45 67 89", orders: 2, totalSpent: 674.36, joined: "2026-05-20", status: "active" },
  { id: "C-011", name: "Daniel Kim", email: "daniel.k@example.com", phone: "+1 (555) 111-2222", orders: 0, totalSpent: 0, joined: "2026-07-18", status: "inactive" },
  { id: "C-012", name: "Priya Sharma", email: "priya.s@example.com", phone: "+91 98765 43210", orders: 1, totalSpent: 437.18, joined: "2026-06-30", status: "active" },
];

export const customerStats = {
  total: adminCustomers.length,
  active: adminCustomers.filter((c) => c.status === "active").length,
  totalRevenue: adminCustomers.reduce((s, c) => s + c.totalSpent, 0),
  newThisMonth: adminCustomers.filter((c) => c.joined >= "2026-07-01").length,
};
