import { prisma } from "@/lib/db/prisma";
import { bookClass } from "@/features/bookings/service";

export async function listUpcomingClassSchedules(take = 40) {
  return prisma.classSchedule.findMany({
    where: { startsAt: { gte: new Date() } },
    include: {
      fitnessClass: {
        include: {
          branch: true,
          trainer: { include: { user: true } },
        },
      },
      bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } },
    },
    orderBy: { startsAt: "asc" },
    take,
  });
}

export async function listAthleteClassBookings(athleteId: string) {
  return prisma.classBooking.findMany({
    where: { athleteId },
    include: {
      schedule: {
        include: {
          fitnessClass: {
            include: {
              branch: true,
              trainer: { include: { user: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export { bookClass };
