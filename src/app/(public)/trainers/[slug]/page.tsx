import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits, trainerEmailLocalFromSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trainer = await prisma.trainerProfile.findFirst({
    where: { user: { email: { startsWith: trainerEmailLocalFromSlug(slug) } } },
    include: { user: true },
  });
  if (!trainer) return { title: "مربی یافت نشد" };
  return {
    title: trainer.user.name,
    description: `${trainer.specialty} — ${trainer.bio.slice(0, 140)}`,
  };
}

export default async function TrainerDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const trainer = await prisma.trainerProfile.findFirst({
    where: { user: { email: { startsWith: trainerEmailLocalFromSlug(slug) } } },
    include: { user: true, branch: true },
  });

  if (!trainer) notFound();

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/trainers">
              <ChevronRight className="size-4" />
              بازگشت به مربیان
            </Link>
          </Button>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-card text-4xl font-black border border-border">
              {trainer.user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold sm:text-4xl">{trainer.user.name}</h1>
                {trainer.isFeatured ? <Badge>مربی منتخب</Badge> : null}
              </div>
              <p className="mt-2 text-lg text-muted-foreground">{trainer.specialty}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {toPersianDigits(trainer.rating.toFixed(1))} امتیاز
                </span>
                <span>{toPersianDigits(trainer.experienceYears)} سال سابقه</span>
                {trainer.branch ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {trainer.branch.name}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold">درباره مربی</h2>
            <p className="mt-4 leading-8 text-muted-foreground">{trainer.bio}</p>
          </div>
          <Card className="h-fit border-border/80">
            <CardHeader>
              <CardTitle>رزرو جلسه</CardTitle>
              <CardDescription>
                برای رزرو تمرین شخصی ابتدا ثبت‌نام کنید و از پنل ورزشکار اقدام کنید.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/register">ثبت‌نام و رزرو</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/personal-training">درباره تمرین شخصی</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
