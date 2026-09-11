import { prisma } from "@/lib/db/prisma";
import type { ChurnRiskLevel } from "@prisma/client";

export type HealthFactors = {
  attendanceScore: number;
  recencyScore: number;
  membershipScore: number;
  bookingScore: number;
  workoutScore: number;
};

export type RetentionResult = {
  score: number;
  churnRisk: ChurnRiskLevel;
  reasons: string[];
  recommendations: string[];
  factors: HealthFactors;
  lastVisitAt: Date | null;
  visitsThisWeek: number;
  visitsThisMonth: number;
  daysSinceLastVisit: number | null;
  membershipDaysLeft: number | null;
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function calculateChurnRisk(score: number): ChurnRiskLevel {
  if (score <= 39) return "CRITICAL";
  if (score <= 54) return "HIGH";
  if (score <= 69) return "MEDIUM";
  return "LOW";
}

export function getRetentionRecommendations(input: {
  score: number;
  churnRisk: ChurnRiskLevel;
  daysSinceLastVisit: number | null;
  membershipDaysLeft: number | null;
  visitsThisMonth: number;
}): string[] {
  const actions: string[] = [];
  if ((input.daysSinceLastVisit ?? 0) >= 7) {
    actions.push("ارسال یادآور حضور و پیام انگیزشی");
  }
  if ((input.membershipDaysLeft ?? 999) <= 15) {
    actions.push("پیشنهاد تمدید عضویت با تخفیف محدود");
  }
  if (input.visitsThisMonth < 4) {
    actions.push("پیشنهاد جلسه تمرین شخصی");
  }
  if (input.churnRisk === "HIGH" || input.churnRisk === "CRITICAL") {
    actions.push("تماس تلفنی پیگیری توسط پذیرش");
    actions.push("اختصاص/فعال‌سازی مربی پیگیری");
  }
  if (input.score >= 70) {
    actions.push("پیشنهاد ارتقا پلن یا معرفی دوست");
  }
  return actions.slice(0, 5);
}

export async function calculateMemberHealthScore(userId: string): Promise<RetentionResult> {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [user, membership, visitsThisWeek, visitsThisMonth, lastAttendance, bookingsMonth, workoutsMonth] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.membership.findFirst({
        where: { userId, status: { in: ["ACTIVE", "PAUSED"] } },
        orderBy: { endsAt: "desc" },
      }),
      prisma.attendance.count({
        where: { userId, checkedInAt: { gte: weekAgo } },
      }),
      prisma.attendance.count({
        where: { userId, checkedInAt: { gte: monthAgo } },
      }),
      prisma.attendance.findFirst({
        where: { userId },
        orderBy: { checkedInAt: "desc" },
      }),
      prisma.booking.count({
        where: {
          athlete: { userId },
          createdAt: { gte: monthAgo },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
      }),
      prisma.workoutLog.count({
        where: {
          athlete: { userId },
          performedAt: { gte: monthAgo },
        },
      }),
    ]);

  if (!user) {
    throw new Error("کاربر یافت نشد");
  }

  const lastVisitAt = lastAttendance?.checkedInAt ?? user.lastVisitAt ?? null;
  const daysSinceLastVisit = lastVisitAt
    ? Math.floor((now.getTime() - lastVisitAt.getTime()) / 86_400_000)
    : null;

  const membershipDaysLeft =
    membership?.endsAt != null
      ? Math.ceil((membership.endsAt.getTime() - now.getTime()) / 86_400_000)
      : null;

  // Factor scores 0-100
  const attendanceScore = clamp((visitsThisMonth / 12) * 100);
  const recencyScore =
    daysSinceLastVisit == null
      ? 30
      : daysSinceLastVisit <= 2
        ? 100
        : daysSinceLastVisit <= 7
          ? 75
          : daysSinceLastVisit <= 14
            ? 45
            : 15;
  const membershipScore =
    membershipDaysLeft == null
      ? 20
      : membershipDaysLeft > 30
        ? 100
        : membershipDaysLeft > 14
          ? 75
          : membershipDaysLeft > 7
            ? 50
            : 25;
  const bookingScore = clamp((bookingsMonth / 4) * 100);
  const workoutScore = clamp((workoutsMonth / 8) * 100);

  const score = clamp(
    attendanceScore * 0.3 +
      recencyScore * 0.25 +
      membershipScore * 0.2 +
      bookingScore * 0.1 +
      workoutScore * 0.15,
  );

  const churnRisk = calculateChurnRisk(score);
  const reasons: string[] = [];

  if (daysSinceLastVisit != null && daysSinceLastVisit >= 10) {
    reasons.push(`${daysSinceLastVisit} روز از آخرین حضور گذشته است`);
  }
  if (membershipDaysLeft != null && membershipDaysLeft <= 15) {
    reasons.push(`عضویت تا ${membershipDaysLeft} روز دیگر منقضی می‌شود`);
  }
  if (visitsThisMonth < 4) {
    reasons.push(`فقط ${visitsThisMonth} حضور در ۳۰ روز اخیر`);
  }
  if (workoutsMonth === 0) {
    reasons.push("فعالیت ثبت تمرین در ماه اخیر صفر است");
  }
  if (!membership) {
    reasons.push("عضویت فعال وجود ندارد");
  }

  // High risk rule from spec
  if (
    (daysSinceLastVisit ?? 0) > 10 &&
    membershipDaysLeft != null &&
    membershipDaysLeft < 15
  ) {
    reasons.push("ترکیب خطر: غیبت طولانی + نزدیک بودن انقضا");
  }

  const recommendations = getRetentionRecommendations({
    score,
    churnRisk:
      (daysSinceLastVisit ?? 0) > 10 && membershipDaysLeft != null && membershipDaysLeft < 15
        ? "HIGH"
        : churnRisk,
    daysSinceLastVisit,
    membershipDaysLeft,
    visitsThisMonth,
  });

  const finalRisk =
    (daysSinceLastVisit ?? 0) > 10 && membershipDaysLeft != null && membershipDaysLeft < 15
      ? ("HIGH" as ChurnRiskLevel)
      : churnRisk;

  return {
    score,
    churnRisk: finalRisk,
    reasons,
    recommendations,
    factors: {
      attendanceScore,
      recencyScore,
      membershipScore,
      bookingScore,
      workoutScore,
    },
    lastVisitAt,
    visitsThisWeek,
    visitsThisMonth,
    daysSinceLastVisit,
    membershipDaysLeft,
  };
}

