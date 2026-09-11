import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getActiveMembership, listMembershipPlans } from "@/features/memberships/service";
import { buyMembershipAction } from "@/features/athlete/actions";
import { formatJalali } from "@/lib/dates/jalali";
import { formatToman } from "@/lib/utils";
import { ENTITY_STATUS_FA } from "@/lib/i18n/fa-labels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AthleteMembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const [membership, plans, branches, payments] = await Promise.all([
    getActiveMembership(session!.user.id),
    listMembershipPlans(),
    prisma.branch.findMany({ where: { status: "ACTIVE" } }),
    prisma.payment.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">عضویت و پرداخت</h1>

      {sp.payment === "success" ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-primary">
          پرداخت موفق — عضویت فعال شد.
        </p>
      ) : null}
      {sp.payment === "failed" ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
          پرداخت ناموفق بود. دوباره تلاش کنید.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>وضعیت فعلی</CardTitle>
        </CardHeader>
        <CardContent>
          {membership ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold">{membership.plan.name}</p>
              <Badge>فعال</Badge>
              <p className="text-sm text-muted-foreground">
                شعبه: {membership.branch.name}
              </p>
              <p className="text-sm text-muted-foreground">
                تا {membership.endsAt ? formatJalali(membership.endsAt) : "—"}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">عضویت فعالی ندارید.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.isPopular ? "border-primary/40" : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.isPopular ? <Badge>محبوب</Badge> : null}
              </div>
              <p className="text-2xl font-black text-primary">{formatToman(plan.price)}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f.id}>• {f.label}</li>
                ))}
              </ul>
              <form action={buyMembershipAction} className="space-y-2">
                <input type="hidden" name="planId" value={plan.id} />
                <select
                  name="branchId"
                  required
                  className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <Button type="submit" className="w-full">
                  خرید / تمدید
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تاریخچه پرداخت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="flex justify-between text-sm">
              <span>{p.description ?? "پرداخت"}</span>
              <span>
                {formatToman(p.amount)} · {ENTITY_STATUS_FA[p.status] ?? p.status}
              </span>
            </div>
          ))}
          {!payments.length ? <p className="text-muted-foreground">پرداختی ثبت نشده.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
