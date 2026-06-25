import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesAndTraffic } from "@/lib/amazon-sp-api";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const days = Number(searchParams.get("days") ?? "30");
  const granularity = (searchParams.get("granularity") ?? "DAY") as "DAY" | "WEEK" | "MONTH";

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 86_400_000).toISOString().split("T")[0];

  try {
    const data = await getSalesAndTraffic(startDate, endDate, granularity);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/amazon/sales]", err);
    return NextResponse.json(
      { error: "Failed to fetch sales data", detail: String(err) },
      { status: 502 }
    );
  }
}
