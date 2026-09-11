import { prisma } from "@/lib/db/prisma";
import type { MembershipStatus } from "@prisma/client";

export async function freezeMembership(input: {
  membershipId: string;
  startsAt: Date;
  endsAt: Date;
  reason: string;
  approvedById?: string;
}) {
  if (input.endsAt <= input.startsAt) {
    throw new Error("بازه فریز نامعتبر است");
  }

  const membership = await prisma.membership.findUnique({
    where: { id: input.membershipId },
  });
  if (!membership || membership.status !== "ACTIVE") {
    throw new Error("فقط عضویت فعال قابل فریز است");
  }

  const freezeDays = Math.ceil(
    (input.endsAt.getTime() - input.startsAt.getTime()) / 86_400_000,
  );

  const newEndsAt = membership.endsAt
    ? new Date(membership.endsAt.getTime() + freezeDays * 86_400_000)
    : null;

  let approvedById: string | undefined;
  if (input.approvedById) {
    const approver = await prisma.user.findUnique({
      where: { id: input.approvedById },
      select: { id: true },
    });
    approvedById = approver?.id;
  }

  const [freeze] = await prisma.$transaction([
    prisma.membershipFreeze.create({
      data: {
        membershipId: input.membershipId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        reason: input.reason,
        approvedById,
        status: "ACTIVE",
      },
    }),
    prisma.membership.update({
      where: { id: input.membershipId },
      data: {
        status: "PAUSED" satisfies MembershipStatus,
        pausedAt: input.startsAt,
        resumeAt: input.endsAt,
        endsAt: newEndsAt ?? undefined,
        freezeDaysUsed: { increment: freezeDays },
      },
    }),
  ]);

  return freeze;
}

export async function resumeMembership(membershipId: string) {
  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    include: { freezes: { where: { status: "ACTIVE" }, orderBy: { endsAt: "desc" }, take: 1 } },
  });
  if (!membership || membership.status !== "PAUSED") {
    throw new Error("عضویت در حالت فریز نیست");
  }

  const activeFreeze = membership.freezes[0];
  await prisma.$transaction([
    ...(activeFreeze
      ? [
          prisma.membershipFreeze.update({
            where: { id: activeFreeze.id },
            data: { status: "COMPLETED", endsAt: new Date() },
          }),
        ]
      : []),
    prisma.membership.update({
      where: { id: membershipId },
      data: {
        status: "ACTIVE",
        pausedAt: null,
        resumeAt: null,
      },
    }),
  ]);
}

export async function extendMembership(membershipId: string, days: number) {
  const membership = await prisma.membership.findUnique({ where: { id: membershipId } });
  if (!membership?.endsAt) throw new Error("عضویت معتبر نیست");
  const endsAt = new Date(membership.endsAt);
  endsAt.setDate(endsAt.getDate() + days);
  return prisma.membership.update({
    where: { id: membershipId },
    data: { endsAt, status: membership.status === "EXPIRED" ? "ACTIVE" : membership.status },
  });
}

export async function cancelMembership(membershipId: string) {
  return prisma.membership.update({
    where: { id: membershipId },
    data: { status: "CANCELLED" },
  });
}

export async function getExpiringMemberships(withinDays: number) {
  const now = new Date();
  const until = new Date(now);
  until.setDate(until.getDate() + withinDays);
  return prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      endsAt: { gte: now, lte: until },
    },
    include: { user: true, plan: true, branch: true },
    orderBy: { endsAt: "asc" },
  });
}

export async function expireDueMemberships() {
  const now = new Date();
  return prisma.membership.updateMany({
    where: {
      status: { in: ["ACTIVE", "PAUSED"] },
      endsAt: { lt: now },
    },
    data: { status: "EXPIRED" },
  });
}

export async function createInvoiceForPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { invoice: true },
  });
  if (!payment || payment.status !== "SUCCESS") {
    throw new Error("پرداخت موفق یافت نشد");
  }
  if (payment.invoice) return payment.invoice;

  const count = await prisma.invoice.count();
  const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

  return prisma.invoice.create({
    data: {
      number,
      userId: payment.userId,
      paymentId: payment.id,
      membershipId: payment.membershipId,
      amount: payment.amount,
      method: payment.provider,
      transactionId: payment.providerRef,
    },
  });
}
