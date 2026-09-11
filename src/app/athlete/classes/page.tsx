import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { listUpcomingClassSchedules, listAthleteClassBookings } from "@/features/classes/service";
import { bookClassAction } from "@/features/athlete/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ENTITY_STATUS_FA } from "@/lib/i18n/fa-labels";
import { toPersianDigits } from "@/lib/utils";

export default async function AthleteClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return <p>پروفایل یافت نشد</p>;

  const [schedules, mine] = await Promise.all([
    listUpcomingClassSchedules(30),
    listAthleteClassBookings(profile.id),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">کلاس‌های گروهی</h1>
      {sp.booked ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          رزرو کلاس ثبت شد.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>جلسات پیش‌رو</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {schedules.map((s) => {
            const taken = s.bookings.length;
            const full = taken >= s.capacity;
            const already = s.bookings.some((b) => b.athleteId === profile.id);
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3"
              >
                <div>
                  <p className="font-bold">{s.fitnessClass.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatJalaliDateTime(s.startsAt)} · {s.fitnessClass.branch.name} ·{" "}
                    {s.fitnessClass.trainer.user.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ظرفیت {toPersianDigits(taken)}/{toPersianDigits(s.capacity)}
                  </p>
                </div>
                {already ? (
                  <Badge variant="outline">رزرو شده</Badge>
                ) : (
                  <form action={bookClassAction}>
                    <input type="hidden" name="scheduleId" value={s.id} />
                    <Button type="submit" size="sm" disabled={full}>
                      {full ? "تکمیل" : "رزرو"}
                    </Button>
                  </form>
                )}
              </div>
            );
          })}
          {!schedules.length ? (
            <p className="text-muted-foreground">جلسه کلاسی در آینده ثبت نشده.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>رزروهای من</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mine.map((b) => (
            <div key={b.id} className="flex justify-between text-sm">
              <span>
                {b.schedule.fitnessClass.title} · {formatJalaliDateTime(b.schedule.startsAt)}
              </span>
              <Badge variant="outline">{ENTITY_STATUS_FA[b.status] ?? b.status}</Badge>
            </div>
          ))}
          {!mine.length ? <p className="text-muted-foreground">هنوز کلاسی رزرو نکرده‌اید.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
