import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const managerPassword = await bcrypt.hash("manager123", 12);
  const viewerPassword = await bcrypt.hash("viewer123", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      name: "Manager User",
      email: "manager@example.com",
      password: managerPassword,
      role: Role.MANAGER,
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@example.com" },
    update: {},
    create: {
      name: "Viewer User",
      email: "viewer@example.com",
      password: viewerPassword,
      role: Role.VIEWER,
    },
  });

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: "prod_1" },
      update: {},
      create: {
        id: "prod_1",
        name: "Wireless Headphones",
        description: "Premium noise-cancelling headphones",
        price: 299.99,
        stock: 150,
        category: "Electronics",
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_2" },
      update: {},
      create: {
        id: "prod_2",
        name: "Ergonomic Chair",
        description: "Lumbar support office chair",
        price: 599.99,
        stock: 45,
        category: "Furniture",
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_3" },
      update: {},
      create: {
        id: "prod_3",
        name: "Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard",
        price: 149.99,
        stock: 200,
        category: "Electronics",
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_4" },
      update: {},
      create: {
        id: "prod_4",
        name: "Standing Desk",
        description: "Electric height-adjustable desk",
        price: 899.99,
        stock: 30,
        category: "Furniture",
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_5" },
      update: {},
      create: {
        id: "prod_5",
        name: "4K Monitor",
        description: "27-inch 4K IPS display",
        price: 449.99,
        stock: 80,
        category: "Electronics",
      },
    }),
  ]);

  // Create customers
  const customerData = [
    { id: "cust_1", name: "Alice Johnson", email: "alice@example.com", city: "New York", country: "US" },
    { id: "cust_2", name: "Bob Smith", email: "bob@example.com", city: "Los Angeles", country: "US" },
    { id: "cust_3", name: "Carol White", email: "carol@example.com", city: "Chicago", country: "US" },
    { id: "cust_4", name: "David Lee", email: "david@example.com", city: "Houston", country: "US" },
    { id: "cust_5", name: "Emma Davis", email: "emma@example.com", city: "Phoenix", country: "US" },
    { id: "cust_6", name: "Frank Miller", email: "frank@example.com", city: "London", country: "UK" },
    { id: "cust_7", name: "Grace Wilson", email: "grace@example.com", city: "Toronto", country: "CA" },
    { id: "cust_8", name: "Henry Moore", email: "henry@example.com", city: "Sydney", country: "AU" },
  ];

  const customers = await Promise.all(
    customerData.map((c) =>
      prisma.customer.upsert({
        where: { id: c.id },
        update: {},
        create: c,
      })
    )
  );

  // Create orders spread across the last 6 months
  const statuses = [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PROCESSING, OrderStatus.PENDING, OrderStatus.CANCELLED];
  const now = new Date();

  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    const total = product.price * qty;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.order.create({
      data: {
        customerId: customer.id,
        status,
        total,
        createdAt: date,
        updatedAt: date,
        items: {
          create: [{ productId: product.id, quantity: qty, price: product.price }],
        },
      },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
