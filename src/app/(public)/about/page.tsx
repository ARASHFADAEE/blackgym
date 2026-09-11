import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Target, Users, Zap } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "داستان BlackGYM، ماموریت ما و چرا هزاران ورزشکار به ما اعتماد کرده‌اند.",
};

const values = [
  {
    icon: Target,
    title: "تمرکز بر نتیجه",
    description: "هر تصمیم — از تجهیزات تا برنامه — بر پیشرفت measurable شماست.",
  },
  {
    icon: Users,
    title: "جامعه ورزشکاران",
    description: "محیطی که انگیزه، رقابت سالم و حمایت در آن جریان دارد.",
  },
  {
    icon: Heart,
    title: "سلامت پایدار",
    description: "تمرین ایمن با توجه به ریکاوری، فرم و نیازهای فردی.",
  },
  {
    icon: Zap,
    title: "نوآوری مداوم",
    description: "پنل دیجیتال، تراکم هوشمند شعب و ابزارهای پیگیری پیشرفت.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="درباره BlackGYM"
        title="بیش از یک باشگاه — یک اکوسیستم رشد"
        description="BlackGYM از ۱۳۹۵ با هدف ارائه تجربه تمرین حرفه‌ای در سطح بین‌المللی در ایران شکل گرفت. امروز با چند شعبه فعال، تیم مربیگری متخصص و پلتفرم دیجیتال یکپارچه، مسیر تناسب اندام را برای هزاران ورزشکار هموار کرده‌ایم."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                align="start"
                eyebrow="ماموریت"
                title="ساختن نسخه قوی‌تر از دیروز"
                description="ما معتقدیم هر کسی — از مبتدی تا حرفه‌ای — شایسته محیطی است که به او احترام بگذارد، برنامه شفاف بدهد و نتیجه واقعی بسازد."
                className="mb-0 text-right"
              />
              <p className="mt-6 leading-8 text-muted-foreground">
                در BlackGYM، تمرین فقط تکرار حرکت نیست. سیستمی است از ارزیابی اولیه،
                برنامه‌ریزی، پیگیری در پنل ورزشکار، رزرو جلسات و جشن گرفتن PRهای
                جدید. ما شعب را با استانداردهای یکسان مدیریت می‌کنیم تا هر جا که
                باشید، همان کیفیت را تجربه کنید.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/training-atmosphere.jpg"
                alt="فضای تمرین BlackGYM"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="ارزش‌های ما" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-border/80">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="leading-7">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">آماده‌ای بخشی از داستان باشی؟</h2>
          <p className="mt-4 text-muted-foreground">
            به جمع ورزشکاران BlackGYM بپیوند و تفاوت را از همان هفته اول حس کن.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/register">
              شروع مسیر من
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
