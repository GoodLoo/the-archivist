export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  inStock: boolean;
  stock_quantity?: number;
  material?: string;
  scale?: string;
  edition?: string;
  weight?: string;
  height?: string;
  features?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock_quantity?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  featured: boolean;
}

export interface OrderStatus {
  orderNumber: string;
  status: "ordered" | "confirmed" | "shipped" | "out-for-delivery" | "delivered";
  currentStep: number;
  estimatedDelivery: string;
  items: { name: string; quantity: number }[];
  timeline: { label: string; date: string; completed: boolean }[];
}
