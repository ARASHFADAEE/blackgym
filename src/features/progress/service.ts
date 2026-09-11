import { prisma } from "@/lib/db/prisma";

const LEVEL_XP = 100;

export async function addXp(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const xp = user.xp + amount;
  const level = Math.floor(xp / LEVEL_XP) + 1;

  return prisma.user.update({
    where: { id: userId },
    data: { xp, level },
  });
}

export async function awardAchievement(userId: string, code: string) {
  const achievement = await prisma.achievement.findUnique({ where: { code } });
  if (!achievement) return null;

  const existing = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
  });
  if (existing) return existing;

  const [, updated] = await prisma.$transaction([
    prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: achievement.xpReward } },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: "ACHIEVEMENT",
        title: "دستاورد جدید!",
        body: achievement.title,
        href: "/athlete/progress",
      },
    }),
  ]);

  return updated;
}

export async function logWorkoutAndGamify(params: {
  athleteId: string;
  userId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg?: number;
  notes?: string;
}) {
  const log = await prisma.workoutLog.create({
    data: {
      athleteId: params.athleteId,
      exerciseId: params.exerciseId,
      sets: params.sets,
      reps: params.reps,
      weightKg: params.weightKg,
      notes: params.notes,
    },
  });

  await addXp(params.userId, 10);
  await prisma.user.update({
    where: { id: params.userId },
    data: { streak: { increment: 1 } },
  });

  const count = await prisma.workoutLog.count({ where: { athleteId: params.athleteId } });
  if (count === 1) await awardAchievement(params.userId, "first_workout");
  if (count >= 30) await awardAchievement(params.userId, "thirty_sessions");

  if (params.weightKg) {
    const best = await prisma.strengthRecord.findFirst({
      where: { athleteId: params.athleteId, exerciseId: params.exerciseId },
      orderBy: { weightKg: "desc" },
    });
    if (!best || params.weightKg > best.weightKg) {
      await prisma.strengthRecord.create({
        data: {
          athleteId: params.athleteId,
          exerciseId: params.exerciseId,
          weightKg: params.weightKg,
          reps: params.reps,
          isPR: true,
        },
      });
      await awardAchievement(params.userId, "first_pr");
    }
  }

  return log;
}

export async function getAthleteProgress(athleteId: string) {
  const [measurements, records, logs] = await Promise.all([
    prisma.progressMeasurement.findMany({
      where: { athleteId },
      orderBy: { measuredAt: "asc" },
      take: 30,
    }),
    prisma.strengthRecord.findMany({
      where: { athleteId, isPR: true },
      include: { exercise: true },
      orderBy: { recordedAt: "desc" },
      take: 10,
    }),
    prisma.workoutLog.findMany({
      where: { athleteId },
      orderBy: { performedAt: "desc" },
      take: 50,
      include: { exercise: true },
    }),
  ]);

  return { measurements, records, logs };
}
