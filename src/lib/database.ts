export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export class Database {
  private static instance: Database;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  static getInstance(config?: DatabaseConfig): Database {
    if (!Database.instance && config) {
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  async findMany<T>(table: string, tenantId: string, filters?: any): Promise<T[]> {
    const query = `
      SELECT * FROM ${table} 
      WHERE tenant_id = $1 
      ${filters ? 'AND ' + this.buildWhereClause(filters) : ''}
      ORDER BY created_at DESC
    `;
    
    console.log('Executing query:', query, [tenantId]);
    return [];
  }

  async findUnique<T>(table: string, tenantId: string, id: string): Promise<T | null> {
    const query = `
      SELECT * FROM ${table} 
      WHERE tenant_id = $1 AND id = $2 
      LIMIT 1
    `;
    
    console.log('Executing query:', query, [tenantId, id]);
    return null;
  }

  async create<T>(table: string, data: any): Promise<T> {
    const fields = Object.keys(data).join(', ');
    const values = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${fields}) 
      VALUES (${values}) 
      RETURNING *
    `;
    
    console.log('Executing query:', query, Object.values(data));
    return data as T;
  }

  async update<T>(table: string, tenantId: string, id: string, data: any): Promise<T> {
    const updates = Object.keys(data)
      .map((key, i) => `${key} = $${i + 3}`)
      .join(', ');
    
    const query = `
      UPDATE ${table} 
      SET ${updates} 
      WHERE tenant_id = $1 AND id = $2 
      RETURNING *
    `;
    
    console.log('Executing query:', query, [tenantId, id, ...Object.values(data)]);
    return data as T;
  }

  async delete(table: string, tenantId: string, id: string): Promise<void> {
    const query = `
      DELETE FROM ${table} 
      WHERE tenant_id = $1 AND id = $2
    `;
    
    console.log('Executing query:', query, [tenantId, id]);
  }

  private buildWhereClause(filters: any): string {
    return Object.keys(filters)
      .map(key => `${key} = '${filters[key]}'`)
      .join(' AND ');
  }
}

export class TenantRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getProducts(tenantId: string) {
    return this.db.findMany('products', tenantId);
  }

  async createProduct(tenantId: string, productData: any) {
    return this.db.create('products', { ...productData, tenant_id: tenantId });
  }

  async updateProduct(tenantId: string, productId: string, updates: any) {
    return this.db.update('products', tenantId, productId, updates);
  }

  async deleteProduct(tenantId: string, productId: string) {
    return this.db.delete('products', tenantId, productId);
  }

  async getCustomers(tenantId: string) {
    return this.db.findMany('customers', tenantId);
  }

  async getTopCustomers(tenantId: string, limit: number = 5) {
    return this.db.findMany('customers', tenantId, { 
      orderBy: 'total_spent DESC',
      limit 
    });
  }

  async getOrders(tenantId: string, dateRange?: { start: string; end: string }) {
    const filters = dateRange ? {
      created_at: `BETWEEN '${dateRange.start}' AND '${dateRange.end}'`
    } : undefined;
    
    return this.db.findMany('orders', tenantId, filters);
  }

  async updateOrderStatus(tenantId: string, orderId: string, status: string) {
    return this.db.update('orders', tenantId, orderId, { status });
  }

  async trackEvent(tenantId: string, eventData: any) {
    return this.db.create('custom_events', { ...eventData, tenant_id: tenantId });
  }

  async getEvents(tenantId: string, eventType?: string) {
    const filters = eventType ? { event_type: eventType } : undefined;
    return this.db.findMany('custom_events', tenantId, filters);
  }
}