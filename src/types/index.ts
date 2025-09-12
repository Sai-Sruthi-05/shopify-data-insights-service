export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
  tenantId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  tenantId: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
  tenantId: string;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productPerformance: ProductPerformance[];
  salesTrend: SalesData[];
  orderStatusDistribution: StatusDistribution[];
  topCustomers: TopCustomer[];
  ordersByDate: OrdersByDate[];
  revenueByDate: RevenueByDate[];
}

export interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  units: number;
  growth: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  totalOrders: number;
  avatar: string;
}

export interface OrdersByDate {
  date: string;
  orders: number;
}

export interface RevenueByDate {
  date: string;
  revenue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst';
  avatar: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: TenantSettings;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface TenantSettings {
  theme: string;
  currency: string;
  timezone: string;
  features: string[];
}

export type CustomEventType = 'cart_abandoned' | 'checkout_started' | 'product_viewed' | 'user_registered' | 'data_sync_completed';

export interface CustomEvent {
  id: string;
  eventType: CustomEventType;
  userId?: string | null;
  sessionId: string;
  data: Record<string, any>;
  timestamp: string;
  tenantId: string;
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ShopifyWebhookData {
  id: string;
  type: 'customer' | 'order' | 'product';
  data: any;
  tenantId: string;
  timestamp: string;
}