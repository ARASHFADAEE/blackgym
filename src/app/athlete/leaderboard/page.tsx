import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";

export default async function AthleteLeaderboardPage() {
  const top = await prisma.user.findMany({
    where: { role: "ATHLETE", isActive: true },
    orderBy: [{ xp: "desc" }, { streak: "desc" }],
    take: 20,
    select: { id: true, name: true, xp: true, level: true, streak: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">جدول رتبه‌بندی</h1>
      <Card>
        <CardHeader>
          <CardTitle>برترین‌ها بر اساس امتیاز</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {top.map((u, i) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {toPersianDigits(i + 1)}
                </span>
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    سطح {toPersianDigits(u.level)} · استریک {toPersianDigits(u.streak)}
                  </p>
                </div>
              </div>
              <p className="font-bold text-primary">{toPersianDigits(u.xp)} امتیاز</p>
            </div>
          ))}
          {!top.length ? <p className="text-muted-foreground">هنوز رتبه‌ای نیست.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
