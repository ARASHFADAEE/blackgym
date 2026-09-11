import { prisma } from "@/lib/db/prisma";
import { getPaymentGateway } from "@/lib/payments";
import type { MembershipStatus } from "@prisma/client";

export async function getActiveMembership(userId: string) {
  return prisma.membership.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endsAt: { gte: new Date() },
    },
    include: { plan: true, branch: true },
    orderBy: { endsAt: "desc" },
  });
}

export async function requireActiveMembership(userId: string) {
  const membership = await getActiveMembership(userId);
  if (!membership) {
    throw new Error("برای دسترسی به این بخش، عضویت فعال لازم است");
  }
  return membership;
}

export async function listMembershipPlans() {
  return prisma.membershipPlan.findMany({
    where: { isActive: true },
    include: { features: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function purchaseMembership(params: {
  userId: string;
  planId: string;
  branchId: string;
}) {
  const plan = await prisma.membershipPlan.findUnique({ where: { id: params.planId } });
  if (!plan || !plan.isActive) {
    throw new Error("پلن عضویت یافت نشد");
  }

  const branch = await prisma.branch.findUnique({ where: { id: params.branchId } });
  if (!branch || branch.status !== "ACTIVE") {
    throw new Error("شعبه فعال نیست");
  }

  const membership = await prisma.membership.create({
    data: {
      userId: params.userId,
      planId: params.planId,
      branchId: params.branchId,
      status: "PENDING",
    },
  });

  const gateway = getPaymentGateway();
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const paymentResult = await gateway.createPayment({
    amount: plan.price,
    description: `خرید عضویت ${plan.name}`,
    callbackUrl: `${base}/api/payments/callback`,
    metadata: { membershipId: membership.id, userId: params.userId },
  });

  if (!paymentResult.success) {
    throw new Error(paymentResult.error ?? "خطا در ایجاد پرداخت");
  }

  await prisma.payment.create({
    data: {
      userId: params.userId,
      membershipId: membership.id,
      amount: plan.price,
      status: "PENDING",
      provider: gateway.name,
      authority: paymentResult.authority,
      description: `خرید عضویت ${plan.name}`,
      metadata: { membershipId: membership.id },
    },
  });

  return { membership, redirectUrl: paymentResult.redirectUrl, authority: paymentResult.authority };
}

export async function activateMembershipFromPayment(authority: string) {
  const payment = await prisma.payment.findUnique({
    where: { authority },
    include: { membership: { include: { plan: true } } },
  });

  if (!payment || !payment.membership) {
    return { success: false as const, error: "پرداخت یافت نشد" };
  }

  if (payment.status === "SUCCESS") {
    return { success: true as const, alreadyProcessed: true };
  }

  const gateway = getPaymentGateway();
  const verify = await gateway.verifyPayment({
    authority,
    amount: payment.amount,
  });

  if (!verify.success) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return { success: false as const, error: verify.error ?? "تأیید پرداخت ناموفق" };
  }

  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + payment.membership.plan.durationDays);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        providerRef: verify.providerRef,
        paidAt: new Date(),
      },
    }),
    prisma.membership.update({
      where: { id: payment.membershipId! },
      data: {
        status: "ACTIVE" satisfies MembershipStatus,
        startsAt,
        endsAt,
      },
    }),
    prisma.notification.create({
      data: {
        userId: payment.userId,
        type: "MEMBERSHIP_RENEWED",
        title: "عضویت فعال شد",
        body: `عضویت ${payment.membership.plan.name} شما با موفقیت فعال شد.`,
        href: "/athlete/membership",
      },
    }),
  ]);

  const { createInvoiceForPayment } = await import("./ops");
  await createInvoiceForPayment(payment.id);

  return { success: true as const };
}
