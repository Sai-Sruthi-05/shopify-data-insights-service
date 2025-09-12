import React from 'react';
import { DollarSign, ShoppingCart, Package, Users, Plus, FileText, BarChart3 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { MetricCard } from './MetricCard';
import { RevenueChart } from './Charts/RevenueChart';
import { OrderStatusChart } from './Charts/OrderStatusChart';
import { TopProducts } from './TopProducts';
import { TopCustomers } from './TopCustomers';
import { ProductForm } from '../Products/ProductForm';

export const Dashboard: React.FC = () => {
  const { analytics, setCurrentView, loadTenantData } = useStore();
  const { tenant } = useAuthStore();
  const [showProductForm, setShowProductForm] = React.useState(false);

  React.useEffect(() => {
    if (tenant?.id) {
      loadTenantData(tenant.id);
    }
  }, [tenant?.id, loadTenantData]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        setShowProductForm(true);
        break;
      case 'process-orders':
        setCurrentView('orders');
        break;
      case 'view-analytics':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  if (!analytics) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change={analytics.revenueGrowth}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Total Orders"
          value={analytics.totalOrders.toLocaleString()}
          change={analytics.ordersGrowth}
          icon={ShoppingCart}
          color="green"
        />
        <MetricCard
          title="Products"
          value={analytics.totalProducts.toLocaleString()}
          icon={Package}
          color="orange"
        />
        <MetricCard
          title="Customers"
          value={analytics.totalCustomers.toLocaleString()}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <OrderStatusChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TopProducts />
        </div>
        <div className="lg:col-span-1">
          <TopCustomers />
        </div>
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('add-product')}
                className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-3"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
              <button 
                onClick={() => handleQuickAction('process-orders')}
                className="w-full text-left px-4 py-3 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors flex items-center space-x-3"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Process Orders</span>
              </button>
              <button 
                onClick={() => handleQuickAction('view-analytics')}
                className="w-full text-left px-4 py-3 bg-accent-50 text-accent-700 rounded-lg hover:bg-accent-100 transition-colors flex items-center space-x-3"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Analytics Report</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <p className="text-sm text-gray-600">New order received from {analytics.topCustomers[0]?.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Product inventory updated</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Low stock alert for 3 products</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Order shipped to customer</p>
              </div>
            </div>
          </div>

          {/* Shopify Integration Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopify Integration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Store Connection</span>
                <span className="px-2 py-1 bg-success-100 text-success-800 text-xs rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Sync</span>
                <span className="px-2 py-1 bg-success-100 text-success-800 text-xs rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          onClose={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
};