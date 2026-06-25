import { Header } from "@/components/layout/header";
import { ListingsTable } from "@/components/listings/listings-table";
import { ReviewSummary } from "@/components/listings/review-summary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ListingStatus = "ACTIVE" | "INACTIVE" | "SUPPRESSED" | "INCOMPLETE";

interface MockListing {
  sku: string;
  asin: string;
  title: string;
  status: ListingStatus;
  price: number;
  rating: number;
  reviewCount: number;
  recentReviews: { rating: number; date: string; snippet: string }[];
  issues: string[];
  buyBox: boolean;
  imageUrl?: string;
}

// Mock data — swap with SP-API getListings() once env vars are set
const mockListings: MockListing[] = [
  {
    sku: "SKU-001",
    asin: "B08XYZ1234",
    title: "Premium Wireless Headphones - Black",
    status: "ACTIVE",
    price: 49.99,
    rating: 4.5,
    reviewCount: 1243,
    recentReviews: [
      { rating: 5, date: "2026-06-24", snippet: "Amazing sound quality, very comfortable." },
      { rating: 4, date: "2026-06-23", snippet: "Great product but packaging was a bit damaged." },
    ],
    issues: [],
    buyBox: true,
  },
  {
    sku: "SKU-002",
    asin: "B08XYZ5678",
    title: "Bluetooth Speaker - Portable",
    status: "ACTIVE",
    price: 29.95,
    rating: 4.2,
    reviewCount: 567,
    recentReviews: [
      { rating: 3, date: "2026-06-24", snippet: "Good but battery life could be better." },
    ],
    issues: [],
    buyBox: true,
  },
  {
    sku: "SKU-003",
    asin: "B08XYZ9012",
    title: "USB-C Charging Cable 6ft",
    status: "SUPPRESSED",
    price: 12.99,
    rating: 3.8,
    reviewCount: 2100,
    recentReviews: [
      { rating: 2, date: "2026-06-22", snippet: "Stopped working after 2 weeks." },
    ],
    issues: ["Missing safety compliance documentation", "Main image does not meet requirements"],
    buyBox: false,
  },
  {
    sku: "SKU-004",
    asin: "B08XYZ3456",
    title: "Phone Stand Adjustable Aluminum",
    status: "ACTIVE",
    price: 19.99,
    rating: 4.7,
    reviewCount: 892,
    recentReviews: [
      { rating: 5, date: "2026-06-24", snippet: "Perfect desk companion. Very sturdy." },
      { rating: 5, date: "2026-06-23", snippet: "Love the build quality and how stable it is." },
    ],
    issues: [],
    buyBox: true,
  },
  {
    sku: "SKU-005",
    asin: "B08XYZ7890",
    title: "Screen Protector Tempered Glass 3-Pack",
    status: "INCOMPLETE",
    price: 9.99,
    rating: 4.0,
    reviewCount: 345,
    recentReviews: [],
    issues: ["Bullet point 3 exceeds character limit"],
    buyBox: false,
  },
  {
    sku: "SKU-006",
    asin: "B09ABC1234",
    title: "Laptop Sleeve 15-inch Neoprene",
    status: "ACTIVE",
    price: 24.99,
    rating: 4.6,
    reviewCount: 478,
    recentReviews: [
      { rating: 5, date: "2026-06-23", snippet: "Perfect fit and excellent quality material." },
    ],
    issues: [],
    buyBox: true,
  },
  {
    sku: "SKU-007",
    asin: "B09ABC5678",
    title: "Mechanical Keyboard TKL RGB",
    status: "ACTIVE",
    price: 79.99,
    rating: 4.4,
    reviewCount: 156,
    recentReviews: [
      { rating: 1, date: "2026-06-24", snippet: "Keys started double-pressing after 1 week." },
    ],
    issues: [],
    buyBox: true,
  },
];

export default async function ListingsPage() {
  await getServerSession(authOptions);

  const active = mockListings.filter((l) => l.status === "ACTIVE").length;
  const suppressed = mockListings.filter((l) => l.status === "SUPPRESSED").length;
  const incomplete = mockListings.filter((l) => l.status === "INCOMPLETE").length;
  const avgRating =
    mockListings.reduce((s, l) => s + l.rating, 0) / mockListings.length;
  const negativeReviews = mockListings.flatMap((l) =>
    l.recentReviews.filter((r) => r.rating <= 2)
  ).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Listings & Reviews" subtitle="Listing health, suppression status, and recent reviews" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Active Listings", value: active, color: "text-green-400" },
            { label: "Suppressed", value: suppressed, color: "text-red-400" },
            { label: "Incomplete", value: incomplete, color: "text-yellow-400" },
            { label: "Avg Rating", value: avgRating.toFixed(1) + " ★", color: "text-amazon-orange" },
            { label: "Negative Reviews (24h)", value: negativeReviews, color: negativeReviews > 0 ? "text-red-400" : "text-green-400" },
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

        {/* Review summary chart */}
        <ReviewSummary listings={mockListings} />

        {/* Listings table */}
        <ListingsTable listings={mockListings} />
      </main>
    </div>
  );
}
