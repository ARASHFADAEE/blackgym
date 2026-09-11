import { NextResponse } from "next/server";
import { notifyExpiringMemberships } from "@/features/notifications/jobs";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ message: "غیرمجاز" }, { status: 401 });
    }
  }

  const result = await notifyExpiringMemberships(7);
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: Request) {
  return POST(request);
}
