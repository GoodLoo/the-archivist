export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  address: string;
  phone: string;
  notes?: string;
  timeline: { status: string; date: string; note: string }[];
}

export const adminOrders: AdminOrder[] = [
  {
    id: "ARC-2026-0742",
    customer: "James Mitchell",
    email: "james.m@example.com",
    items: [
      { name: "Iron Man Mark III", quantity: 1, price: 249.99 },
      { name: "Darth Vader", quantity: 1, price: 299.99 },
    ],
    subtotal: 549.98,
    shipping: 0,
    total: 593.98,
    status: "shipped",
    date: "2026-07-10",
    address: "124 Maple Street, Apt 4B, New York, NY 10001, United States",
    phone: "+1 (555) 123-4567",
    timeline: [
      { status: "pending", date: "2026-07-10 09:15", note: "Order placed" },
      { status: "confirmed", date: "2026-07-10 09:22", note: "Payment confirmed" },
      { status: "processing", date: "2026-07-11 14:30", note: "Items picked and packed" },
      { status: "shipped", date: "2026-07-14 08:00", note: "Shipped via UPS Ground" },
    ],
  },
  {
    id: "ARC-2026-0741",
    customer: "Sarah Chen",
    email: "sarah.chen@example.com",
    items: [
      { name: "Batman (The Dark Knight)", quantity: 1, price: 269.99 },
      { name: "Gojo Satoru", quantity: 2, price: 279.99 },
      { name: "Master Chief", quantity: 1, price: 289.99 },
    ],
    subtotal: 1119.96,
    shipping: 0,
    total: 1209.56,
    status: "processing",
    date: "2026-07-12",
    address: "456 Oak Avenue, Los Angeles, CA 90001, United States",
    phone: "+1 (555) 987-6543",
    notes: "Leave at front door. Ring doorbell once.",
    timeline: [
      { status: "pending", date: "2026-07-12 14:20", note: "Order placed" },
      { status: "confirmed", date: "2026-07-12 14:25", note: "Payment confirmed" },
      { status: "processing", date: "2026-07-13 10:00", note: "Items being prepared" },
    ],
  },
  {
    id: "ARC-2026-0740",
    customer: "Marcus Webb",
    email: "mwebb@example.com",
    items: [
      { name: "Wonder Woman", quantity: 1, price: 249.99 },
    ],
    subtotal: 249.99,
    shipping: 15.99,
    total: 285.98,
    status: "delivered",
    date: "2026-07-08",
    address: "789 Pine Road, Austin, TX 73301, United States",
    phone: "+1 (555) 456-7890",
    timeline: [
      { status: "pending", date: "2026-07-08 11:00", note: "Order placed" },
      { status: "confirmed", date: "2026-07-08 11:05", note: "Payment confirmed" },
      { status: "processing", date: "2026-07-09 09:30", note: "Items picked" },
      { status: "shipped", date: "2026-07-10 16:00", note: "Shipped via USPS Priority" },
      { status: "delivered", date: "2026-07-14 14:22", note: "Delivered. Left at mailbox." },
    ],
  },
  {
    id: "ARC-2026-0739",
    customer: "Yuki Tanaka",
    email: "yuki.t@example.com",
    items: [
      { name: "Goku Ultra Instinct", quantity: 1, price: 269.99 },
      { name: "Naruto (Sage Mode)", quantity: 1, price: 229.99 },
      { name: "Gojo Satoru", quantity: 1, price: 279.99 },
      { name: "Mikasa Ackerman", quantity: 1, price: 239.99 },
    ],
    subtotal: 1019.96,
    shipping: 0,
    total: 1101.56,
    status: "confirmed",
    date: "2026-07-15",
    address: "2-15-6 Shibuya, Shibuya-ku, Tokyo 150-0002, Japan",
    phone: "+81 80-1234-5678",
    timeline: [
      { status: "pending", date: "2026-07-15 08:30", note: "Order placed" },
      { status: "confirmed", date: "2026-07-15 08:35", note: "Payment confirmed. Awaiting processing." },
    ],
  },
  {
    id: "ARC-2026-0738",
    customer: "Alex Rodriguez",
    email: "alex.r@example.com",
    items: [
      { name: "Kratos (God of War)", quantity: 1, price: 309.99 },
    ],
    subtotal: 309.99,
    shipping: 15.99,
    total: 350.98,
    status: "pending",
    date: "2026-07-16",
    address: "321 Cedar Lane, Miami, FL 33101, United States",
    phone: "+1 (555) 321-0987",
    notes: "Gift wrapping requested.",
    timeline: [
      { status: "pending", date: "2026-07-16 19:45", note: "Order placed. Awaiting payment confirmation." },
    ],
  },
  {
    id: "ARC-2026-0737",
    customer: "Emma Watson",
    email: "emma.w@example.com",
    items: [
      { name: "Harry Potter (Hogwarts)", quantity: 1, price: 199.99 },
      { name: "Dumbledore", quantity: 1, price: 239.99 },
      { name: "Hedwig", quantity: 1, price: 149.99 },
    ],
    subtotal: 589.97,
    shipping: 0,
    total: 637.17,
    status: "shipped",
    date: "2026-07-09",
    address: "15 Kings Road, London SW3 4EP, United Kingdom",
    phone: "+44 20 7946 0123",
    timeline: [
      { status: "pending", date: "2026-07-09 12:00", note: "Order placed" },
      { status: "confirmed", date: "2026-07-09 12:05", note: "Payment confirmed" },
      { status: "processing", date: "2026-07-10 11:00", note: "Items packed" },
      { status: "shipped", date: "2026-07-12 09:00", note: "Shipped via Royal Mail Tracked" },
    ],
  },
  {
    id: "ARC-2026-0736",
    customer: "David Park",
    email: "david.p@example.com",
    items: [
      { name: "Celestial Sentinel", quantity: 1, price: 399.99 },
      { name: "Void Reaper", quantity: 1, price: 379.99 },
    ],
    subtotal: 779.98,
    shipping: 0,
    total: 842.38,
    status: "cancelled",
    date: "2026-07-05",
    address: "100 Tech Park Drive, San Francisco, CA 94105, United States",
    phone: "+1 (555) 789-0123",
    notes: "Customer requested cancellation due to shipping delay.",
    timeline: [
      { status: "pending", date: "2026-07-05 10:00", note: "Order placed" },
      { status: "confirmed", date: "2026-07-05 10:05", note: "Payment confirmed" },
      { status: "cancelled", date: "2026-07-06 14:00", note: "Cancelled per customer request. Refund issued." },
    ],
  },
  {
    id: "ARC-2026-0735",
    customer: "Lara Thompson",
    email: "lara.t@example.com",
    items: [
      { name: "Lara Croft", quantity: 1, price: 239.99 },
      { name: "Indiana Jones", quantity: 1, price: 239.99 },
    ],
    subtotal: 479.98,
    shipping: 15.99,
    total: 534.38,
    status: "delivered",
    date: "2026-07-01",
    address: "555 Explorer Drive, Seattle, WA 98101, United States",
    phone: "+1 (555) 234-5678",
    timeline: [
      { status: "pending", date: "2026-07-01 15:30", note: "Order placed" },
      { status: "confirmed", date: "2026-07-01 15:35", note: "Payment confirmed" },
      { status: "processing", date: "2026-07-02 10:00", note: "Items picked" },
      { status: "shipped", date: "2026-07-03 12:00", note: "Shipped via FedEx 2-Day" },
      { status: "delivered", date: "2026-07-06 11:15", note: "Delivered. Signed by reception." },
    ],
  },
  {
    id: "ARC-2026-0734",
    customer: "Oliver Black",
    email: "oliver.b@example.com",
    items: [
      { name: "The Joker", quantity: 1, price: 229.99 },
      { name: "Darkseid", quantity: 1, price: 349.99 },
      { name: "Batman (The Dark Knight)", quantity: 1, price: 269.99 },
    ],
    subtotal: 849.97,
    shipping: 0,
    total: 917.97,
    status: "processing",
    date: "2026-07-14",
    address: "777 Gotham Avenue, Chicago, IL 60601, United States",
    phone: "+1 (555) 876-5432",
    timeline: [
      { status: "pending", date: "2026-07-14 16:00", note: "Order placed" },
      { status: "confirmed", date: "2026-07-14 16:05", note: "Payment confirmed" },
      { status: "processing", date: "2026-07-15 09:00", note: "Items being packed" },
    ],
  },
  {
    id: "ARC-2026-0733",
    customer: "Sophie Martin",
    email: "sophie.m@example.com",
    items: [
      { name: "R2-D2", quantity: 1, price: 189.99 },
      { name: "Yoda", quantity: 1, price: 199.99 },
    ],
    subtotal: 389.98,
    shipping: 15.99,
    total: 437.18,
    status: "pending",
    date: "2026-07-17",
    address: "23 Rue de la Paix, Paris 75001, France",
    phone: "+33 1 23 45 67 89",
    notes: "Apartment 3, code 1234#",
    timeline: [
      { status: "pending", date: "2026-07-17 10:30", note: "Order placed. Awaiting payment." },
    ],
  },
];

export const orderStats = {
  total: adminOrders.length,
  pending: adminOrders.filter((o) => o.status === "pending").length,
  processing: adminOrders.filter((o) => o.status === "processing" || o.status === "confirmed").length,
  shipped: adminOrders.filter((o) => o.status === "shipped").length,
  delivered: adminOrders.filter((o) => o.status === "delivered").length,
  cancelled: adminOrders.filter((o) => o.status === "cancelled").length,
  revenue: adminOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0),
};
