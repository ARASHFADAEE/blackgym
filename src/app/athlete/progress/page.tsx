import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getAthleteProgress } from "@/features/progress/service";
import { addMeasurementAction } from "@/features/athlete/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toPersianDigits } from "@/lib/utils";
import { formatJalali } from "@/lib/dates/jalali";

export default async function AthleteProgressPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      athleteProfile: true,
      achievements: { include: { achievement: true } },
    },
  });
  if (!user?.athleteProfile) return <p>پروفایل یافت نشد</p>;

  const { measurements, records, logs } = await getAthleteProgress(user.athleteProfile.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-black">پیشرفت</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/athlete/leaderboard">جدول رتبه‌بندی</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">سطح</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{toPersianDigits(user.level)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">امتیاز</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{toPersianDigits(user.xp)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">استریک</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{toPersianDigits(user.streak)} روز</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ثبت اندازه‌گیری</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addMeasurementAction} className="grid gap-3 sm:grid-cols-4">
            <Input name="weightKg" type="number" step="0.1" placeholder="وزن (کیلو)" />
            <Input name="bodyFatPct" type="number" step="0.1" placeholder="چربی بدن ٪" />
            <Input name="waistCm" type="number" step="0.1" placeholder="دور کمر (سانتی‌متر)" />
            <Button type="submit">ثبت</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>روند وزن</CardTitle>
        </CardHeader>
        <CardContent>
          {measurements.length ? (
            <ul className="space-y-2">
              {measurements.map((m) => (
                <li key={m.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{formatJalali(m.measuredAt)}</span>
                  <span>
                    {m.weightKg ? `${toPersianDigits(m.weightKg)} کیلو` : "—"}
                    {m.bodyFatPct ? ` · چربی ${toPersianDigits(m.bodyFatPct)}٪` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">اندازه‌گیری ثبت نشده.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>رکوردهای شخصی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.map((r) => (
            <div key={r.id} className="flex justify-between text-sm">
              <span>{r.exercise.name}</span>
              <span className="text-primary">
                {toPersianDigits(r.weightKg)} کیلو × {toPersianDigits(r.reps)}
              </span>
            </div>
          ))}
          {!records.length ? <p className="text-muted-foreground">هنوز رکورد شخصی ندارید.</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>دستاوردها</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {user.achievements.map((a) => (
            <span
              key={a.id}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {a.achievement.title}
            </span>
          ))}
          {!user.achievements.length ? (
            <p className="text-muted-foreground">هنوز دستاوردی ندارید.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>آخرین تمرین‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.slice(0, 10).map((l) => (
            <div key={l.id} className="flex justify-between text-sm">
              <span>{l.exercise.name}</span>
              <span className="text-muted-foreground">
                {toPersianDigits(l.sets)}×{toPersianDigits(l.reps)}
                {l.weightKg ? ` @ ${toPersianDigits(l.weightKg)}` : ""}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
