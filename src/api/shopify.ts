export interface ShopifyProduct {
  id: string;
  title: string;
  vendor: string;
  product_type: string;
  variants: Array<{
    id: string;
    price: string;
    inventory_quantity: number;
  }>;
  images: Array<{
    src: string;
  }>;
}

export interface ShopifyCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_spent: string;
  orders_count: number;
  created_at: string;
}

export interface ShopifyOrder {
  id: string;
  customer: ShopifyCustomer;
  line_items: Array<{
    product_id: string;
    title: string;
    quantity: number;
    price: string;
  }>;
  total_price: string;
  financial_status: string;
  created_at: string;
  shipping_address: {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
}

export class ShopifyService {
  private static baseUrl = 'https://your-store.myshopify.com/admin/api/2023-10';
  private static accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  static async getProducts(tenantId: string): Promise<ShopifyProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken || '',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Shopify API Error:', error);
      return [];
    }
  }

  static async getCustomers(tenantId: string): Promise<ShopifyCustomer[]> {
    try {
      const response = await fetch(`${this.baseUrl}/customers.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken || '',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch customers');
      
      const data = await response.json();
      return data.customers;
    } catch (error) {
      console.error('Shopify API Error:', error);
      return [];
    }
  }

  static async getOrders(tenantId: string): Promise<ShopifyOrder[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken || '',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      return data.orders;
    } catch (error) {
      console.error('Shopify API Error:', error);
      return [];
    }
  }

  static async handleWebhook(webhookData: any, tenantId: string) {
    try {
      const { topic, data } = webhookData;
      
      switch (topic) {
        case 'orders/create':
        case 'orders/updated':
          await this.syncOrder(data, tenantId);
          break;
        case 'customers/create':
        case 'customers/updated':
          await this.syncCustomer(data, tenantId);
          break;
        case 'products/create':
        case 'products/updated':
          await this.syncProduct(data, tenantId);
          break;
        default:
          console.log('Unhandled webhook topic:', topic);
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  private static async syncOrder(orderData: ShopifyOrder, tenantId: string) {
    console.log('Syncing order:', orderData.id, 'for tenant:', tenantId);
  }

  private static async syncCustomer(customerData: ShopifyCustomer, tenantId: string) {
    console.log('Syncing customer:', customerData.id, 'for tenant:', tenantId);
  }

  private static async syncProduct(productData: ShopifyProduct, tenantId: string) {
    console.log('Syncing product:', productData.id, 'for tenant:', tenantId);
  }
}