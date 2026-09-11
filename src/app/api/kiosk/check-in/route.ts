import { NextResponse } from "next/server";
import { checkInByCode } from "@/features/attendance/kiosk";
import type { AttendanceSource } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code ?? "");
    const branchId = String(body.branchId ?? "");
    const source = (body.source as AttendanceSource) || "QR";
    if (!code || !branchId) {
      return NextResponse.json({ message: "کد و شعبه الزامی است" }, { status: 400 });
    }

    const result = await checkInByCode({ code, branchId, source });
    const verb = result.action === "checkin" ? "ورود" : "خروج";
    return NextResponse.json({
      ok: true,
      action: result.action,
      message: `${verb} ${result.user.name} ثبت شد`,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "خطا" },
      { status: 400 },
    );
  }
}
