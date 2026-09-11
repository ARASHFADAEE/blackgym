import { AdminPageHeader } from "@/components/admin/ui";
import { CrmBoard } from "@/components/admin/crm-board";
import { listLeadsByStatus, getLeadSourceStats } from "@/features/crm/service";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminCrmPage() {
  const [pipeline, branches, stats] = await Promise.all([
    listLeadsByStatus(),
    prisma.branch.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true } }),
    getLeadSourceStats(),
  ]);

  const now = new Date();
  const columns = Object.fromEntries(
    Object.entries(pipeline).map(([status, leads]) => [
      status,
      leads.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        source: l.source,
        status: l.status,
        notes: l.notes,
        nextFollowUpAt: l.nextFollowUpAt?.toISOString() ?? null,
        overdue: !!(l.nextFollowUpAt && l.nextFollowUpAt < now && !["WON", "LOST"].includes(l.status)),
        branchName: l.branch?.name,
        assigneeName: l.assignedTo?.name,
      })),
    ]),
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="مدیریت لید و فروش"
        description="مدیریت لید از ورود تا تبدیل به ورزشکار — مسیر وضعیت فروش"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.source} className="rounded-2xl border border-border/80 bg-[#0d0d0d] p-4">
            <p className="text-xs text-muted-foreground">{s.source}</p>
            <p className="mt-1 text-lg font-black">
              {toPersianDigits(s.leads)} → {toPersianDigits(s.customers)}
            </p>
            <p className="text-[11px] text-primary">نرخ {toPersianDigits(s.conversionRate)}٪</p>
          </div>
        ))}
      </div>

      <CrmBoard columns={columns} branches={branches} />
    </div>
  );
}
