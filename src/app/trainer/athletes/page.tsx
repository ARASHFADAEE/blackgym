import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { listTrainerAthletes } from "@/features/workouts/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TrainerAthletesPage() {
  const session = await auth();
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return <p>پروفایل مربی یافت نشد</p>;

  const athletes = await listTrainerAthletes(profile.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">ورزشکاران</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {athletes.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle>{a.user.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>هدف: {a.goal ?? "—"}</p>
              <p>وزن: {a.weightKg ?? "—"} کیلو</p>
              <p>ایمیل: {a.user.email}</p>
              <p>آخرین برنامه: {a.workoutPlans[0]?.title ?? "ندارد"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
