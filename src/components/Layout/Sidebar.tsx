import React from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore.ts';

const navigation = [
  { name: 'Dashboard', icon: BarChart3, key: 'dashboard' as const },
  { name: 'Products', icon: Package, key: 'products' as const },
  { name: 'Orders', icon: ShoppingCart, key: 'orders' as const },
  { name: 'Customers', icon: Users, key: 'customers' as const },
  { name: 'Events', icon: Activity, key: 'events' as const },
];

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useStore();
  const { user, tenant, logout } = useAuthStore();

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{tenant?.name || 'Xeno FDE'}</h1>
            <p className="text-xs text-gray-500">{tenant?.domain || 'Analytics Dashboard'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = currentView === item.key;
          return (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.key)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name ? getUserInitials(user.name) : 'AT'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Alex Thompson'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || 'admin'}
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};