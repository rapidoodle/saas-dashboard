/**
 * Amazon Selling Partner API (SP-API) client
 *
 * Handles LWA (Login with Amazon) token refresh and signs requests with
 * AWS Signature Version 4 — no extra SDK dependencies required.
 *
 * Required env vars (see .env.local.example):
 *   AMAZON_CLIENT_ID
 *   AMAZON_CLIENT_SECRET
 *   AMAZON_REFRESH_TOKEN
 *   AMAZON_AWS_ACCESS_KEY
 *   AMAZON_AWS_SECRET_KEY
 *   AMAZON_MARKETPLACE_ID   (e.g. ATVPDKIKX0DER for US)
 *   AMAZON_SELLER_ID
 */

import crypto from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SalesSummary {
  date: string;
  orderedProductSales: { amount: number; currencyCode: string };
  orderedProductSalesB2B: { amount: number; currencyCode: string };
  unitsOrdered: number;
  unitsOrderedB2B: number;
  totalOrderItems: number;
  totalOrderItemsB2B: number;
  averageSalesPerOrderItem: { amount: number; currencyCode: string };
  averageUnitsPerOrderItem: number;
  averageSellingPrice: { amount: number; currencyCode: string };
  unitsRefunded: number;
  refundRate: number;
  claimsGranted: number;
  claimsAmount: { amount: number; currencyCode: string };
  shippedProductSales: { amount: number; currencyCode: string };
  unitsShipped: number;
  ordersShipped: number;
  browserSessions: number;
  mobileAppSessions: number;
  sessions: number;
  browserSessionPercentage: number;
  mobileAppSessionPercentage: number;
  sessionPercentage: number;
  browserPageViews: number;
  mobileAppPageViews: number;
  pageViews: number;
  browserPageViewsPercentage: number;
  mobileAppPageViewsPercentage: number;
  pageViewsPercentage: number;
  buyBoxPercentage: number;
  orderItemSessionPercentage: number;
  unitSessionPercentage: number;
}

export interface InventoryItem {
  asin: string;
  fnSku: string;
  sellerSku: string;
  condition: string;
  inventoryDetails: {
    fulfillableQuantity: number;
    inboundWorkingQuantity: number;
    inboundShippedQuantity: number;
    inboundReceivingQuantity: number;
    reservedQuantity: {
      totalReservedQuantity: number;
      pendingCustomerOrderQuantity: number;
      pendingTransshipmentQuantity: number;
      fcProcessingQuantity: number;
    };
    researchingQuantity: { totalResearchingQuantity: number };
    unfulfillableQuantity: {
      totalUnfulfillableQuantity: number;
      customerDamagedQuantity: number;
      warehouseDamagedQuantity: number;
      distributorDamagedQuantity: number;
      carrierDamagedQuantity: number;
      defectiveQuantity: number;
      expiredQuantity: number;
    };
  };
  lastUpdatedTime: string;
  productName: string;
  totalQuantity: number;
}

export interface ListingItem {
  sku: string;
  asin: string;
  status: "ACTIVE" | "INACTIVE" | "INCOMPLETE" | "SUPPRESSED";
  submittedAt: string;
  attributes: Record<string, unknown>;
  issues: Array<{
    code: string;
    message: string;
    severity: "ERROR" | "WARNING" | "INFO";
    attributeNames?: string[];
  }>;
  summaries: Array<{
    marketplaceId: string;
    adultProduct: boolean;
    autoBranded: boolean;
    brandName?: string;
    browseNode?: string;
    color?: string;
    itemName: string;
    itemClassification: string;
    listingDate: string;
    mainImage?: { link: string; height: number; width: number };
    price?: { amount: number; currencyCode: string };
  }>;
}

export interface AmazonOrder {
  amazonOrderId: string;
  purchaseDate: string;
  lastUpdateDate: string;
  orderStatus: string;
  fulfillmentChannel: string;
  salesChannel: string;
  orderTotal?: { currencyCode: string; amount: string };
  numberOfItemsShipped: number;
  numberOfItemsUnshipped: number;
  paymentMethod: string;
  marketplaceId: string;
  shipmentServiceLevelCategory: string;
  orderType: string;
  buyerInfo: { buyerEmail?: string };
}

// ─── Token cache ──────────────────────────────────────────────────────────────

let _accessToken: string | null = null;
let _tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (_accessToken && Date.now() < _tokenExpiresAt - 30_000) return _accessToken;

  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.AMAZON_REFRESH_TOKEN!,
      client_id: process.env.AMAZON_CLIENT_ID!,
      client_secret: process.env.AMAZON_CLIENT_SECRET!,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LWA token refresh failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  _accessToken = data.access_token as string;
  _tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return _accessToken;
}

