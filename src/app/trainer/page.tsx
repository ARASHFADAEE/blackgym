import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { listTrainerAthletes } from "@/features/workouts/service";
import { createPlanAction, publishPlanAction, updateBookingStatusAction } from "@/features/trainer/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toPersianDigits } from "@/lib/utils";
import Link from "next/link";

export default async function TrainerDashboardPage() {
  const session = await auth();
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) {
    return <p className="text-muted-foreground">پروفایل مربی برای این حساب تعریف نشده است.</p>;
  }

  const athletes = await listTrainerAthletes(profile.id);
  const since = new Date();
  since.setDate(since.getDate() - 1);
  const bookings = await prisma.booking.findMany({
    where: {
      trainerId: profile.id,
      startsAt: { gte: since },
    },
    include: { athlete: { include: { user: true } }, branch: true },
    orderBy: { startsAt: "asc" },
    take: 10,
  });
  const plans = await prisma.workoutPlan.findMany({
    where: { trainerId: profile.id },
    include: { athlete: { include: { user: true } } },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">داشبورد مربی</h1>
        <p className="text-muted-foreground">
          {toPersianDigits(athletes.length)} ورزشکار تحت نظر شما
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">ورزشکاران</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{toPersianDigits(athletes.length)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">رزروهای پیش‌رو</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{toPersianDigits(bookings.length)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">برنامه‌ها</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{toPersianDigits(plans.length)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ورزشکاران من</CardTitle>
          <Button asChild variant="link" size="sm">
            <Link href="/trainer/athletes">همه</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {athletes.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <p className="font-medium">{a.user.name}</p>
                <p className="text-xs text-muted-foreground">{a.goal ?? "بدون هدف ثبت‌شده"}</p>
              </div>
              <form action={createPlanAction} className="flex gap-2">
                <input type="hidden" name="athleteId" value={a.id} />
                <Input name="title" placeholder="عنوان برنامه" className="w-40" defaultValue="برنامه جدید" />
                <Button type="submit" size="sm">
                  ساخت برنامه
                </Button>
              </form>
            </div>
          ))}
          {!athletes.length ? <p className="text-muted-foreground">ورزشکاری اختصاص نیافته.</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>برنامه‌های تمرینی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {p.athlete.user.name} · {p.status}
                </p>
              </div>
              {p.status === "DRAFT" ? (
                <form action={publishPlanAction}>
                  <input type="hidden" name="planId" value={p.id} />
                  <Button type="submit" size="sm">
                    انتشار
                  </Button>
                </form>
              ) : (
                <span className="text-xs text-primary">منتشر شده</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>رزروهای تمرین شخصی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{b.athlete.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatJalaliDateTime(b.startsAt)} · {b.branch.name} · {b.status}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={updateBookingStatusAction}>
                  <input type="hidden" name="bookingId" value={b.id} />
                  <input type="hidden" name="status" value="COMPLETED" />
                  <Button type="submit" size="sm" variant="outline">
                    تکمیل
                  </Button>
                </form>
                <form action={updateBookingStatusAction}>
                  <input type="hidden" name="bookingId" value={b.id} />
                  <input type="hidden" name="status" value="CANCELLED" />
                  <Button type="submit" size="sm" variant="ghost">
                    لغو
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
