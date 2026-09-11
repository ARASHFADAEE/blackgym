import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getActiveMembership } from "@/features/memberships/service";
import { getPublishedPlanForAthlete } from "@/features/workouts/service";
import { getAthleteProgress } from "@/features/progress/service";

/**
 * AI-ready context endpoint — AI systems must use this layer, never direct DB access.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { athleteProfile: true },
  });

  if (!user?.athleteProfile) {
    return NextResponse.json({ error: "Athlete profile required" }, { status: 403 });
  }

  const [membership, workout, progress, recentLogs] = await Promise.all([
    getActiveMembership(user.id),
    getPublishedPlanForAthlete(user.athleteProfile.id),
    getAthleteProgress(user.athleteProfile.id),
    prisma.workoutLog.findMany({
      where: { athleteId: user.athleteProfile.id },
      orderBy: { performedAt: "desc" },
      take: 10,
      include: { exercise: true },
    }),
  ]);

  return NextResponse.json({
    athlete: {
      id: user.athleteProfile.id,
      name: user.name,
      goal: user.athleteProfile.goal,
      weightKg: user.athleteProfile.weightKg,
      heightCm: user.athleteProfile.heightCm,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    },
    membership: membership
      ? {
          plan: membership.plan.name,
          status: membership.status,
          endsAt: membership.endsAt,
          branch: membership.branch.name,
        }
      : null,
    workoutPlan: workout
      ? {
          title: workout.title,
          days: workout.days.map((d) => ({
            title: d.title,
            exercises: d.exercises.map((e) => ({
              name: e.exercise.name,
              sets: e.sets,
              reps: e.reps,
            })),
          })),
        }
      : null,
    progress: {
      measurements: progress.measurements,
      personalRecords: progress.records,
    },
    workoutHistory: recentLogs.map((l) => ({
      exercise: l.exercise.name,
      sets: l.sets,
      reps: l.reps,
      weightKg: l.weightKg,
      performedAt: l.performedAt,
    })),
  });
}
