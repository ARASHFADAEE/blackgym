import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getPublishedPlanForAthlete } from "@/features/workouts/service";
import { logWorkoutAction } from "@/features/athlete/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toPersianDigits } from "@/lib/utils";

export default async function AthleteWorkoutsPage() {
  const session = await auth();
  const profile = await prisma.athleteProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return <p>پروفایل یافت نشد</p>;

  const plan = await getPublishedPlanForAthlete(profile.id);
  const exercises = await prisma.exercise.findMany({ take: 30, orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">برنامه تمرینی</h1>

      {plan ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {plan.title} · مربی: {plan.trainer.user.name}
          </p>
          {plan.days.map((day) => (
            <Card key={day.id}>
              <CardHeader>
                <CardTitle>{day.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3"
                  >
                    <div>
                      <p className="font-medium">{ex.exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {toPersianDigits(ex.sets)} ست × {ex.reps}
                        {ex.weightKg ? ` · ${toPersianDigits(ex.weightKg)} کیلو` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            هنوز برنامه منتشرشده‌ای ندارید.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>ثبت تمرین</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={logWorkoutAction} className="grid gap-3 sm:grid-cols-2">
            <select
              name="exerciseId"
              required
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              {exercises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <Input name="sets" type="number" defaultValue={3} placeholder="ست" />
            <Input name="reps" type="number" defaultValue={10} placeholder="تکرار" />
            <Input name="weightKg" type="number" step="0.5" placeholder="وزن (کیلو)" />
            <div className="sm:col-span-2">
              <Button type="submit">ثبت و دریافت XP</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
