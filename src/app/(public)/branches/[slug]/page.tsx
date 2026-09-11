import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Phone } from "lucide-react";

import { OccupancyBadge } from "@/components/marketing/occupancy-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOccupancyInfo } from "@/features/attendance/service";
import { getOccupancyHistory } from "@/features/attendance/kiosk";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits, trainerSlugFromEmail } from "@/lib/utils";
import { formatJalaliDateTime } from "@/lib/dates/jalali";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const dayLabels: Record<string, string> = {
  sat: "شنبه",
  sun: "یکشنبه",
  mon: "دوشنبه",
  tue: "سه‌شنبه",
  wed: "چهارشنبه",
  thu: "پنجشنبه",
  fri: "جمعه",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await prisma.branch.findUnique({ where: { slug } });
  if (!branch) return { title: "شعبه یافت نشد" };
  return {
    title: branch.name,
    description: branch.description.slice(0, 160),
  };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const branch = await prisma.branch.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      facilities: true,
      images: { orderBy: { sortOrder: "asc" } },
      trainers: { include: { user: true }, take: 6 },
    },
  });

  if (!branch) notFound();

  const occupancy = getOccupancyInfo(branch.currentOccupancy, branch.capacity);
  const hours = branch.workingHours as Record<string, string>;
  const history = await getOccupancyHistory(branch.id, 24);
  const maxOcc = Math.max(branch.capacity, ...history.map((h) => h.occupancy), 1);

  return (
    <>
      <section className="relative border-b border-border">
        <div className="relative aspect-[21/9] max-h-[420px] w-full bg-secondary">
          <Image
            src={branch.coverImage || "/images/branch-1.jpg"}
            alt={branch.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-4 mt-6" asChild>
            <Link href="/branches">
              <ChevronRight className="size-4" />
              بازگشت به شعب
            </Link>
          </Button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{branch.name}</h1>
              <p className="mt-3 flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-1 size-4 shrink-0" />
                {branch.address}
              </p>
            </div>
            <OccupancyBadge
              current={branch.currentOccupancy}
              capacity={branch.capacity}
              className="self-start text-sm"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            ظرفیت: {toPersianDigits(branch.currentOccupancy)} از{" "}
            {toPersianDigits(branch.capacity)} نفر ({toPersianDigits(occupancy.percent)}٪ —{" "}
            {occupancy.label})
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold">تراکم ۲۴ ساعت اخیر</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                بر اساس ورود/خروج واقعی اعضا (دستی، QR، پذیرش یا اثرانگشت)
              </p>
              {history.length ? (
                <div className="mt-4 flex h-40 items-end gap-1 rounded-2xl border border-border/70 bg-secondary/30 p-3">
                  {history.slice(-48).map((h) => (
                    <div
                      key={h.id}
                      title={`${formatJalaliDateTime(h.capturedAt)} — ${h.occupancy}`}
                      className="flex-1 rounded-t bg-primary/70"
                      style={{ height: `${Math.max(8, (h.occupancy / maxOcc) * 100)}%` }}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  هنوز سابقه تراکم ثبت نشده — با اولین چک‌این ساخته می‌شود.
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">درباره این شعبه</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{branch.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">امکانات</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {branch.facilities.map((f) => (
                  <Badge key={f.id} variant="outline">
                    {f.name}
                  </Badge>
                ))}
              </div>
            </div>

            {branch.trainers.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold">مربیان این شعبه</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {branch.trainers.map((trainer) => (
                    <Card key={trainer.id} className="border-border/80 py-4">
                      <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <div className="flex size-12 items-center justify-center rounded-full bg-secondary font-bold">
                          {trainer.user.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{trainer.user.name}</CardTitle>
                          <CardDescription>{trainer.specialty}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link
                          href={`/trainers/${trainerSlugFromEmail(trainer.user.email)}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          مشاهده پروفایل
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle>اطلاعات تماس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href={`tel:${branch.phone.replace(/-/g, "")}`}
                  className="flex items-center gap-2 text-sm hover:text-primary"
                  dir="ltr"
                >
                  <Phone className="size-4 shrink-0" />
                  {branch.phone}
                </a>
                <Separator />
                <div>
                  <p className="mb-3 text-sm font-medium">ساعات کاری</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {Object.entries(hours).map(([key, value]) => (
                      <li key={key} className="flex justify-between gap-4">
                        <span>{dayLabels[key] ?? key}</span>
                        <span dir="ltr">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" asChild>
              <Link href="/memberships">خرید عضویت این شعبه</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
