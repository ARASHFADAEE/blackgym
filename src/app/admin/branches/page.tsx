import {
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { getOccupancyInfo } from "@/features/attendance/service";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminBranchesPage() {
  const branches = await prisma.branch.findMany({
    include: {
      facilities: true,
      _count: { select: { trainers: true, memberships: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="شعب"
        description="ظرفیت، تراکم، مربیان و امکانات هر شعبه برای مدیریت چندشعبه‌ای"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {branches.map((b) => {
          const occ = getOccupancyInfo(b.currentOccupancy, b.capacity);
          return (
            <AdminPanel
              key={b.id}
              title={b.name}
              description={b.address}
              actions={<AdminStatusBadge status={b.status === "ACTIVE" ? "ACTIVE" : "CANCELLED"} />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/[0.03] px-2 py-3">
                    <p className="text-[11px] text-muted-foreground">ظرفیت</p>
                    <p className="mt-1 font-bold">{toPersianDigits(b.capacity)}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] px-2 py-3">
                    <p className="text-[11px] text-muted-foreground">حضور</p>
                    <p className="mt-1 font-bold">{toPersianDigits(b.currentOccupancy)}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] px-2 py-3">
                    <p className="text-[11px] text-muted-foreground">تراکم</p>
                    <p className="mt-1 font-bold text-primary">{toPersianDigits(occ.percent)}٪</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>{occ.label}</span>
                    <span>
                      مربی {toPersianDigits(b._count.trainers)} · عضویت{" "}
                      {toPersianDigits(b._count.memberships)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(occ.percent, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground" dir="ltr">
                  {b.phone}
                </p>

                <div className="flex flex-wrap gap-2">
                  {b.facilities.map((f) => (
                    <span
                      key={f.id}
                      className="rounded-full border border-border/70 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            </AdminPanel>
          );
        })}
      </div>

      {!branches.length ? <AdminEmpty message="شعبه‌ای تعریف نشده است." /> : null}

      <AdminPanel title="جمع‌بندی شعب" description="نمای جدولی برای گزارش مدیریت">
        {branches.length ? (
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>شعبه</AdminTh>
                <AdminTh>وضعیت</AdminTh>
                <AdminTh>تراکم</AdminTh>
                <AdminTh>مربی</AdminTh>
                <AdminTh>عضویت</AdminTh>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => {
                const occ = getOccupancyInfo(b.currentOccupancy, b.capacity);
                return (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <AdminTd className="font-medium">{b.name}</AdminTd>
                    <AdminTd>
                      <AdminStatusBadge status={b.status === "ACTIVE" ? "ACTIVE" : "CANCELLED"} />
                    </AdminTd>
                    <AdminTd>
                      {occ.label} ({toPersianDigits(occ.percent)}٪)
                    </AdminTd>
                    <AdminTd>{toPersianDigits(b._count.trainers)}</AdminTd>
                    <AdminTd>{toPersianDigits(b._count.memberships)}</AdminTd>
                  </tr>
                );
              })}
            </tbody>
          </AdminTable>
        ) : null}
      </AdminPanel>
    </div>
  );
}
