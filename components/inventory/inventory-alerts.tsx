"use client";

interface InventoryItem {
  sku: string;
  productName: string;
  status: "OK" | "LOW" | "OUT";
  daysOfSupply: number;
  fulfillableQty: number;
}

export function InventoryAlerts({ items }: { items: InventoryItem[] }) {
  const critical = items.filter((i) => i.status === "OUT");
  const low = items.filter((i) => i.status === "LOW");

  if (!critical.length && !low.length) return null;

  return (
    <div className="space-y-3">
      {critical.map((item) => (
        <div
          key={item.sku}
          className="flex items-start gap-3 rounded-lg border border-red-700 bg-red-900/20 px-4 py-3"
        >
          <svg
            className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-300">Out of Stock — {item.sku}</p>
            <p className="text-xs text-red-400 mt-0.5">{item.productName}</p>
          </div>
          <span className="ml-auto text-xs font-medium text-red-300 whitespace-nowrap">
            0 units
          </span>
        </div>
      ))}
      {low.map((item) => (
        <div
          key={item.sku}
          className="flex items-start gap-3 rounded-lg border border-yellow-700 bg-yellow-900/20 px-4 py-3"
        >
          <svg
            className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-yellow-300">
              Low Stock — {item.sku} ({item.daysOfSupply} days remaining)
            </p>
            <p className="text-xs text-yellow-400 mt-0.5">{item.productName}</p>
          </div>
          <span className="ml-auto text-xs font-medium text-yellow-300 whitespace-nowrap">
            {item.fulfillableQty} units
          </span>
        </div>
      ))}
    </div>
  );
}
