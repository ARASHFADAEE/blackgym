import { prisma } from "@/lib/db/prisma";
import { createNotification } from "@/features/notifications/service";

export async function getPublishedPlanForAthlete(athleteId: string) {
  return prisma.workoutPlan.findFirst({
    where: { athleteId, status: "PUBLISHED" },
    include: {
      days: {
        orderBy: { dayIndex: "asc" },
        include: {
          exercises: {
            orderBy: { sortOrder: "asc" },
            include: { exercise: true },
          },
        },
      },
      trainer: { include: { user: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createWorkoutPlan(params: {
  title: string;
  description?: string;
  athleteId: string;
  trainerId: string;
}) {
  return prisma.workoutPlan.create({
    data: {
      title: params.title,
      description: params.description,
      athleteId: params.athleteId,
      trainerId: params.trainerId,
      status: "DRAFT",
      days: {
        create: [
          { dayIndex: 1, title: "روز ۱ — بالاتنه" },
          { dayIndex: 2, title: "روز ۲ — پایین‌تنه" },
          { dayIndex: 3, title: "روز ۳ — فول‌بادی" },
        ],
      },
    },
    include: { days: true },
  });
}

export async function publishWorkoutPlan(planId: string, trainerId: string) {
  const plan = await prisma.workoutPlan.findFirst({
    where: { id: planId, trainerId },
    include: { athlete: true },
  });
  if (!plan) throw new Error("برنامه یافت نشد");

  const updated = await prisma.workoutPlan.update({
    where: { id: planId },
    data: { status: "PUBLISHED", startsAt: new Date() },
  });

  await createNotification({
    userId: plan.athlete.userId,
    type: "WORKOUT_ASSIGNED",
    title: "برنامه تمرینی جدید",
    body: `برنامه «${plan.title}» برای شما منتشر شد.`,
    href: "/athlete/workouts",
  });

  return updated;
}

export async function listTrainerAthletes(trainerProfileId: string) {
  return prisma.athleteProfile.findMany({
    where: { assignedTrainerId: trainerProfileId },
    include: {
      user: true,
      workoutPlans: { orderBy: { updatedAt: "desc" }, take: 1 },
    },
  });
}
