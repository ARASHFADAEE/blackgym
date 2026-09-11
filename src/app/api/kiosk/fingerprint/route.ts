import { NextResponse } from "next/server";
import { checkInByFingerprint } from "@/features/attendance/kiosk";

/**
 * API دستگاه گیشه اثرانگشت
 * بدنه: { deviceTemplateId, branchId }
 * دستگاه واقعی فقط شناسه قالب را می‌فرستد؛ داده خام بیومتریک ذخیره نمی‌شود.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceTemplateId = String(body.deviceTemplateId ?? "");
    const branchId = String(body.branchId ?? "");
    if (!deviceTemplateId || !branchId) {
      return NextResponse.json({ message: "شناسه قالب و شعبه الزامی است" }, { status: 400 });
    }

    const result = await checkInByFingerprint({ deviceTemplateId, branchId });
    const verb = result.action === "checkin" ? "ورود" : "خروج";
    return NextResponse.json({
      ok: true,
      action: result.action,
      message: `${verb} ${result.user.name} با اثرانگشت ثبت شد`,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "خطا" },
      { status: 400 },
    );
  }
}
