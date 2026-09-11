import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { bookPtAction, cancelBookingAction } from "@/features/athlete/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ENTITY_STATUS_FA } from "@/lib/i18n/fa-labels";

export default async function AthleteBookingsPage({
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

  const [bookings, trainers, branches] = await Promise.all([
    prisma.booking.findMany({
      where: { athleteId: profile.id },
      include: { trainer: { include: { user: true } }, branch: true },
      orderBy: { startsAt: "desc" },
    }),
    prisma.trainerProfile.findMany({ include: { user: true }, take: 20 }),
    prisma.branch.findMany({ where: { status: "ACTIVE" } }),
  ]);

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  defaultStart.setHours(17, 0, 0, 0);
  const local = new Date(defaultStart.getTime() - defaultStart.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">رزروها</h1>
      {sp.booked ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          رزرو با موفقیت ثبت شد.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>رزرو تمرین شخصی</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={bookPtAction} className="grid gap-3 sm:grid-cols-2">
            <select
              name="trainerId"
              required
              defaultValue={profile.assignedTrainerId ?? undefined}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.user.name} — {t.specialty}
                </option>
              ))}
            </select>
            <select
              name="branchId"
              required
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Input name="startsAt" type="datetime-local" required defaultValue={local} />
            <Input name="notes" placeholder="یادداشت (اختیاری)" />
            <div className="sm:col-span-2">
              <Button type="submit">ثبت رزرو</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-bold">{b.trainer.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatJalaliDateTime(b.startsAt)} · {b.branch.name}
                </p>
                <Badge className="mt-2">{ENTITY_STATUS_FA[b.status] ?? b.status}</Badge>
              </div>
              {b.status === "CONFIRMED" || b.status === "PENDING" ? (
                <form action={cancelBookingAction}>
                  <input type="hidden" name="bookingId" value={b.id} />
                  <Button type="submit" variant="outline" size="sm">
                    لغو
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {!bookings.length ? (
          <p className="text-muted-foreground">هنوز رزروی ندارید.</p>
        ) : null}
      </div>
    </div>
  );
}
