import React, { useState, useEffect } from 'react';
import { Activity, ShoppingCart, Eye, UserPlus, Calendar, Filter } from 'lucide-react';
import { ApiService } from '../../lib/api.ts';
import { CustomEvent, CustomEventType } from '../../types';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [filterType, setFilterType] = useState<'all' | CustomEventType>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const mockEvents: CustomEvent[] = [
        {
          id: '1',
          eventType: 'cart_abandoned',
          sessionId: 'sess-001',
          userId: 'user-001',
          data: { cartValue: 299.99, cartItems: 3 },
          timestamp: new Date().toISOString(),
          tenantId: 'default-tenant',
        },
        {
          id: '2',
          eventType: 'checkout_started',
          sessionId: 'sess-002',
          userId: 'user-002',
          data: { cartValue: 149.99, cartItems: 2 },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          tenantId: 'default-tenant',
        },
        {
          id: '3',
          eventType: 'product_viewed',
          sessionId: 'sess-003',
          userId: 'user-003',
          data: { productName: 'Premium Wireless Headphones', productId: '1' },
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          tenantId: 'default-tenant',
        },
        {
          id: '4',
          eventType: 'user_registered',
          sessionId: 'sess-004',
          userId: 'user-004',
          data: { registrationMethod: 'email', userRole: 'customer' },
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          tenantId: 'default-tenant',
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.eventType === filterType);

  const getEventIcon = (eventType: CustomEventType) => {
    switch (eventType) {
      case 'cart_abandoned':
        return <ShoppingCart className="w-5 h-5 text-warning-600" />;
      case 'checkout_started':
        return <ShoppingCart className="w-5 h-5 text-primary-600" />;
      case 'product_viewed':
        return <Eye className="w-5 h-5 text-secondary-600" />;
      case 'user_registered':
        return <UserPlus className="w-5 h-5 text-success-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventColor = (eventType: CustomEventType) => {
    switch (eventType) {
      case 'cart_abandoned':
        return 'bg-warning-100 text-warning-800';
      case 'checkout_started':
        return 'bg-primary-100 text-primary-800';
      case 'product_viewed':
        return 'bg-secondary-100 text-secondary-800';
      case 'user_registered':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventType = (eventType: CustomEventType) => {
    return eventType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getEventStats = () => {
    return {
      cart_abandoned: events.filter(e => e.eventType === 'cart_abandoned').length,
      checkout_started: events.filter(e => e.eventType === 'checkout_started').length,
      product_viewed: events.filter(e => e.eventType === 'product_viewed').length,
      user_registered: events.filter(e => e.eventType === 'user_registered').length,
    };
  };

  const stats = getEventStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Custom Events</h2>
        <p className="text-gray-600">Track user interactions and behaviors</p>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cart Abandoned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cart_abandoned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checkout Started</p>
              <p className="text-2xl font-bold text-gray-900">{stats.checkout_started}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Product Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.product_viewed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.user_registered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | CustomEventType)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Events</option>
          <option value="cart_abandoned">Cart Abandoned</option>
          <option value="checkout_started">Checkout Started</option>
          <option value="product_viewed">Product Viewed</option>
          <option value="user_registered">User Registered</option>
        </select>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getEventIcon(event.eventType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {formatEventType(event.eventType)}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventColor(event.eventType)}`}>
                          {event.eventType}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Session: {event.sessionId.slice(0, 8)}...</p>
                        {event.userId && <p>User: {event.userId.slice(0, 8)}...</p>}
                        
                        {/* Event-specific data */}
                        {event.eventType === 'cart_abandoned' && event.data.cartValue && (
                          <p>Cart Value: ${event.data.cartValue}</p>
                        )}
                        {event.eventType === 'checkout_started' && event.data.cartValue && (
                          <p>Checkout Value: ${event.data.cartValue}</p>
                        )}
                        {event.eventType === 'product_viewed' && event.data.productName && (
                          <p>Product: {event.data.productName}</p>
                        )}
                        {event.eventType === 'user_registered' && event.data.userRole && (
                          <p>Role: {event.data.userRole}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};