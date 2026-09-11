import {
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      athlete: { include: { user: true } },
      trainer: { include: { user: true } },
      branch: true,
    },
    orderBy: { startsAt: "desc" },
    take: 100,
  });

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="رزروها"
        description={`تمرین شخصی · تأییدشده ${toPersianDigits(confirmed)} · در انتظار ${toPersianDigits(pending)}`}
      />

      <AdminPanel title="جلسات تمرین شخصی" description="هماهنگی بین ورزشکار، مربی و شعبه">
        {bookings.length ? (
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>ورزشکار</AdminTh>
                <AdminTh>مربی</AdminTh>
                <AdminTh>شعبه / زمان</AdminTh>
                <AdminTh>وضعیت</AdminTh>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02]">
                  <AdminTd className="font-medium">{b.athlete.user.name}</AdminTd>
                  <AdminTd>{b.trainer.user.name}</AdminTd>
                  <AdminTd>
                    <p>{b.branch.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatJalaliDateTime(b.startsAt)}
                    </p>
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={b.status} />
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty message="رزروی ثبت نشده است." />
        )}
      </AdminPanel>
    </div>
  );
}
