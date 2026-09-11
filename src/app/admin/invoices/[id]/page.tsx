import { notFound } from "next/navigation";
import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/ui";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { prisma } from "@/lib/db/prisma";
import { formatToman } from "@/lib/utils";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      user: true,
      payment: true,
      membership: { include: { plan: true, branch: true } },
    },
  });
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`فاکتور ${invoice.number}`} description="جزئیات پرداخت موفق" />
      <AdminPanel title="فاکتور" description="قابل ارائه به مشتری و حسابداری">
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-muted-foreground">شماره فاکتور</dt>
            <dd className="font-bold">{invoice.number}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">مشتری</dt>
            <dd className="font-bold">{invoice.user.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">عضویت</dt>
            <dd>{invoice.membership?.plan.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">مبلغ</dt>
            <dd className="font-bold text-primary">{formatToman(invoice.amount)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">روش پرداخت</dt>
            <dd>{invoice.method === "mock" ? "آزمایشی" : invoice.method}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">شناسه تراکنش</dt>
            <dd dir="ltr">{invoice.transactionId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">تاریخ</dt>
            <dd>{formatJalaliDateTime(invoice.issuedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">شعبه</dt>
            <dd>{invoice.membership?.branch.name ?? "—"}</dd>
          </div>
        </dl>
      </AdminPanel>
    </div>
  );
}
