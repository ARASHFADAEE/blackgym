import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Target, UserCheck } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatToman } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تمرین شخصی",
  description: "پکیج تمرین شخصی BlackGYM — جلسات یک‌به‌یک با مربی، برنامه اختصاصی و پیگیری هفتگی.",
};

const steps = [
  {
    icon: UserCheck,
    title: "انتخاب مربی",
    description: "مربی متناسب با هدف و شعبه‌ات را از لیست مربیان انتخاب کن.",
  },
  {
    icon: Target,
    title: "ارزیابی اولیه",
    description: "فرم، سطح آمادگی و اهدافت ثبت می‌شود تا برنامه دقیق ساخته شود.",
  },
  {
    icon: Clock,
    title: "جلسات منظم",
    description: "هر جلسه ۶۰ دقیقه با تمرکز روی فرم، شدت و پیشرفت تدریجی.",
  },
  {
    icon: CheckCircle2,
    title: "پیگیری و تنظیم",
    description: "برنامه هر هفته بر اساس عملکرد و بازخوردت به‌روز می‌شود.",
  },
] as const;

export default function PersonalTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="تمرین شخصی"
        title="تمرین شخصی — سریع‌ترین مسیر به نتیجه"
        description="وقتی زمان محدود است یا هدف مشخص دارید، تمرین شخصی تفاوت را از همان هفته اول نشان می‌دهد."
      />

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="border-border/80">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <CardDescription className="leading-7">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">پکیج تمرین شخصی + عضویت ویژه</h2>
          <p className="mt-4 text-muted-foreground leading-8">
            شامل عضویت وی‌آی‌پی، ۸ جلسه تمرین شخصی، برنامه اختصاصی و پیگیری
            هفتگی توسط مربی.
          </p>
          <p className="mt-6 text-3xl font-bold">{formatToman(9_500_000)}</p>
          <p className="mt-1 text-sm text-muted-foreground">ماهانه</p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/register">
              رزرو مشاوره رایگان
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>سوالی دارید؟</CardTitle>
              <CardDescription>
                تیم پشتیبانی BlackGYM برای انتخاب مربی و پلن مناسب کنار شماست.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/contact">تماس با ما</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
