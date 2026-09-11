import type { AttendanceSource } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getActiveMembership } from "@/features/memberships/service";
import { occupancyLevel } from "@/lib/dates/jalali";

export async function refreshBranchOccupancy(branchId: string) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) return null;

  const since = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const current = await prisma.attendance.count({
    where: {
      branchId,
      checkedInAt: { gte: since },
      checkedOutAt: null,
    },
  });

  return prisma.branch.update({
    where: { id: branchId },
    data: { currentOccupancy: current },
  });
}

export function getOccupancyInfo(current: number, capacity: number) {
  const percent = capacity > 0 ? Math.round((current / capacity) * 100) : 0;
  return {
    percent,
    level: occupancyLevel(percent),
    label:
      percent < 35 ? "خلوت" : percent < 60 ? "متوسط" : percent < 85 ? "شلوغ" : "بسیار شلوغ",
  };
}

export async function checkIn(params: {
  userId: string;
  branchId: string;
  source?: AttendanceSource;
  staffId?: string;
}) {
  const open = await prisma.attendance.findFirst({
    where: { userId: params.userId, checkedOutAt: null },
  });
  if (open) return open;

  const membership = await getActiveMembership(params.userId);
  const source = params.source ?? "MANUAL";

  let staffId: string | undefined;
  if (params.staffId) {
    const staff = await prisma.user.findUnique({
      where: { id: params.staffId },
      select: { id: true },
    });
    staffId = staff?.id;
  }

  const attendance = await prisma.attendance.create({
    data: {
      userId: params.userId,
      branchId: params.branchId,
      method: source.toLowerCase(),
      source,
      membershipId: membership?.id,
      staffId,
    },
  });

  await prisma.user.update({
    where: { id: params.userId },
    data: {
      lastVisitAt: new Date(),
      streak: { increment: 1 },
    },
  });

  await refreshBranchOccupancy(params.branchId);
  const { recordOccupancySnapshot } = await import("./kiosk");
  await recordOccupancySnapshot(params.branchId);
  return attendance;
}

export async function checkOut(userId: string) {
  const open = await prisma.attendance.findFirst({
    where: { userId, checkedOutAt: null },
    orderBy: { checkedInAt: "desc" },
  });
  if (!open) throw new Error("حضور بازی برای خروج یافت نشد");

  const updated = await prisma.attendance.update({
    where: { id: open.id },
    data: { checkedOutAt: new Date() },
  });
  await refreshBranchOccupancy(open.branchId);
  const { recordOccupancySnapshot } = await import("./kiosk");
  await recordOccupancySnapshot(open.branchId);
  return updated;
}

export async function getAthleteEngagement(userId: string) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [lastVisit, week, month, user] = await Promise.all([
    prisma.attendance.findFirst({
      where: { userId },
      orderBy: { checkedInAt: "desc" },
      include: { branch: true },
    }),
    prisma.attendance.count({ where: { userId, checkedInAt: { gte: weekAgo } } }),
    prisma.attendance.count({ where: { userId, checkedInAt: { gte: monthAgo } } }),
    prisma.user.findUnique({ where: { id: userId }, select: { streak: true, lastVisitAt: true } }),
  ]);

  return {
    lastVisit,
    visitsThisWeek: week,
    visitsThisMonth: month,
    averageVisits: Math.round((month / 4) * 10) / 10,
    currentStreak: user?.streak ?? 0,
  };
}
