"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Listing {
  asin: string;
  title: string;
  rating: number;
  reviewCount: number;
  recentReviews: { rating: number; date: string; snippet: string }[];
}

export function ReviewSummary({ listings }: { listings: Listing[] }) {
  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star: `${star}★`,
    count: listings.flatMap((l) => l.recentReviews).filter((r) => r.rating === star).length,
  }));

  // Recent negative reviews for attention
  const negatives = listings
    .flatMap((l) =>
      l.recentReviews
        .filter((r) => r.rating <= 2)
        .map((r) => ({ ...r, asin: l.asin, title: l.title }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const starColors = ["#22C55E", "#86EFAC", "#FCD34D", "#FB923C", "#EF4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Rating distribution */}
      <div className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Review Distribution</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dist} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="star"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #37475A",
                backgroundColor: "#232F3E",
                color: "#fff",
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {dist.map((_, i) => (
                <Cell key={i} fill={starColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Negative reviews needing attention */}
      <div className="bg-amazon-navy-mid rounded-xl border border-amazon-navy-light p-6">
        <h3 className="text-base font-semibold text-white mb-4">Reviews Needing Attention</h3>
        {negatives.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-green-400">
            <svg className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">No negative reviews recently</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-44 overflow-y-auto scrollbar-hide pr-1">
            {negatives.map((r, i) => (
              <div key={i} className="border border-red-900/50 bg-red-900/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-400">{r.asin}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`h-3 w-3 ${s <= r.rating ? "text-amazon-orange" : "text-gray-600"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">{r.snippet}</p>
                <p className="text-xs text-gray-500 mt-1">{r.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