export async function persistMemberHealth(userId: string) {
  const result = await calculateMemberHealthScore(userId);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        healthScore: result.score,
        churnRisk: result.churnRisk,
        lastVisitAt: result.lastVisitAt ?? undefined,
      },
    }),
    prisma.memberHealthSnapshot.create({
      data: {
        userId,
        score: result.score,
        churnRisk: result.churnRisk,
        reasons: result.reasons,
        recommendations: result.recommendations,
      },
    }),
  ]);
  return result;
}

export async function recomputeAllAthleteHealth(limit = 200) {
  const athletes = await prisma.user.findMany({
    where: { role: "ATHLETE", isActive: true },
    select: { id: true },
    take: limit,
  });
  const results = [];
  for (const a of athletes) {
    results.push(await persistMemberHealth(a.id));
  }
  return results;
}

export async function listHighRiskMembers(take = 20) {
  return prisma.user.findMany({
    where: {
      role: "ATHLETE",
      churnRisk: { in: ["HIGH", "CRITICAL"] },
    },
    include: {
      athleteProfile: true,
      memberships: {
        where: { status: { in: ["ACTIVE", "PAUSED"] } },
        include: { plan: true },
        take: 1,
        orderBy: { endsAt: "desc" },
      },
    },
    orderBy: { healthScore: "asc" },
    take,
  });
}
