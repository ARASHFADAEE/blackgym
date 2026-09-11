import bcrypt from "bcryptjs";
import type { LeadSource, LeadStatus } from "@prisma/client";
import { LEAD_STATUS_FA } from "@/lib/i18n/fa-labels";
import { prisma } from "@/lib/db/prisma";

async function resolveUserId(userId?: string) {
  if (!userId) return undefined;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  return user?.id;
}

export async function createLead(input: {
  name: string;
  phone: string;
  email?: string;
  source?: LeadSource;
  branchId?: string;
  notes?: string;
  assignedToId?: string;
  createdById?: string;
  nextFollowUpAt?: Date;
}) {
  const [createdById, assignedToId] = await Promise.all([
    resolveUserId(input.createdById),
    resolveUserId(input.assignedToId),
  ]);

  return prisma.lead.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      source: input.source ?? "WEBSITE",
      branchId: input.branchId,
      notes: input.notes,
      assignedToId,
      createdById,
      nextFollowUpAt: input.nextFollowUpAt,
      activities: {
        create: {
          type: "CREATED",
          note: "لید جدید ثبت شد",
          actorId: createdById,
        },
      },
    },
  });
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, actorId?: string) {
  const resolvedActorId = await resolveUserId(actorId);
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status,
      lastContactAt: new Date(),
    },
  });

  await prisma.leadActivity.create({
    data: {
      leadId,
      actorId: resolvedActorId,
      type: "STATUS_CHANGE",
      note: `وضعیت به «${LEAD_STATUS_FA[status]}» تغییر کرد`,
    },
  });

  return lead;
}

export async function listLeadsByStatus() {
  const leads = await prisma.lead.findMany({
    include: {
      branch: true,
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: [{ nextFollowUpAt: "asc" }, { createdAt: "desc" }],
  });

  const columns: LeadStatus[] = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "TRIAL",
    "PROPOSAL",
    "WON",
    "LOST",
  ];

  return Object.fromEntries(
    columns.map((status) => [status, leads.filter((l) => l.status === status)]),
  ) as Record<LeadStatus, typeof leads>;
}

export async function getLeadSourceStats() {
  const groups = await prisma.lead.groupBy({
    by: ["source"],
    _count: true,
  });
  const won = await prisma.lead.groupBy({
    by: ["source"],
    where: { status: "WON" },
    _count: true,
  });
  const wonMap = Object.fromEntries(won.map((w) => [w.source, w._count]));
  return groups.map((g) => ({
    source: g.source,
    leads: g._count,
    customers: wonMap[g.source] ?? 0,
    conversionRate: g._count ? Math.round(((wonMap[g.source] ?? 0) / g._count) * 100) : 0,
  }));
}

export async function getOverdueFollowUps(take = 20) {
  return prisma.lead.findMany({
    where: {
      status: { notIn: ["WON", "LOST"] },
      nextFollowUpAt: { lt: new Date() },
    },
    include: { assignedTo: true, branch: true },
    orderBy: { nextFollowUpAt: "asc" },
    take,
  });
}

export async function convertLeadToAthlete(leadId: string, actorId?: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("لید یافت نشد");
  if (lead.convertedUserId) throw new Error("این لید قبلاً تبدیل شده است");

  const email =
    lead.email?.toLowerCase() ||
    `lead_${lead.phone.replace(/\D/g, "")}@blackgym.local`;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, ...(lead.phone ? [{ phone: lead.phone }] : [])],
    },
  });

  if (existing) {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "WON",
        convertedUserId: existing.id,
        lastContactAt: new Date(),
      },
    });
    return existing;
  }

  const passwordHash = await bcrypt.hash(`Bg${lead.phone.slice(-4)}!`, 12);

  const user = await prisma.user.create({
    data: {
      name: lead.name,
      email,
      phone: lead.phone,
      passwordHash,
      role: "ATHLETE",
      athleteProfile: {
        create: {
          preferredBranchId: lead.branchId,
          goal: "شروع مسیر تناسب اندام",
        },
      },
      notificationPreference: { create: {} },
    },
  });

  await prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "WON",
        convertedUserId: user.id,
        lastContactAt: new Date(),
      },
    }),
    prisma.leadActivity.create({
      data: {
        leadId,
        actorId: await resolveUserId(actorId),
        type: "CONVERTED",
        note: `تبدیل به ورزشکار ${user.email}`,
      },
    }),
  ]);

  return user;
}
