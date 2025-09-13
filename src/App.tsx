import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthWrapper } from './components/Auth/AuthWrapper';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProductList } from './components/Products/ProductList';
import { OrderList } from './components/Orders/OrderList';
import { CustomerList } from './components/Customers/CustomerList';
import { EventsPage } from './components/Events/EventsPage';

function App() {
  const { currentView } = useStore();
  const { user, tenant, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const getPageConfig = () => {
    switch (currentView) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: `Welcome back, ${user?.name || 'User'}! Here's what's happening with ${tenant?.name || 'your business'}.`,
          component: <Dashboard />,
        };
      case 'products':
        return {
          title: 'Products',
          subtitle: `Manage your product inventory for ${tenant?.name || 'your store'}.`,
          component: <ProductList />,
        };
      case 'orders':
        return {
          title: 'Orders',
          subtitle: `Track and manage customer orders for ${tenant?.name || 'your store'}.`,
          component: <OrderList />,
        };
      case 'customers':
        return {
          title: 'Customers',
          subtitle: `Manage your customer relationships for ${tenant?.name || 'your store'}.`,
          component: <CustomerList />,
        };
      case 'events':
        return {
          title: 'Custom Events',
          subtitle: `Track user interactions and custom events for ${tenant?.name || 'your store'}.`,
          component: <EventsPage />,
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: `Welcome back, ${user?.name || 'User'}! Here's what's happening with ${tenant?.name || 'your business'}.`,
          component: <Dashboard />,
        };
    }
  };

  const pageConfig = getPageConfig();

  return (
    <AuthWrapper>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header title={pageConfig.title} subtitle={pageConfig.subtitle} />
            <main className="flex-1 overflow-auto p-6">
              {pageConfig.component}
            </main>
          </div>
        </div>
      </Router>
    </AuthWrapper>
  );
}

export default App;