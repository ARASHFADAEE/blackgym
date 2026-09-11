import { NextRequest, NextResponse } from "next/server";
import { activateMembershipFromPayment } from "@/features/memberships/service";

export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority");
  const status = request.nextUrl.searchParams.get("Status");
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!authority || status !== "OK") {
    return NextResponse.redirect(`${base}/athlete/membership?payment=failed`);
  }

  const result = await activateMembershipFromPayment(authority);
  if (!result.success) {
    return NextResponse.redirect(`${base}/athlete/membership?payment=failed`);
  }

  return NextResponse.redirect(`${base}/athlete/membership?payment=success`);
}
