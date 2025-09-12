import { ShopifyService } from '../api/shopify';
import { ApiService } from './api';

export class DataSyncScheduler {
  private static syncInterval: NodeJS.Timeout | null = null;
  private static isRunning = false;

  static startSync(intervalMinutes: number = 15) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.performFullSync();
    }, intervalMinutes * 60 * 1000);

    this.isRunning = true;
    console.log(`✅ Data sync scheduler started (every ${intervalMinutes} minutes)`);
    
    this.performFullSync();
  }

  static stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.isRunning = false;
      console.log('🛑 Data sync scheduler stopped');
    }
  }

  static getStatus() {
    return {
      isRunning: this.isRunning,
      lastSync: new Date().toISOString(),
    };
  }

  private static async performFullSync() {
    try {
      console.log('🔄 Starting scheduled data sync...');
      
      const tenants = await this.getActiveTenants();
      
      for (const tenant of tenants) {
        await this.syncTenantData(tenant.id, tenant.shopifyDomain);
      }
      
      console.log('✅ Scheduled data sync completed');
    } catch (error) {
      console.error('❌ Scheduled sync error:', error);
    }
  }

  private static async getActiveTenants() {
    return [
      { id: 'tenant-001', shopifyDomain: 'demo-store.myshopify.com' },
      { id: 'tenant-002', shopifyDomain: 'tech-store.myshopify.com' },
    ];
  }

  private static async syncTenantData(tenantId: string, shopifyDomain: string) {
    try {
      console.log(`🔄 Syncing data for tenant: ${tenantId}`);
      
      const [products, customers, orders] = await Promise.all([
        ShopifyService.getProducts(tenantId),
        ShopifyService.getCustomers(tenantId),
        ShopifyService.getOrders(tenantId),
      ]);

      console.log(`✅ Synced ${products.length} products, ${customers.length} customers, ${orders.length} orders for tenant ${tenantId}`);
      
      await ApiService.trackEvent({
        eventType: 'data_sync_completed',
        sessionId: `sync-${Date.now()}`,
        data: {
          tenantId,
          productsCount: products.length,
          customersCount: customers.length,
          ordersCount: orders.length,
          syncTime: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error(`❌ Sync error for tenant ${tenantId}:`, error);
    }
  }
}