import {
  AdminEmpty,
  AdminKpiCard,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  cancelMembershipAction,
  extendMembershipAction,
  freezeMembershipAction,
  resumeMembershipAction,
} from "@/features/admin/actions";
import { prisma } from "@/lib/db/prisma";
import { formatToman, toPersianDigits } from "@/lib/utils";

export default async function AdminMembershipsPage() {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 86_400_000);

  const [plans, memberships, activeCount, expiringCount] = await Promise.all([
    prisma.membershipPlan.findMany({
      include: { features: true, _count: { select: { memberships: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.membership.findMany({
      include: { user: true, plan: true, branch: true },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
    prisma.membership.count({
      where: { status: "ACTIVE", endsAt: { gte: now } },
    }),
    prisma.membership.count({
      where: { status: "ACTIVE", endsAt: { gte: now, lte: in7 } },
    }),
  ]);

  const freezeStart = new Date();
  const freezeEnd = new Date();
  freezeEnd.setDate(freezeEnd.getDate() + 14);
  const startLocal = new Date(freezeStart.getTime() - freezeStart.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const endLocal = new Date(freezeEnd.getTime() - freezeEnd.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="عملیات عضویت"
        description="ایجاد، تمدید، فریز، ازسرگیری، لغو و پیگیری انقضا"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKpiCard label="فعال" value={toPersianDigits(activeCount)} accent />
        <AdminKpiCard label="انقضا ۷ روز" value={toPersianDigits(expiringCount)} />
        {plans.slice(0, 2).map((p) => (
          <AdminKpiCard
            key={p.id}
            label={p.name}
            value={formatToman(p.price)}
            hint={`${toPersianDigits(p._count.memberships)} عضو`}
          />
        ))}
      </div>

      <AdminPanel title="عضویت‌ها و عملیات" description="فریز کردن، تاریخ پایان را به اندازه بازه فریز جابه‌جا می‌کند">
        {memberships.length ? (
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>کاربر / پلن</AdminTh>
                <AdminTh>وضعیت</AdminTh>
                <AdminTh>عملیات</AdminTh>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.id}>
                  <AdminTd>
                    <p className="font-medium">{m.user.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.plan.name} · {m.branch.name}
                    </p>
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={m.status} />
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-1">
                      {m.status === "ACTIVE" ? (
                        <form action={freezeMembershipAction} className="flex flex-wrap items-center gap-1">
                          <input type="hidden" name="membershipId" value={m.id} />
                          <input type="hidden" name="startsAt" value={`${startLocal}T00:00`} />
                          <input type="hidden" name="endsAt" value={`${endLocal}T00:00`} />
                          <input type="hidden" name="reason" value="سفر" />
                          <Button type="submit" size="sm" variant="outline">
                            فریز ۱۴ روز
                          </Button>
                        </form>
                      ) : null}
                      {m.status === "PAUSED" ? (
                        <form action={resumeMembershipAction}>
                          <input type="hidden" name="membershipId" value={m.id} />
                          <Button type="submit" size="sm">
                            ازسرگیری
                          </Button>
                        </form>
                      ) : null}
                      <form action={extendMembershipAction} className="flex items-center gap-1">
                        <input type="hidden" name="membershipId" value={m.id} />
                        <Input name="days" type="number" defaultValue={7} className="h-8 w-16" />
                        <Button type="submit" size="sm" variant="outline">
                          تمدید
                        </Button>
                      </form>
                      {m.status !== "CANCELLED" ? (
                        <form action={cancelMembershipAction}>
                          <input type="hidden" name="membershipId" value={m.id} />
                          <Button type="submit" size="sm" variant="ghost">
                            لغو
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty message="عضویتی نیست." />
        )}
      </AdminPanel>
    </div>
  );
}
