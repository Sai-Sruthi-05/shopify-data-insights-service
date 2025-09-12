import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pllbrsnxwghesnwopxza.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbGJyc254d2doZXNud29weHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDQ0MDcsImV4cCI6MjA3MzA4MDQwN30.UUHjvBs0hYepQe28wh-PZ2DGNfdFonMSg54T4Q4K5Jk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          domain: string;
          settings: any;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          settings?: any;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          settings?: any;
          created_at?: string;
          status?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string;
          tenant_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: string;
          avatar?: string;
          tenant_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          avatar?: string;
          tenant_id?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          stock: number;
          sales: number;
          rating: number;
          image: string;
          status: string;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          price: number;
          stock: number;
          sales?: number;
          rating?: number;
          image?: string;
          status?: string;
          created_at?: string;
          tenant_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          price?: number;
          stock?: number;
          sales?: number;
          rating?: number;
          image?: string;
          status?: string;
          created_at?: string;
          tenant_id?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          total_orders: number;
          total_spent: number;
          join_date: string;
          status: string;
          tenant_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          total_orders?: number;
          total_spent?: number;
          join_date?: string;
          status?: string;
          tenant_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          total_orders?: number;
          total_spent?: number;
          join_date?: string;
          status?: string;
          tenant_id?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          customer_email: string;
          products: any;
          total: number;
          status: string;
          order_date: string;
          shipping_address: string;
          tenant_id: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          customer_name: string;
          customer_email: string;
          products: any;
          total: number;
          status?: string;
          order_date?: string;
          shipping_address: string;
          tenant_id: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          customer_name?: string;
          customer_email?: string;
          products?: any;
          total?: number;
          status?: string;
          order_date?: string;
          shipping_address?: string;
          tenant_id?: string;
        };
      };
      custom_events: {
        Row: {
          id: string;
          event_type: string;
          user_id: string | null;
          session_id: string;
          data: any;
          timestamp: string;
          tenant_id: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          user_id?: string | null;
          session_id: string;
          data: any;
          timestamp?: string;
          tenant_id: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          user_id?: string | null;
          session_id?: string;
          data?: any;
          timestamp?: string;
          tenant_id?: string;
        };
      };
    };
  };
}