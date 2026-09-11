import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getAthleteEngagement } from "@/features/attendance/service";
import { ensureAttendanceCode } from "@/features/attendance/kiosk";
import { athleteCheckInAction, athleteCheckOutAction } from "@/features/admin/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ATTENDANCE_SOURCE_FA } from "@/lib/i18n/fa-labels";
import { toPersianDigits } from "@/lib/utils";

export default async function AthleteAttendancePage() {
  const session = await auth();
  const userId = session!.user.id;
  const code = await ensureAttendanceCode(userId);
  const [branches, engagement, history, open] = await Promise.all([
    prisma.branch.findMany({ where: { status: "ACTIVE" } }),
    getAthleteEngagement(userId),
    prisma.attendance.findMany({
      where: { userId },
      include: { branch: true },
      orderBy: { checkedInAt: "desc" },
      take: 20,
    }),
    prisma.attendance.findFirst({
      where: { userId, checkedOutAt: null },
      include: { branch: true },
    }),
  ]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">حضور من</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">استریک</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">
            🔥 {toPersianDigits(engagement.currentStreak)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">این هفته</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">
            {toPersianDigits(engagement.visitsThisWeek)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">این ماه</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">
            {toPersianDigits(engagement.visitsThisMonth)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>کد ورود QR</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="کد QR حضور" width={160} height={160} className="rounded-xl bg-white p-2" />
          <div>
            <p className="text-sm text-muted-foreground">
              این کد را در گیشه یا صفحه پذیرش اسکن/وارد کنید. نیازی به گوشی روشن برای اثرانگشت نیست —
              برای QR کافی است.
            </p>
            <p className="mt-3 font-mono text-3xl font-black tracking-[0.3em]" dir="ltr">
              {code}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{open ? "خروج از باشگاه" : "چک‌این"}</CardTitle>
        </CardHeader>
        <CardContent>
          {open ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                حضور باز در {open.branch.name} از {formatJalaliDateTime(open.checkedInAt)}
              </p>
              <form action={athleteCheckOutAction}>
                <Button type="submit">ثبت خروج</Button>
              </form>
            </div>
          ) : (
            <form action={athleteCheckInAction} className="flex flex-col gap-3 sm:flex-row">
              <select
                name="branchId"
                required
                className="h-10 flex-1 rounded-lg border border-border bg-secondary px-3 text-sm"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <Button type="submit">ثبت ورود</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تاریخچه حضور</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="flex justify-between text-sm border-b border-border pb-2">
              <span>{h.branch.name}</span>
              <span className="text-muted-foreground">
                {formatJalaliDateTime(h.checkedInAt)} ·{" "}
                {ATTENDANCE_SOURCE_FA[h.source] ?? h.source}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
