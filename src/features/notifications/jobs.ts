import { createNotification } from "@/features/notifications/service";
import { prisma } from "@/lib/db/prisma";

/** اعلان انقضای عضویت در ۷ روز آینده (قابل فراخوانی از cron یا ادمین) */
export async function notifyExpiringMemberships(withinDays = 7) {
  const now = new Date();
  const until = new Date(now.getTime() + withinDays * 86_400_000);

  const memberships = await prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      endsAt: { gte: now, lte: until },
    },
    include: { plan: true, user: true },
  });

  let sent = 0;
  for (const m of memberships) {
    const days = Math.ceil((m.endsAt!.getTime() - now.getTime()) / 86_400_000);
    const since = new Date(now.getTime() - 2 * 86_400_000);
    const already = await prisma.notification.findFirst({
      where: {
        userId: m.userId,
        type: "MEMBERSHIP_EXPIRING",
        createdAt: { gte: since },
      },
    });
    if (already) continue;

    await createNotification({
      userId: m.userId,
      type: "MEMBERSHIP_EXPIRING",
      title: "عضویت رو به انقضا",
      body: `پلن «${m.plan.name}» حدود ${days} روز دیگر منقضی می‌شود. همین حالا تمدید کنید.`,
      href: "/athlete/membership",
    });
    sent += 1;
  }

  return { scanned: memberships.length, sent };
}
