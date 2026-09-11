import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { cn, formatToman, toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "عضویت",
  description: "پلن‌های عضویت BlackGYM — از پایه تا ویژه با امکانات شفاف و قیمت‌گذاری روشن.",
};

export default async function MembershipsPage() {
  const [plans, branches] = await Promise.all([
    prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { features: true },
    }),
    prisma.branch.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="عضویت BlackGYM"
        title="پلنی متناسب با اهداف و بودجه‌ات"
        description={`${toPersianDigits(branches)} شعبه فعال، یک استاندارد کیفی — عضویت را انتخاب کن و همان روز تمرین را شروع کن.`}
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex flex-col border-border/80",
                  plan.isPopular && "border-primary/40 shadow-[0_0_40px_rgba(184,255,60,0.08)]",
                )}
              >
                {plan.isPopular ? (
                  <Badge className="absolute -top-3 right-6">پیشنهاد ما</Badge>
                ) : null}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="leading-7">{plan.description}</CardDescription>
                  <p className="pt-3 text-3xl font-bold">{formatToman(plan.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    دوره {toPersianDigits(plan.durationDays)} روزه
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f.id} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-foreground/70" />
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex-col gap-3 pb-6">
                  <Button className="w-full" asChild>
                    <Link href="/register">خرید و ثبت‌نام</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card/50 p-8 lg:p-12">
            <SectionHeading
              align="start"
              title="چرا عضویت BlackGYM؟"
              description="شفافیت در قیمت، انعطاف در پلن‌ها و پشتیبانی واقعی از مسیر پیشرفت."
              className="mb-8 text-right"
            />
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                "بدون هزینه پنهان",
                "امکان ارتقا پلن",
                "پنل دیجیتال ورزشکار",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <Zap className="size-4 shrink-0 text-foreground/60" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
