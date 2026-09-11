import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ سوالات رایج درباره عضویت، شعب، تمرین شخصی و پنل ورزشکار BlackGYM.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PageHero
        eyebrow="سؤالات متداول"
        title="سوالات متداول"
        description="پاسخ سریع به رایج‌ترین سوالات — اگر جوابت را پیدا نکردی، با ما تماس بگیر."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
          {faqs.map((faq) => (
            <Card key={faq.id} className="border-border/80">
              <CardHeader>
                <CardTitle className="text-base leading-8">{faq.question}</CardTitle>
                <CardDescription className="text-base leading-8 text-foreground/80">
                  {faq.answer}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}

          {faqs.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              سوالی ثبت نشده است.
            </p>
          ) : null}

          <div className="pt-8 text-center">
            <p className="text-muted-foreground">سوال دیگری دارید؟</p>
            <Button className="mt-4" asChild>
              <Link href="/contact">تماس با پشتیبانی</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
