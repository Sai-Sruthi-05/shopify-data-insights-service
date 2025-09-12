import { supabase } from '../lib/supabase.ts';

export const seedDatabase = async (tenantId: string) => {
  try {
    const products = [
      {
        name: 'Premium Wireless Headphones',
        category: 'Electronics',
        price: 199.99,
        stock: 45,
        sales: 234,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        tenant_id: tenantId,
      },
      {
        name: 'Smart Fitness Tracker',
        category: 'Wearables',
        price: 129.99,
        stock: 78,
        sales: 567,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        tenant_id: tenantId,
      },
      {
        name: 'Organic Cotton T-Shirt',
        category: 'Clothing',
        price: 29.99,
        stock: 123,
        sales: 892,
        rating: 4.4,
        image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        tenant_id: tenantId,
      },
    ];

    await supabase.from('products').insert(products);

    const customers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        total_orders: 3,
        total_spent: 749.94,
        join_date: '2024-01-15T10:00:00Z',
        status: 'active',
        tenant_id: tenantId,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0102',
        total_orders: 5,
        total_spent: 1299.95,
        join_date: '2024-01-20T14:30:00Z',
        status: 'active',
        tenant_id: tenantId,
      },
    ];

    await supabase.from('customers').insert(customers);

    const orders = [
      {
        customer_id: 'CUST-001',
        customer_name: 'John Smith',
        customer_email: 'john.smith@email.com',
        products: [
          { productId: '1', productName: 'Premium Wireless Headphones', quantity: 1, price: 199.99 },
        ],
        total: 199.99,
        status: 'delivered',
        order_date: '2024-03-01T10:15:00Z',
        shipping_address: '123 Main St, New York, NY 10001',
        tenant_id: tenantId,
      },
    ];

    await supabase.from('orders').insert(orders);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};