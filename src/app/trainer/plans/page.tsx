import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { publishPlanAction } from "@/features/trainer/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TrainerPlansPage() {
  const session = await auth();
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return <p>پروفایل مربی یافت نشد</p>;

  const plans = await prisma.workoutPlan.findMany({
    where: { trainerId: profile.id },
    include: {
      athlete: { include: { user: true } },
      days: { include: { exercises: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">برنامه‌های تمرینی</h1>
      {plans.map((p) => (
        <Card key={p.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{p.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {p.athlete.user.name} · {p.status} · {p.days.length} روز
              </p>
            </div>
            {p.status === "DRAFT" ? (
              <form action={publishPlanAction}>
                <input type="hidden" name="planId" value={p.id} />
                <Button type="submit">انتشار</Button>
              </form>
            ) : null}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {p.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
