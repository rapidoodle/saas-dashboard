import { Header } from "@/components/layout/header";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryAlerts } from "@/components/inventory/inventory-alerts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Seed data — replaced with SP-API data once AMAZON_* env vars are configured
const mockInventory = [
  {
    sku: "SKU-001",
    asin: "B08XYZ1234",
    productName: "Premium Wireless Headphones - Black",
    fulfillableQty: 142,
    inboundQty: 50,
    reservedQty: 12,
    unfulfillableQty: 3,
    daysOfSupply: 28,
    restockLevel: 100,
    status: "OK" as const,
  },
  {
    sku: "SKU-002",
    asin: "B08XYZ5678",
    productName: "Bluetooth Speaker - Portable",
    fulfillableQty: 18,
    inboundQty: 0,
    reservedQty: 5,
    unfulfillableQty: 0,
    daysOfSupply: 7,
    restockLevel: 50,
    status: "LOW" as const,
  },
  {
    sku: "SKU-003",
    asin: "B08XYZ9012",
    productName: "USB-C Charging Cable 6ft",
    fulfillableQty: 0,
    inboundQty: 200,
    reservedQty: 0,
    unfulfillableQty: 0,
    daysOfSupply: 0,
    restockLevel: 200,
    status: "OUT" as const,
  },
  {
    sku: "SKU-004",
    asin: "B08XYZ3456",
    productName: "Phone Stand Adjustable Aluminum",
    fulfillableQty: 320,
    inboundQty: 0,
    reservedQty: 24,
    unfulfillableQty: 1,
    daysOfSupply: 62,
    restockLevel: 150,
    status: "OK" as const,
  },
  {
    sku: "SKU-005",
    asin: "B08XYZ7890",
    productName: "Screen Protector Tempered Glass 3-Pack",
    fulfillableQty: 45,
    inboundQty: 100,
    reservedQty: 8,
    unfulfillableQty: 5,
    daysOfSupply: 14,
    restockLevel: 80,
    status: "LOW" as const,
  },
  {
    sku: "SKU-006",
    asin: "B09ABC1234",
    productName: "Laptop Sleeve 15-inch Neoprene",
    fulfillableQty: 87,
    inboundQty: 0,
    reservedQty: 3,
    unfulfillableQty: 0,
    daysOfSupply: 45,
    restockLevel: 60,
    status: "OK" as const,
  },
  {
    sku: "SKU-007",
    asin: "B09ABC5678",
    productName: "Mechanical Keyboard TKL RGB",
    fulfillableQty: 5,
    inboundQty: 30,
    reservedQty: 2,
    unfulfillableQty: 0,
    daysOfSupply: 3,
    restockLevel: 40,
    status: "LOW" as const,
  },
];

export default async function InventoryPage() {
  await getServerSession(authOptions);

  const totalFulfillable = mockInventory.reduce((s, i) => s + i.fulfillableQty, 0);
  const totalInbound = mockInventory.reduce((s, i) => s + i.inboundQty, 0);
  const lowStockCount = mockInventory.filter((i) => i.status === "LOW").length;
  const outOfStockCount = mockInventory.filter((i) => i.status === "OUT").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Inventory" subtitle="FBA stock levels & restock alerts" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Fulfillable Units",
              value: totalFulfillable.toLocaleString(),
              color: "text-green-400",
            },
            {
              label: "Inbound Units",
              value: totalInbound.toLocaleString(),
              color: "text-blue-400",
            },
            {
              label: "Low Stock SKUs",
              value: lowStockCount,
              color: "text-yellow-400",
            },
            {
              label: "Out of Stock SKUs",
              value: outOfStockCount,
              color: "text-red-400",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light p-5"
            >
              <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <InventoryAlerts items={mockInventory} />

        {/* Table */}
        <InventoryTable items={mockInventory} />
      </main>
    </div>
  );
}
