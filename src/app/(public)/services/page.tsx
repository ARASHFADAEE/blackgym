import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Dumbbell,
  HeartPulse,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "خدمات",
  description: "خدمات BlackGYM — سالن بدنسازی، کلاس گروهی، ارزیابی بدن، ریکاوری و بیشتر.",
};

const services = [
  {
    icon: Dumbbell,
    title: "سالن قدرت و بدنسازی",
    description: "تجهیزات حرفه‌ای برای تمرینات قدرتی، هایپرتروفی و پاورلیفتینگ.",
  },
  {
    icon: Users,
    title: "کلاس‌های گروهی",
    description: "کراس‌فیت، HIIT و تمرینات فانکشنال با ظرفیت کنترل‌شده.",
  },
  {
    icon: HeartPulse,
    title: "کاردیو و استقامت",
    description: "تردمیل، دوچرخه، روئینگ و برنامه‌های کاندیشنینگ.",
  },
  {
    icon: Sparkles,
    title: "ارزیابی و آنالیز بدن",
    description: "اندازه‌گیری ترکیب بدنی و تنظیم برنامه بر اساس داده.",
  },
  {
    icon: Calendar,
    title: "برنامه‌ریزی هوشمند",
    description: "برنامه هفتگی در پنل ورزشکار با یادآوری و پیگیری.",
  },
  {
    icon: Zap,
    title: "ریکاوری و موبiliti",
    description: "کشش، فوم رولر و جلسات اصلاحی برای پیشگیری از آسیب.",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="خدمات"
        title="هر آنچه برای پیشرفت نیاز داری"
        description="BlackGYM فقط سالن نیست — مجموعه‌ای از خدمات یکپارچه برای تمرین، ریکاوری و پیگیری."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="border-border/80">
                  <CardHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="leading-7">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              برای تمرین یک‌به‌یک با مربی اختصاصی، پکیج تمرین شخصی را ببینید.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/personal-training">تمرین شخصی</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
