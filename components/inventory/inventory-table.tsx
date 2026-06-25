"use client";

export interface InventoryItem {
  sku: string;
  asin: string;
  productName: string;
  fulfillableQty: number;
  inboundQty: number;
  reservedQty: number;
  unfulfillableQty: number;
  daysOfSupply: number;
  restockLevel: number;
  status: "OK" | "LOW" | "OUT";
}

const statusBadge: Record<string, string> = {
  OK: "bg-green-900/40 text-green-400 border border-green-700",
  LOW: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
  OUT: "bg-red-900/40 text-red-400 border border-red-700",
};

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light overflow-hidden">
      <div className="px-6 py-4 border-b border-amazon-navy-light">
        <h3 className="text-base font-semibold text-white">FBA Inventory</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amazon-navy-light text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">SKU / ASIN</th>
              <th className="px-6 py-3 text-left font-medium">Product</th>
              <th className="px-6 py-3 text-right font-medium">Fulfillable</th>
              <th className="px-6 py-3 text-right font-medium">Inbound</th>
              <th className="px-6 py-3 text-right font-medium">Reserved</th>
              <th className="px-6 py-3 text-right font-medium">Days Supply</th>
              <th className="px-6 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amazon-navy-light">
            {items.map((item) => (
              <tr
                key={item.sku}
                className="hover:bg-amazon-navy-light/30 transition-colors cursor-default"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{item.sku}</p>
                  <p className="text-xs text-gray-500 font-mono">{item.asin}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-200 max-w-xs truncate">{item.productName}</p>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-white">
                  {item.fulfillableQty.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-blue-400">
                  {item.inboundQty > 0 ? `+${item.inboundQty}` : "—"}
                </td>
                <td className="px-6 py-4 text-right text-gray-400">
                  {item.reservedQty > 0 ? item.reservedQty : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`font-medium ${
                      item.daysOfSupply === 0
                        ? "text-red-400"
                        : item.daysOfSupply <= 14
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.daysOfSupply === 0 ? "0" : item.daysOfSupply}d
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
