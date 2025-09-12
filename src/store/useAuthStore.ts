import { create } from 'zustand';
import { AuthState, User, Tenant } from '../types';
import { getUserByEmail, getTenantById } from '../data/mockData';

interface AuthStore extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: { name: string; email: string; password: string; tenantName: string; tenantDomain: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      
      const validCredentials = [
        { email: 'admin@demo.com', password: 'demo123' },
        { email: 'manager@demo.com', password: 'demo123' },
      ];

      const isValid = validCredentials.some(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (isValid) {
        const user = getUserByEmail(credentials.email);
        const tenant = getTenantById(user.tenantId);

        if (user && tenant) {
          localStorage.setItem('tenantId', tenant.id);
          localStorage.setItem('userId', user.id);
          
          set({
            user,
            tenant,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error('User or tenant not found');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    try {
      set({ isLoading: true });
      
      const newTenantId = `TENANT-${Date.now()}`;
      const newUser: User = {
        id: `USER-${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        role: 'admin',
        avatar: credentials.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        tenantId: newTenantId,
      };

      const newTenant: Tenant = {
        id: newTenantId,
        name: credentials.tenantName,
        domain: credentials.tenantDomain,
        settings: {
          theme: 'default',
          currency: 'USD',
          timezone: 'UTC',
          features: ['analytics', 'inventory', 'orders', 'customers'],
        },
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      localStorage.setItem('tenantId', newTenant.id);
      localStorage.setItem('userId', newUser.id);
      
      set({
        user: newUser,
        tenant: newTenant,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('tenantId');
      localStorage.removeItem('userId');
      
      set({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const tenantId = localStorage.getItem('tenantId');
      const userId = localStorage.getItem('userId');
      
      if (tenantId && userId) {
        const user = Object.values(getUserByEmail('admin@demo.com') ? 
          { 'admin@demo.com': getUserByEmail('admin@demo.com') } : {}
        ).find(u => u?.id === userId) || getUserByEmail('admin@demo.com');
        
        const tenant = getTenantById(tenantId);

        if (user && tenant) {
          set({
            user,
            tenant,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            tenant: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        set({
          user: null,
          tenant: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));