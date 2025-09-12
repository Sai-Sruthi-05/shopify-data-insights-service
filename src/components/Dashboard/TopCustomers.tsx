import React from 'react';
import { Crown, Mail, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const TopCustomers: React.FC = () => {
  const { analytics } = useStore();

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!analytics?.topCustomers) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Customers</h3>
            <p className="text-sm text-gray-500">Highest spending customers</p>
          </div>
          <Crown className="w-6 h-6 text-accent-500" />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top 5 Customers</h3>
          <p className="text-sm text-gray-500">Highest spending customers</p>
        </div>
        <Crown className="w-6 h-6 text-accent-500" />
      </div>

      <div className="space-y-4">
        {analytics.topCustomers.map((customer, index) => (
          <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials(customer.name)}
                  </span>
                </div>
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span>{customer.email}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 text-success-600 font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>${customer.totalSpent.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500">
                {customer.totalOrders} orders
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};