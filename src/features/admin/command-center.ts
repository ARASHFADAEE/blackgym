import { prisma } from "@/lib/db/prisma";
import { getOverdueFollowUps, getLeadSourceStats } from "@/features/crm/service";
import { getExpiringMemberships } from "@/features/memberships/ops";
import { listHighRiskMembers } from "@/features/retention/service";
import { getOccupancyInfo } from "@/features/attendance/service";

export async function getCommandCenterData() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    monthlyRevenue,
    prevMonthRevenue,
    totalRevenue,
    activeMembers,
    newMembers,
    prevNewMembers,
    expiring7,
    expired,
    todayAttendance,
    weeklyAttendance,
    newLeads,
    wonLeads30,
    leads30,
    pendingPayments,
    branches,
    trainers,
    overdueLeads,
    highRisk,
    expiringList,
    sourceStats,
    recentPayments,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "SUCCESS", paidAt: { gte: monthStart } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS", paidAt: { gte: prevMonthStart, lt: monthStart } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
    prisma.membership.count({
      where: { status: "ACTIVE", endsAt: { gte: now } },
    }),
    prisma.user.count({
      where: { role: "ATHLETE", createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.user.count({
      where: {
        role: "ATHLETE",
        createdAt: {
          gte: new Date(thirtyDaysAgo.getTime() - 30 * 86_400_000),
          lt: thirtyDaysAgo,
        },
      },
    }),
    prisma.membership.count({
      where: {
        status: "ACTIVE",
        endsAt: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 86_400_000),
        },
      },
    }),
    prisma.membership.count({ where: { status: "EXPIRED" } }),
    prisma.attendance.count({ where: { checkedInAt: { gte: dayStart } } }),
    prisma.attendance.count({ where: { checkedInAt: { gte: weekAgo } } }),
    prisma.lead.count({
      where: { createdAt: { gte: thirtyDaysAgo }, status: { not: "LOST" } },
    }),
    prisma.lead.count({
      where: { status: "WON", updatedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.branch.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.trainerProfile.findMany({
      include: {
        user: true,
        _count: { select: { athletes: true, bookings: true } },
      },
    }),
    getOverdueFollowUps(12),
    listHighRiskMembers(12),
    getExpiringMemberships(7),
    getLeadSourceStats(),
    prisma.payment.findMany({
      include: { user: true, invoice: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const monthAmt = monthlyRevenue._sum.amount ?? 0;
  const prevAmt = prevMonthRevenue._sum.amount ?? 0;
  const revenueDelta =
    prevAmt > 0 ? Math.round(((monthAmt - prevAmt) / prevAmt) * 1000) / 10 : monthAmt > 0 ? 100 : 0;
  const membersDelta =
    prevNewMembers > 0
      ? Math.round(((newMembers - prevNewMembers) / prevNewMembers) * 1000) / 10
      : newMembers > 0
        ? 100
        : 0;

  const conversionRate = leads30 ? Math.round((wonLeads30 / leads30) * 100) : 0;
  const churnRate =
    activeMembers + expired > 0
      ? Math.round((expired / (activeMembers + expired)) * 1000) / 10
      : 0;
  const retentionRate = Math.max(0, Math.round((100 - churnRate) * 10) / 10);
  const avgMembershipValue =
    monthlyRevenue._count > 0 ? Math.round(monthAmt / monthlyRevenue._count) : 0;

  const trainerUtilization = trainers.map((t) => ({
    id: t.id,
    name: t.user.name,
    athletes: t._count.athletes,
    bookings: t._count.bookings,
    underutilized: t._count.athletes < 2 && t._count.bookings < 3,
  }));
  const unusedTrainers = trainerUtilization.filter((t) => t.underutilized);

  const branchOccupancy = branches.map((b) => ({
    ...b,
    occupancy: getOccupancyInfo(b.currentOccupancy, b.capacity),
  }));

  return {
    kpis: {
      totalRevenue: totalRevenue._sum.amount ?? 0,
      monthlyRevenue: monthAmt,
      revenueDelta,
      activeMembers,
      newMembers,
      membersDelta,
      expiringMemberships: expiring7,
      expiredMemberships: expired,
      todayAttendance,
      weeklyAttendance,
      newLeads,
      conversionRate,
      churnRate,
      retentionRate,
      averageMembershipValue: avgMembershipValue,
      pendingPayments,
      unusedTrainerCount: unusedTrainers.length,
    },
    alerts: {
      highRiskCount: highRisk.length,
      expiringCount: expiring7,
      overdueLeads: overdueLeads.length,
      unusedTrainers: unusedTrainers.length,
      pendingPayments,
    },
    highRisk,
    expiringList: expiringList.slice(0, 8),
    overdueLeads,
    unusedTrainers,
    branchOccupancy,
    trainerUtilization,
    sourceStats,
    recentPayments,
  };
}
