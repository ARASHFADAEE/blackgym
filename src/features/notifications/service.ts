import { prisma } from "@/lib/db/prisma";

export async function createNotification(params: {
  userId: string;
  type:
    | "MEMBERSHIP_EXPIRING"
    | "MEMBERSHIP_RENEWED"
    | "WORKOUT_ASSIGNED"
    | "TRAINER_MESSAGE"
    | "BOOKING_CONFIRMED"
    | "BOOKING_CANCELLED"
    | "WORKOUT_REMINDER"
    | "ANNOUNCEMENT"
    | "ACHIEVEMENT";
  title: string;
  body: string;
  href?: string;
}) {
  return prisma.notification.create({ data: params });
}

export async function listUserNotifications(userId: string, take = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function markAllRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
