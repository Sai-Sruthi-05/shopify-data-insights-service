import { supabase } from './supabase';
import { Product, Order, Customer, CustomEvent, CustomEventType } from '../types';

export class ApiService {
  private static getCurrentTenantId(): string {
    return localStorage.getItem('tenantId') || 'default-tenant';
  }

  static async getProducts(): Promise<Product[]> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapProductFromDb);
  }

  static async createProduct(product: Omit<Product, 'id' | 'tenantId'>): Promise<Product> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...this.mapProductToDb(product),
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapProductFromDb(data);
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('products')
      .update(this.mapProductToDb(updates))
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw error;
    return this.mapProductFromDb(data);
  }

  static async deleteProduct(id: string): Promise<void> {
    const tenantId = this.getCurrentTenantId();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) throw error;
  }

  static async getCustomers(): Promise<Customer[]> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('total_spent', { ascending: false });

    if (error) throw error;
    return data.map(this.mapCustomerFromDb);
  }

  static async getTopCustomers(limit: number = 5): Promise<Customer[]> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('total_spent', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(this.mapCustomerFromDb);
  }

  static async getOrders(): Promise<Order[]> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('order_date', { ascending: false });

    if (error) throw error;
    return data.map(this.mapOrderFromDb);
  }

  static async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const tenantId = this.getCurrentTenantId();
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw error;
    return this.mapOrderFromDb(data);
  }

  static async trackEvent(event: Omit<CustomEvent, 'id' | 'tenantId' | 'timestamp'>): Promise<void> {
    const tenantId = this.getCurrentTenantId();
    const { error } = await supabase
      .from('custom_events')
      .insert({
        event_type: event.eventType,
        user_id: event.userId || null,
        session_id: event.sessionId,
        data: event.data,
        tenant_id: tenantId,
        timestamp: new Date().toISOString(),
      });

    if (error) throw error;
  }

  static async getCustomEvents(eventType?: CustomEventType): Promise<CustomEvent[]> {
    const tenantId = this.getCurrentTenantId();
    let query = supabase
      .from('custom_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('timestamp', { ascending: false });

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      eventType: item.event_type as CustomEventType,
      userId: item.user_id,
      sessionId: item.session_id,
      data: item.data,
      timestamp: item.timestamp,
      tenantId: item.tenant_id,
    }));
  }

  static async getAnalytics(): Promise<any> {
    const tenantId = this.getCurrentTenantId();
    
    const [products, orders, customers] = await Promise.all([
      this.getProducts(),
      this.getOrders(),
      this.getCustomers(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = customers.length;

    const revenueGrowth = 23.5;
    const ordersGrowth = 18.2;

    const topCustomers = customers.slice(0, 5).map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      totalSpent: customer.totalSpent,
      totalOrders: customer.totalOrders,
      avatar: `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200`,
    }));

    const salesTrend = [
      { date: '2024-02-01', revenue: 12450, orders: 134 },
      { date: '2024-02-02', revenue: 15230, orders: 167 },
      { date: '2024-02-03', revenue: 11890, orders: 128 },
      { date: '2024-02-04', revenue: 18760, orders: 201 },
      { date: '2024-02-05', revenue: 14320, orders: 156 },
      { date: '2024-02-06', revenue: 16890, orders: 183 },
      { date: '2024-02-07', revenue: 13540, orders: 149 },
    ];

    const orderStatusDistribution = [
      { status: 'delivered', count: Math.floor(totalOrders * 0.55), percentage: 55.1 },
      { status: 'shipped', count: Math.floor(totalOrders * 0.25), percentage: 25.0 },
      { status: 'processing', count: Math.floor(totalOrders * 0.125), percentage: 12.5 },
      { status: 'pending', count: Math.floor(totalOrders * 0.063), percentage: 6.3 },
      { status: 'cancelled', count: Math.floor(totalOrders * 0.011), percentage: 1.1 },
    ];

    const productPerformance = products.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name,
      revenue: product.price * product.sales,
      units: product.sales,
      growth: Math.random() * 30 + 5, 
    }));

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueGrowth,
      ordersGrowth,
      topCustomers,
      salesTrend,
      orderStatusDistribution,
      productPerformance,
    };
  }

  private static mapProductFromDb(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      category: dbProduct.category,
      price: dbProduct.price,
      stock: dbProduct.stock,
      sales: dbProduct.sales,
      rating: dbProduct.rating,
      image: dbProduct.image,
      status: dbProduct.status,
      createdAt: dbProduct.created_at,
      tenantId: dbProduct.tenant_id,
    };
  }

  private static mapProductToDb(product: Partial<Product>): any {
    return {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sales: product.sales,
      rating: product.rating,
      image: product.image,
      status: product.status,
      created_at: product.createdAt,
    };
  }

  private static mapCustomerFromDb(dbCustomer: any): Customer {
    return {
      id: dbCustomer.id,
      name: dbCustomer.name,
      email: dbCustomer.email,
      phone: dbCustomer.phone,
      totalOrders: dbCustomer.total_orders,
      totalSpent: dbCustomer.total_spent,
      joinDate: dbCustomer.join_date,
      status: dbCustomer.status,
      tenantId: dbCustomer.tenant_id,
    };
  }

  private static mapOrderFromDb(dbOrder: any): Order {
    return {
      id: dbOrder.id,
      customerId: dbOrder.customer_id,
      customerName: dbOrder.customer_name,
      customerEmail: dbOrder.customer_email,
      products: dbOrder.products,
      total: dbOrder.total,
      status: dbOrder.status,
      orderDate: dbOrder.order_date,
      shippingAddress: dbOrder.shipping_address,
      tenantId: dbOrder.tenant_id,
    };
  }
}