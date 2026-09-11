import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getActiveMembership } from "@/features/memberships/service";
import { getPublishedPlanForAthlete } from "@/features/workouts/service";
import { getAthleteEngagement } from "@/features/attendance/service";
import { calculateMemberHealthScore } from "@/features/retention/service";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CHURN_RISK_FA } from "@/lib/i18n/fa-labels";
import { toPersianDigits } from "@/lib/utils";

export default async function AthleteJourneyPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      athleteProfile: {
        include: { assignedTrainer: { include: { user: true } } },
      },
      notifications: { where: { isRead: false }, take: 4, orderBy: { createdAt: "desc" } },
    },
  });

  const profile = user?.athleteProfile;
  const [membership, plan, engagement, health, nextBooking] = await Promise.all([
    getActiveMembership(userId),
    profile ? getPublishedPlanForAthlete(profile.id) : null,
    getAthleteEngagement(userId),
    calculateMemberHealthScore(userId),
    profile
      ? prisma.booking.findFirst({
          where: {
            athleteId: profile.id,
            status: { in: ["PENDING", "CONFIRMED"] },
            startsAt: { gte: new Date() },
          },
          include: { trainer: { include: { user: true } }, branch: true },
          orderBy: { startsAt: "asc" },
        })
      : null,
  ]);

  const daysLeft = health.membershipDaysLeft;
  const weeklyGoal = 8;
  const weeklyProgress = Math.min(engagement.visitsThisWeek, weeklyGoal);
  const progressPct = Math.round((weeklyProgress / weeklyGoal) * 100);
  const dayOfWeek = ((new Date().getDay() + 1) % 7) + 1; // rough map
  const todayDay =
    plan?.days.find((d) => d.dayIndex === Math.min(dayOfWeek, plan.days.length)) ?? plan?.days[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          سلام {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">آماده تمرین امروز هستی؟</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">عضویت</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{membership?.plan.name ?? "ندارید"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {daysLeft != null ? `${toPersianDigits(daysLeft)} روز باقی‌مانده` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">استریک</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              🔥 {toPersianDigits(engagement.currentStreak)} روز پیاپی
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">هدف هفتگی</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">
              {toPersianDigits(weeklyProgress)} / {toPersianDigits(weeklyGoal)} جلسه
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">امتیاز سلامت</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">{toPersianDigits(health.score)}</p>
            <Badge className="mt-1" variant="outline">
              خطر ریزش: {CHURN_RISK_FA[health.churnRisk] ?? health.churnRisk}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>تمرین امروز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayDay ? (
              <>
                <p className="font-medium text-primary">{todayDay.title}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {todayDay.exercises.slice(0, 4).map((ex) => (
                    <li key={ex.id} className="flex justify-between border-b border-border pb-2">
                      <span>{ex.exercise.name}</span>
                      <span>
                        {toPersianDigits(ex.sets)}×{ex.reps}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline">
                  <Link href="/athlete/workouts">شروع تمرین</Link>
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">برنامه منتشرشده ندارید.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>جلسه بعدی / حضور</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextBooking ? (
              <div>
                <p className="text-lg font-bold">{nextBooking.trainer.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatJalaliDateTime(nextBooking.startsAt)} · {nextBooking.branch.name}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">رزرو آینده ندارید.</p>
            )}
            <p className="text-sm text-muted-foreground">
              حضور این هفته: {toPersianDigits(engagement.visitsThisWeek)} · ماه:{" "}
              {toPersianDigits(engagement.visitsThisMonth)}
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/athlete/attendance">چک‌این</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/athlete/bookings">رزرو تمرین شخصی</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>اعلان‌ها</CardTitle>
          <Button asChild variant="link" size="sm">
            <Link href="/athlete/notifications">همه</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {user?.notifications.length ? (
            <ul className="space-y-3">
              {user.notifications.map((n) => (
                <li key={n.id} className="rounded-xl border border-border p-3">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">اعلان جدیدی ندارید.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
