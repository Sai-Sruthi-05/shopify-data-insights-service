import { supabase } from './supabase';
import { User, Tenant } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  tenantName: string;
  tenantDomain: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: User; tenant: Tenant }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        tenants (*)
      `)
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return {
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role as 'admin' | 'manager' | 'analyst',
        avatar: userProfile.avatar,
        tenantId: userProfile.tenant_id,
      },
      tenant: {
        id: userProfile.tenants.id,
        name: userProfile.tenants.name,
        domain: userProfile.tenants.domain,
        settings: userProfile.tenants.settings,
        createdAt: userProfile.tenants.created_at,
        status: userProfile.tenants.status,
      },
    };
  }

  static async register(credentials: RegisterCredentials): Promise<{ user: User; tenant: Tenant }> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: credentials.tenantName,
        domain: credentials.tenantDomain,
        settings: {
          theme: 'default',
          currency: 'USD',
          timezone: 'UTC',
          features: ['analytics', 'inventory', 'orders', 'customers'],
        },
        status: 'active',
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name: credentials.name,
        email: credentials.email,
        role: 'admin',
        avatar: `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200`,
        tenant_id: tenant.id,
      })
      .select()
      .single();

    if (userError) throw userError;

    return {
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role as 'admin' | 'manager' | 'analyst',
        avatar: userProfile.avatar,
        tenantId: userProfile.tenant_id,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        settings: tenant.settings,
        createdAt: tenant.created_at,
        status: tenant.status,
      },
    };
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser(): Promise<{ user: User; tenant: Tenant } | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: userProfile, error } = await supabase
      .from('users')
      .select(`
        *,
        tenants (*)
      `)
      .eq('id', user.id)
      .single();

    if (error) return null;

    return {
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role as 'admin' | 'manager' | 'analyst',
        avatar: userProfile.avatar,
        tenantId: userProfile.tenant_id,
      },
      tenant: {
        id: userProfile.tenants.id,
        name: userProfile.tenants.name,
        domain: userProfile.tenants.domain,
        settings: userProfile.tenants.settings,
        createdAt: userProfile.tenants.created_at,
        status: userProfile.tenants.status,
      },
    };
  }
}