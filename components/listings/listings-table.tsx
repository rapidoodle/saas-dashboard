"use client";

type ListingStatus = "ACTIVE" | "INACTIVE" | "SUPPRESSED" | "INCOMPLETE";

interface Listing {
  sku: string;
  asin: string;
  title: string;
  status: ListingStatus;
  price: number;
  rating: number;
  reviewCount: number;
  issues: string[];
  buyBox: boolean;
}

const statusStyle: Record<ListingStatus, string> = {
  ACTIVE: "bg-green-900/40 text-green-400 border border-green-700",
  INACTIVE: "bg-gray-800 text-gray-400 border border-gray-600",
  SUPPRESSED: "bg-red-900/40 text-red-400 border border-red-700",
  INCOMPLETE: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "text-amazon-orange" : "text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ListingsTable({ listings }: { listings: Listing[] }) {
  return (
    <div className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light overflow-hidden">
      <div className="px-6 py-4 border-b border-amazon-navy-light">
        <h3 className="text-base font-semibold text-white">All Listings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amazon-navy-light text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">SKU / ASIN</th>
              <th className="px-6 py-3 text-left font-medium">Title</th>
              <th className="px-6 py-3 text-right font-medium">Price</th>
              <th className="px-6 py-3 text-left font-medium">Rating</th>
              <th className="px-6 py-3 text-center font-medium">Buy Box</th>
              <th className="px-6 py-3 text-center font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amazon-navy-light">
            {listings.map((listing) => (
              <tr
                key={listing.sku}
                className="hover:bg-amazon-navy-light/30 transition-colors cursor-default"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{listing.sku}</p>
                  <p className="text-xs text-gray-500 font-mono">{listing.asin}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-200 max-w-xs truncate" title={listing.title}>
                    {listing.title}
                  </p>
                  <p className="text-xs text-gray-500">{listing.reviewCount.toLocaleString()} reviews</p>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-white">
                  ${listing.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <StarRating rating={listing.rating} />
                </td>
                <td className="px-6 py-4 text-center">
                  {listing.buyBox ? (
                    <svg className="h-5 w-5 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[listing.status]}`}
                  >
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {listing.issues.length > 0 ? (
                    <ul className="space-y-1">
                      {listing.issues.map((issue) => (
                        <li key={issue} className="text-xs text-red-400 flex items-start gap-1">
                          <span className="mt-0.5 flex-shrink-0">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
