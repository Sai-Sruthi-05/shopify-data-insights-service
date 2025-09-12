import { ShopifyService } from './shopify';
import { EventTracker } from '../lib/events.ts';

export interface WebhookPayload {
  topic: string;
  shop_domain: string;
  data: any;
}

export class WebhookService {
  static async handleShopifyWebhook(payload: WebhookPayload) {
    try {
      const tenantId = await this.getTenantIdFromDomain(payload.shop_domain);
      
      if (!tenantId) {
        throw new Error(`No tenant found for domain: ${payload.shop_domain}`);
      }

      switch (payload.topic) {
        case 'orders/create':
          await this.handleOrderCreated(payload.data, tenantId);
          break;
        case 'orders/updated':
          await this.handleOrderUpdated(payload.data, tenantId);
          break;
        case 'customers/create':
          await this.handleCustomerCreated(payload.data, tenantId);
          break;
        case 'products/create':
        case 'products/updated':
          await this.handleProductUpdated(payload.data, tenantId);
          break;
        case 'carts/update':
          await this.handleCartUpdated(payload.data, tenantId);
          break;
        default:
          console.log('Unhandled webhook topic:', payload.topic);
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private static async getTenantIdFromDomain(shopDomain: string): Promise<string | null> {
    const domainToTenantMap: Record<string, string> = {
      'demo-store.myshopify.com': 'tenant-001',
      'tech-store.myshopify.com': 'tenant-002',
    };
    
    return domainToTenantMap[shopDomain] || null;
  }

  private static async handleOrderCreated(orderData: any, tenantId: string) {
    await ShopifyService.handleWebhook({ topic: 'orders/create', data: orderData }, tenantId);
    
    await EventTracker.trackCheckoutStarted({
      items: orderData.line_items,
      total: parseFloat(orderData.total_price),
    });
  }

  private static async handleOrderUpdated(orderData: any, tenantId: string) {
    await ShopifyService.handleWebhook({ topic: 'orders/updated', data: orderData }, tenantId);
  }

  private static async handleCustomerCreated(customerData: any, tenantId: string) {
    await ShopifyService.handleWebhook({ topic: 'customers/create', data: customerData }, tenantId);
    
    await EventTracker.trackUserRegistered({
      id: customerData.id,
      role: 'customer',
    });
  }

  private static async handleProductUpdated(productData: any, tenantId: string) {
    await ShopifyService.handleWebhook({ topic: 'products/updated', data: productData }, tenantId);
  }

  private static async handleCartUpdated(cartData: any, tenantId: string) {
    if (cartData.abandoned_checkout_url) {
      await EventTracker.trackCartAbandoned({
        items: cartData.line_items,
        total: parseFloat(cartData.total_price || '0'),
      });
    }
  }
}

export class DataSyncScheduler {
  private static syncInterval: NodeJS.Timeout | null = null;

  static startSync(intervalMinutes: number = 15) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.performFullSync();
    }, intervalMinutes * 60 * 1000);

    console.log(`Data sync scheduler started (every ${intervalMinutes} minutes)`);
  }

  static stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Data sync scheduler stopped');
    }
  }

  private static async performFullSync() {
    try {
      console.log('Starting scheduled data sync...');
      
      const tenants = ['tenant-001', 'tenant-002']; 
      
      for (const tenantId of tenants) {
        await this.syncTenantData(tenantId);
      }
      
      console.log('Scheduled data sync completed');
    } catch (error) {
      console.error('Scheduled sync error:', error);
    }
  }

  private static async syncTenantData(tenantId: string) {
    try {
      const [products, customers, orders] = await Promise.all([
        ShopifyService.getProducts(tenantId),
        ShopifyService.getCustomers(tenantId),
        ShopifyService.getOrders(tenantId),
      ]);

      console.log(`Synced ${products.length} products, ${customers.length} customers, ${orders.length} orders for tenant ${tenantId}`);
    } catch (error) {
      console.error(`Sync error for tenant ${tenantId}:`, error);
    }
  }
}