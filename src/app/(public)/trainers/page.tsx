import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
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
import { toPersianDigits, trainerSlugFromEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مربیان",
  description: "تیم مربیگری BlackGYM — متخصصان بدنسازی، کراس‌فیت، قدرت و تمرین شخصی.",
};

export default async function TrainersPage() {
  const trainers = await prisma.trainerProfile.findMany({
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
    include: { user: true, branch: true },
  });

  return (
    <>
      <PageHero
        eyebrow="تیم مربیگری"
        title="مربیانی که مسیرت را روشن می‌کنند"
        description="هر مربی BlackGYM با تخصص، تجربه و تعهد به فرم صحیح انتخاب شده است."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="border-border/80">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-xl font-bold">
                      {trainer.user.name.charAt(0)}
                    </div>
                    {trainer.isFeatured ? (
                      <Badge variant="outline">منتخب</Badge>
                    ) : null}
                  </div>
                  <CardTitle>{trainer.user.name}</CardTitle>
                  <CardDescription>{trainer.specialty}</CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {toPersianDigits(trainer.rating.toFixed(1))}
                    <span>· {toPersianDigits(trainer.experienceYears)} سال تجربه</span>
                  </div>
                  {trainer.branch ? (
                    <p className="text-xs text-muted-foreground">{trainer.branch.name}</p>
                  ) : null}
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground line-clamp-3">
                    {trainer.bio}
                  </p>
                </CardContent>
                <CardFooter className="pb-6">
                  <Button variant="ghost" asChild className="mr-auto">
                    <Link href={`/trainers/${trainerSlugFromEmail(trainer.user.email)}`}>
                      پروفایل کامل
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
