# SaaSBoard — E-commerce Analytics Dashboard

A full-stack SaaS dashboard built with **Next.js 14 (App Router)**, **PostgreSQL (Neon/Vercel Postgres)**, **Prisma ORM**, **NextAuth.js**, and **Recharts**.

## Features

- **Authentication** — Email/password login via NextAuth.js with JWT sessions
- **Role-based access** — Admin, Manager, and Viewer roles with fine-grained permissions
- **Dashboard** — Revenue trend, orders by status (donut), top products (bar chart)
- **CRUD** — Full create/edit/delete for Orders, Products, and Customers
- **Pagination & search** on all list views
- **Vercel-ready** — One-click deploy with Vercel Postgres

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your Postgres connection strings and generate a `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Push schema & seed

```bash
npm run db:push      # push schema to Postgres
npm run db:seed      # seed demo data
```

### 4. Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Demo accounts

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@example.com       | admin123    |
| Manager | manager@example.com     | manager123  |
| Viewer  | viewer@example.com      | viewer123   |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import it in [vercel.com/new](https://vercel.com/new)
3. Add **Vercel Postgres** from the Storage tab — the `POSTGRES_*` env vars are automatically injected
4. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (your production URL) in Project Settings → Environment Variables
5. Deploy — Vercel runs `prisma migrate deploy && next build` automatically

After first deploy, run the seed from your local machine against the production DB:

```bash
POSTGRES_PRISMA_URL="..." POSTGRES_URL_NON_POOLING="..." npm run db:seed
```

---

## Project structure

```
app/
  (auth)/login/          # Login page
  (dashboard)/
    dashboard/           # Analytics + charts
    orders/              # Order management
    products/            # Product management
    customers/           # Customer management
    users/               # User management (Admin only)
  api/                   # REST API routes
components/
  charts/                # Recharts wrappers
  layout/                # Sidebar, Header
  ui/                    # Button, Input, Modal, Badge
lib/
  auth.ts                # NextAuth config
  db.ts                  # Prisma client singleton
  permissions.ts         # RBAC permission map
prisma/
  schema.prisma          # Database schema
  seed.ts                # Demo data seed
```

## Role permissions

| Action         | Admin | Manager | Viewer |
|----------------|-------|---------|--------|
| View all data  | ✅    | ✅      | ✅     |
| Create/edit    | ✅    | ✅      | ❌     |
| Delete         | ✅    | ❌      | ❌     |
| Manage users   | ✅    | ❌      | ❌     |