// ─── AWS Signature V4 ─────────────────────────────────────────────────────────

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function hash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function signRequest(
  method: string,
  url: URL,
  body: string,
  accessToken: string
): Record<string, string> {
  const region = process.env.AMAZON_AWS_REGION ?? "us-east-1";
  const service = "execute-api";
  const accessKey = process.env.AMAZON_AWS_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_AWS_SECRET_KEY!;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const canonicalUri = url.pathname;
  const canonicalQueryString = Array.from(url.searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const payloadHash = hash(body);
  const canonicalHeaders =
    `host:${url.host}\n` +
    `x-amz-access-token:${accessToken}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-access-token;x-amz-date";

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hash(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${secretKey}`, dateStamp), region), service),
    "aws4_request"
  );
  const signature = hmac(signingKey, stringToSign).toString("hex");

  return {
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    "x-amz-access-token": accessToken,
    "x-amz-date": amzDate,
    "content-type": "application/json",
  };
}

// ─── Base request ─────────────────────────────────────────────────────────────

const BASE = "https://sellingpartnerapi-na.amazon.com";

async function spRequest<T>(
  path: string,
  params: Record<string, string> = {},
  method = "GET",
  body = ""
): Promise<T> {
  const accessToken = await getAccessToken();
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers = signRequest(method, url, body, accessToken);

  const res = await fetch(url.toString(), { method, headers, body: body || undefined });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SP-API ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Public API helpers ───────────────────────────────────────────────────────

const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID ?? "ATVPDKIKX0DER";

/**
 * Sales & Traffic summary for a date range (Sales & Traffic API).
 * granularity: DAY | WEEK | MONTH
 */
export async function getSalesAndTraffic(
  startDate: string,
  endDate: string,
  granularity: "DAY" | "WEEK" | "MONTH" = "DAY"
): Promise<{ salesAndTrafficByDate: SalesSummary[] }> {
  const data = await spRequest<{ payload: { salesAndTrafficByDate: SalesSummary[] } }>(
    "/reports/2021-06-30/reports",
    {},
    "POST",
    JSON.stringify({
      reportType: "GET_SALES_AND_TRAFFIC_REPORT",
      dataStartTime: startDate,
      dataEndTime: endDate,
      marketplaceIds: [MARKETPLACE_ID],
    })
  );
  return data.payload;
}

/**
 * FBA inventory summary (Fulfillment Inbound API v2024).
 */
export async function getFbaInventory(
  skus?: string[]
): Promise<{ inventorySummaries: InventoryItem[] }> {
  const params: Record<string, string> = {
    granularityType: "Marketplace",
    granularityId: MARKETPLACE_ID,
    marketplaceIds: MARKETPLACE_ID,
  };
  if (skus?.length) params.sellerSkus = skus.join(",");

  const data = await spRequest<{
    payload: { inventorySummaries: InventoryItem[] };
  }>("/fba/inventory/v1/summaries", params);
  return data.payload;
}

/**
 * Listings items for the seller (Listings Items API 2021-08-01).
 */
export async function getListings(
  pageSize = 20
): Promise<{ items: ListingItem[]; pagination?: { nextToken?: string } }> {
  const sellerId = process.env.AMAZON_SELLER_ID!;
  const data = await spRequest<{
    items: ListingItem[];
    pagination?: { nextToken?: string };
  }>(`/listings/2021-08-01/items/${sellerId}`, {
    marketplaceIds: MARKETPLACE_ID,
    pageSize: String(pageSize),
    includedData: "summaries,attributes,issues",
  });
  return data;
}

/**
 * Recent orders (Orders API v0).
 */
export async function getOrders(
  daysBack = 7
): Promise<{ orders: AmazonOrder[] }> {
  const created = new Date(Date.now() - daysBack * 86_400_000).toISOString();
  const data = await spRequest<{ payload: { orders: AmazonOrder[] } }>(
    "/orders/v0/orders",
    {
      MarketplaceIds: MARKETPLACE_ID,
      CreatedAfter: created,
    }
  );
  return { orders: data.payload.orders };
}

/**
 * Product reviews via SP-API (Seller Feedback / Product Reviews API).
 * Returns mock data structure — wire to your preferred review aggregator.
 */
export async function getProductFeedback(): Promise<
  Array<{ rating: number; count: number; date: string }>
> {
  // SP-API doesn't expose per-product reviews directly; use
  // GET_SELLER_FEEDBACK_RATING report as an approximation.
  const data = await spRequest<{ payload: { feedbackList: unknown[] } }>(
    "/seller-feedback/2021-06-30/ratings",
    { marketplaceId: MARKETPLACE_ID }
  );
  return data.payload.feedbackList as Array<{
    rating: number;
    count: number;
    date: string;
  }>;
}
