import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFbaInventory } from "@/lib/amazon-sp-api";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const skusParam = req.nextUrl.searchParams.get("skus");
  const skus = skusParam ? skusParam.split(",") : undefined;

  try {
    const data = await getFbaInventory(skus);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/amazon/inventory]", err);
    return NextResponse.json(
      { error: "Failed to fetch inventory", detail: String(err) },
      { status: 502 }
    );
  }
}
