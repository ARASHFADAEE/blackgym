import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { updateBookingStatusAction } from "@/features/trainer/actions";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function TrainerBookingsPage() {
  const session = await auth();
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!profile) return <p>پروفایل مربی یافت نشد</p>;

  const bookings = await prisma.booking.findMany({
    where: { trainerId: profile.id },
    include: { athlete: { include: { user: true } }, branch: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">رزروهای تمرین شخصی</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-bold">{b.athlete.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatJalaliDateTime(b.startsAt)} · {b.branch.name}
                </p>
                <Badge className="mt-2">{b.status}</Badge>
              </div>
              <div className="flex gap-2">
                <form action={updateBookingStatusAction}>
                  <input type="hidden" name="bookingId" value={b.id} />
                  <input type="hidden" name="status" value="CONFIRMED" />
                  <Button type="submit" size="sm" variant="outline">
                    تأیید
                  </Button>
                </form>
                <form action={updateBookingStatusAction}>
                  <input type="hidden" name="bookingId" value={b.id} />
                  <input type="hidden" name="status" value="COMPLETED" />
                  <Button type="submit" size="sm">
                    تکمیل
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
