import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStoreByDomain } from "../../../lib/store-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeParam = searchParams.get("store");
  const headerList = headers();
  const host =
    storeParam ??
    (await headerList).get("x-store-slug") ??
    (await headerList).get("x-forwarded-host") ??
    (await headerList).get("host");

  const storePayload = await getStoreByDomain(host);

  return NextResponse.json(storePayload);
}
