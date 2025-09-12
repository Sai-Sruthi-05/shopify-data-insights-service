import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { Customer } from '../../types';

export const CustomerList: React.FC = () => {
  const { customers, loadCustomers } = useStore();
  const { tenant } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Customer['status']>('all');

  React.useEffect(() => {
    if (tenant?.id) {
      loadCustomers(tenant.id);
    }
  }, [tenant?.id, loadCustomers]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Customer['status']) => {
    return status === 'active' 
      ? 'bg-success-100 text-success-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-600">Manage your customer relationships for {tenant?.name}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Customers</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {getUserInitials(customer.name)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                <p className="text-sm text-gray-500">ID: {customer.id}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{customer.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{customer.phone}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Joined {new Date(customer.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-primary-600 mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="font-semibold">{customer.totalOrders}</span>
                </div>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-success-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">${customer.totalSpent.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-4 px-4 py-2 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found for {tenant?.name}</p>
        </div>
      )}
    </div>
  );
};