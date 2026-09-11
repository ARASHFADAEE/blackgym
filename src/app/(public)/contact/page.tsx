import type { Metadata } from "next";
import { Mail, MapPin, Phone, Send } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicLeadAction } from "@/features/admin/actions";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "با تیم BlackGYM در ارتباط باشید — مشاوره عضویت، شعب و پشتیبانی.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="تماس"
        title="یک پیام فاصله تا شروع مسیر"
        description="برای مشاوره عضویت، همکاری یا پشتیبانی فرم زیر را پر کنید — درخواست شما به تیم فروش ارسال می‌شود."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <Card className="border-border/80 lg:col-span-3">
            <CardHeader>
              <CardTitle>ارسال پیام</CardTitle>
              <CardDescription>فیلدهای ستاره‌دار الزامی هستند.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={publicLeadAction} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">موبایل *</Label>
                    <Input id="phone" name="phone" type="tel" dir="ltr" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input id="email" name="email" type="email" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">پیام *</Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="border-input bg-secondary/50 text-foreground placeholder:text-muted-foreground flex w-full rounded-lg border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                  />
                </div>
                <Button type="submit">
                  <Send className="size-4" />
                  ارسال پیام
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle>اطلاعات تماس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/70" />
                  تهران، خیابان ولیعصر — دفتر مرکزی BlackGYM
                </p>
                <a
                  href="tel:+982112345678"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                  dir="ltr"
                >
                  <Phone className="size-4 shrink-0 text-foreground/70" />
                  ۰۲۱-۱۲۳۴۵۶۷۸
                </a>
                <a
                  href="mailto:hello@blackgym.ir"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                  dir="ltr"
                >
                  <Mail className="size-4 shrink-0 text-foreground/70" />
                  hello@blackgym.ir
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-base">ساعات پاسخگویی</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>شنبه تا پنجشنبه: ۹ تا ۲۱</p>
                <p className="mt-1">جمعه: ۱۰ تا ۱۸</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
