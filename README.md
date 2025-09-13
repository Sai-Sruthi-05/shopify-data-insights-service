# Shopify Data Ingestion & Insights Service

A multi-tenant data ingestion and analytics platform that connects to Shopify APIs, ingests store data 
(customers, orders, products), and provides an interactive dashboard with insights such as revenue trends, 
top customers, and order analytics built with React, TypeScript, Supabase, and PostgreSQL.

### 1. Shopify Store Setup (Simulated)
- ✅ Created comprehensive mock data representing Shopify store data
- ✅ Dummy products, customers, and orders implemented
- ✅ Multi-store data with different product catalogs per tenant

### 2. Data Ingestion Service
- ✅ Built service that connects to APIs and ingests:
  - ✅ Customers data with full profiles
  - ✅ Orders with detailed product information
  - ✅ Products with inventory and sales data
  - ✅ Custom events (cart abandoned, checkout started, product viewed, user registered)
- ✅ PostgreSQL database integration with Supabase
- ✅ **Multi-tenant architecture** with complete data isolation using tenant identifiers

### 3. Insights Dashboard
- ✅ **Email authentication** with login/register functionality
- ✅ **Total customers, orders, and revenue** metrics with growth indicators
- ✅ **Orders by date** with date range filtering
- ✅ **Top 5 customers by spend** with detailed profiles
- ✅ **Additional creative metrics**:
  - Revenue trend charts with Chart.js
  - Order status distribution (pie chart)
  - Product performance analytics
  - Real-time activity feed
  - Shopify integration status

## Features

### Core Features
- 📊 **Interactive Analytics Dashboard** with real-time metrics and charts
- 🛍️ **Product Management** with full CRUD operations
- 📦 **Order Management** with status tracking and date filtering
- 👥 **Customer Management** with relationship tracking
- 🔐 **Authentication System** with login/register
- 🏢 **Multi-tenant Architecture** with complete data isolation
- 📈 **Custom Event Tracking** (cart abandoned, checkout started, etc.)

### Technical Implementation
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth (with mock implementation)
- **Charts**: Chart.js with react-chartjs-2
- **Multi-tenancy**: Tenant-based data isolation

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- VS Code with recommended extensions
- Supabase account (optional for production)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
  1. For production, fill in your Supabase credentials:
   ```
 # Supabase Credentials
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

 # Shopify Credentials
    SHOPIFY_API_KEY=your_shopify_api_key
    SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
    SHOPIFY_API_SECRET=your_shopify_api_secret

 # Vercel Deployment URL
    VERCEL_URL=your-app.vercel.app
   ```

### 3. VS Code Extensions (Required)
Install these extensions for the best development experience:
- **Tailwind CSS IntelliSense** by Tailwind Labs
- **TypeScript Importer** by pmneo
- **ES7+ React/Redux/React-Native snippets** by dsznajder
- **Auto Rename Tag** by Jun Han
- **Prettier - Code formatter** by Prettier

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Demo Credentials

### Demo Store (Tenant 1):
- **Email**: admin@demo.com
- **Password**: demo123
- **Store**: Demo Store (Electronics, Clothing, etc.)

### Tech Store (Tenant 2):
- **Email**: manager@demo.com  
- **Password**: demo123
- **Store**: Tech Store (Gaming peripherals)

## Multi-Tenant Features

The application demonstrates complete multi-tenancy:

- **Data Isolation**: Each tenant has completely separate data
- **Different Product Catalogs**: Each store has unique products
- **Tenant-Specific Analytics**: Metrics calculated per tenant
- **User-Tenant Association**: Users belong to specific tenants
- **Tenant Branding**: Store name and domain displayed

## Deployment

### Vercel
```bash
npm run deploy:vercel
```

## API Endpoints (Ready for Production)

### Products API
- `GET /api/products` - Get all products for tenant
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers API
- `GET /api/customers` - Get all customers for tenant
- `GET /api/customers/top` - Get top 5 customers by spending

### Orders API
- `GET /api/orders` - Get all orders for tenant (with date filtering)
- `PUT /api/orders/:id/status` - Update order status

### Events API
- `POST /api/events` - Track custom event
- `GET /api/events` - Get custom events for tenant

## Custom Events Tracking

The application tracks these custom events:

1. **Cart Abandoned** - When user leaves items in cart
2. **Checkout Started** - When user begins checkout process
3. **Product Viewed** - When user views product details
4. **User Registered** - When new user creates account

## Database Schema (PostgreSQL)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  avatar TEXT,
  tenant_id UUID REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 4.0,
  image TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID REFERENCES tenants(id)
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  join_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  tenant_id UUID REFERENCES tenants(id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  products JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  order_date TIMESTAMPTZ DEFAULT NOW(),
  shipping_address TEXT,
  tenant_id UUID REFERENCES tenants(id)
);

CREATE TABLE custom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  session_id TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID REFERENCES tenants(id)
);
```

## Features Implemented

✅ **Shopify Store Setup** (simulated with comprehensive data)  
✅ **Data Ingestion Service** with multi-tenant support  
✅ **Interactive Dashboard** with all required metrics  
✅ **Real-time Analytics** and trend visualization  
✅ **Product Management** with CRUD operations  
✅ **Order Management** with date filtering  
✅ **Customer Management** with detailed profiles  
✅ **User Authentication** (login/register)  
✅ **Multi-tenant Architecture** with data isolation  
✅ **Custom Event Tracking**  
✅ **PostgreSQL Database** integration ready  
✅ **Professional UI/UX** with responsive design  
✅ **Top 5 Customers** by spending  
✅ **Date Range Filtering** for orders  
✅ **Tenant-specific Data** isolation  
✅ **Deployment Ready** for multiple platforms  
✅ **Shopify Integration** with webhooks and sync  
✅ **ORM Layer** for clean database operations  

## Bonus Features

✅ **Custom Events** (cart abandoned, checkout started, product viewed, user registered)  
✅ **Multi-tenant Data Isolation** with different stores  
✅ **Real-time Event Tracking** system  
✅ **Professional Authentication** flow  
✅ **Shopify Integration** status monitoring  
✅ **Advanced Analytics** with multiple chart types  
✅ **Responsive Design** for all devices  
✅ **Deployment Scripts** for multiple platforms  
✅ **Database Migrations** and seeding  
✅ **Webhook Handling** for real-time sync  