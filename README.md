# Amazon DR Dashboard — Amazon Seller Daily Review

A full-stack SaaS dashboard built for Amazon sellers to run their **Daily Review (DR)** — tracking sales, FBA inventory, listing health, and reviews in one Amazon-branded interface.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Amazon SP-API**, **Prisma ORM**, **NextAuth.js**, and **Recharts**.

## Amazon DR Features

| Page | What it shows |
|------|--------------|
| **Daily Review** | Revenue, units ordered, sessions, Buy Box %, conversion rate, DR checklist |
| **Inventory** | FBA stock levels, days of supply, restock alerts, stranded/unfulfillable units |
| **Listings & Reviews** | Listing health, suppression issues, star ratings, negative reviews needing attention |
| **Orders** | Order pipeline with status breakdown |

## Connecting Amazon SP-API

1. Copy `.env.local.example` → `.env.local`
2. Fill in all `AMAZON_*` variables (see README below for step-by-step)
3. Switch mock data to live SP-API calls in inventory/listings pages
4. SP-API client is in `lib/amazon-sp-api.ts` — handles LWA auth + AWS SigV4 signing

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat&logo=vercel)

---

## Features

- **Authentication** — Email/password login via NextAuth.js with JWT sessions and protected routes via middleware
- **Role-based access control** — Admin, Manager, and Viewer roles with per-action permission guards on both API routes and UI
- **Analytics dashboard** — Revenue trend (area chart), orders by status (donut chart), top products by revenue (bar chart)
- **Full CRUD** — Orders, Products, and Customers with search, pagination, create/edit modals, and delete confirmation
- **User management** — Admin-only panel to create users, change roles, and remove accounts
- **REST API** — Typed API routes with Zod validation and role-checked endpoints for every entity
- **Vercel-ready** — Deploys to Vercel with Neon Postgres in one click

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon / Vercel Postgres) |
| ORM | Prisma |
| Auth | NextAuth.js (credentials + JWT) |
| Charts | Recharts |
| Validation | Zod |
| Deploy | Vercel |

---

## Screenshots

> Login → Dashboard → Orders → Products → Customers → Users (Admin only)

---

## Role permissions

| Action | Admin | Manager | Viewer |
|---|---|---|---|
| View all data | ✅ | ✅ | ✅ |
| Create / edit records | ✅ | ✅ | ❌ |
| Delete records | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

---

## Local setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Clone & install

```bash
git clone https://github.com/rapidoodle/saas-dashboard.git
cd saas-dashboard
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/saas_dashboard"
NEXTAUTH_SECRET="your-secret"   # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
createdb saas_dashboard
npm run db:push    # push schema
npm run db:seed    # seed demo data
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Viewer | viewer@example.com | viewer123 |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add **Vercel Postgres** from the Storage tab
4. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Project Settings → Environment Variables
5. Deploy

After first deploy, seed the production database:

```bash
DATABASE_URL="<your-neon-url>" npm run db:seed
```

---

## Project structure

```
app/
  (auth)/login/            # Login page
  (dashboard)/
    dashboard/             # Daily Review — KPIs, revenue chart, DR checklist
    inventory/             # FBA inventory table + restock alerts
    listings/              # Listings health + review monitoring
    orders/                # Order management
    products/              # Product management
    customers/             # Customer management
    users/                 # User management (Admin only)
  api/
    amazon/
      sales/               # SP-API Sales & Traffic
      inventory/           # SP-API FBA Inventory
      listings/            # SP-API Listings Items
    ...                    # Standard CRUD routes
components/
  charts/                  # Recharts wrappers (Amazon-themed)
  dashboard/               # StatCard, DailyReviewAlert
  inventory/               # InventoryTable, InventoryAlerts
  listings/                # ListingsTable, ReviewSummary
  layout/                  # Sidebar (Amazon branding), Header
  ui/                      # Button, Input, Modal, Badge, Skeleton
lib/
  amazon-sp-api.ts         # SP-API client (LWA auth + AWS SigV4)
  auth.ts                  # NextAuth config
  db.ts                    # Prisma client singleton
  permissions.ts           # RBAC permission map
prisma/
  schema.prisma            # Database schema
  seed.ts                  # Demo seed data
```

---

## Author

**Ralfh Bryan Perez** — [github.com/rapidoodle](https://github.com/rapidoodle)
