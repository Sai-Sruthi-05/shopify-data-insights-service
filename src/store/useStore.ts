import { create } from 'zustand';
import { Product, Order, Customer, Analytics, DateRange } from '../types';
import { getTenantData } from '../data/mockData';
import { EventTracker } from '../lib/events';

interface StoreState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  analytics: Analytics | null;
  
  currentView: 'dashboard' | 'products' | 'orders' | 'customers' | 'events';
  isLoading: boolean;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  dateRange: DateRange;
  
  setCurrentView: (view: 'dashboard' | 'products' | 'orders' | 'customers' | 'events') => void;
  setLoading: (loading: boolean) => void;
  setDateRange: (range: DateRange) => void;
  
  loadTenantData: (tenantId: string) => Promise<void>;
  loadProducts: (tenantId: string) => Promise<void>;
  loadOrders: (tenantId: string) => Promise<void>;
  loadCustomers: (tenantId: string) => Promise<void>;
  loadAnalytics: (tenantId: string) => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id' | 'tenantId'>, tenantId: string) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
  
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  setSelectedOrder: (order: Order | null) => void;
  getFilteredOrders: () => Order[];
  
  trackCartAbandoned: (cartData: any) => Promise<void>;
  trackCheckoutStarted: (checkoutData: any) => Promise<void>;
  trackProductViewed: (productId: string, productData: any) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  orders: [],
  customers: [],
  analytics: null,
  currentView: 'dashboard',
  isLoading: false,
  selectedProduct: null,
  selectedOrder: null,
  dateRange: {
    startDate: '2024-02-01',
    endDate: '2024-02-07',
  },
  
  setCurrentView: (view) => set({ currentView: view }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDateRange: (range) => set({ dateRange: range }),
  
  loadTenantData: async (tenantId: string) => {
    try {
      set({ isLoading: true });
      const tenantData = getTenantData(tenantId);
      set({
        products: tenantData.products,
        orders: tenantData.orders,
        customers: tenantData.customers,
        analytics: tenantData.analytics,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load tenant data:', error);
      set({ isLoading: false });
    }
  },

  loadProducts: async (tenantId: string) => {
    try {
      set({ isLoading: true });
      const tenantData = getTenantData(tenantId);
      set({ products: tenantData.products, isLoading: false });
    } catch (error) {
      console.error('Failed to load products:', error);
      set({ isLoading: false });
    }
  },

  loadOrders: async (tenantId: string) => {
    try {
      set({ isLoading: true });
      const tenantData = getTenantData(tenantId);
      set({ orders: tenantData.orders, isLoading: false });
    } catch (error) {
      console.error('Failed to load orders:', error);
      set({ isLoading: false });
    }
  },

  loadCustomers: async (tenantId: string) => {
    try {
      set({ isLoading: true });
      const tenantData = getTenantData(tenantId);
      set({ customers: tenantData.customers, isLoading: false });
    } catch (error) {
      console.error('Failed to load customers:', error);
      set({ isLoading: false });
    }
  },

  loadAnalytics: async (tenantId: string) => {
    try {
      set({ isLoading: true });
      const tenantData = getTenantData(tenantId);
      set({ analytics: tenantData.analytics, isLoading: false });
    } catch (error) {
      console.error('Failed to load analytics:', error);
      set({ isLoading: false });
    }
  },
  
  addProduct: async (productData, tenantId) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: `PROD-${Date.now()}`,
        tenantId,
        sales: 0,
        rating: 4.0,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ 
        products: [newProduct, ...state.products] 
      }));
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id, updates) => {
    try {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...updates } : product
        ),
      }));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
  
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  updateOrderStatus: async (id, status) => {
    try {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
      }));
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },
  
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  getFilteredOrders: () => {
    const { orders, dateRange } = get();
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  },

  trackCartAbandoned: async (cartData) => {
    try {
      await EventTracker.trackCartAbandoned(cartData);
    } catch (error) {
      console.error('Failed to track cart abandoned event:', error);
    }
  },

  trackCheckoutStarted: async (checkoutData) => {
    try {
      await EventTracker.trackCheckoutStarted(checkoutData);
    } catch (error) {
      console.error('Failed to track checkout started event:', error);
    }
  },

  trackProductViewed: async (productId, productData) => {
    try {
      await EventTracker.trackProductViewed(productId, productData);
    } catch (error) {
      console.error('Failed to track product viewed event:', error);
    }
  },
}));