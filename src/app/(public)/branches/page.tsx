import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Phone } from "lucide-react";

import { OccupancyBadge } from "@/components/marketing/occupancy-badge";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "شعب",
  description: "لیست شعب BlackGYM با تراکم لحظه‌ای، آدرس و امکانات هر شعبه.",
};

export default async function BranchesPage() {
  const branches = await prisma.branch.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
    include: { facilities: true },
  });

  return (
    <>
      <PageHero
        eyebrow="شعب BlackGYM"
        title="شعبه‌ای نزدیک تو، استانداردی در سطح جهانی"
        description="تراکم لحظه‌ای هر شعبه را ببین و بهترین زمان برای تمرین را انتخاب کن."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {branches.map((branch) => (
              <Card key={branch.id} className="overflow-hidden border-border/80 py-0">
                <div className="relative aspect-[16/9] bg-secondary">
                  <Image
                    src={branch.coverImage || "/images/branch-1.jpg"}
                    alt={branch.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                    <h2 className="text-xl font-bold">{branch.name}</h2>
                    <OccupancyBadge
                      current={branch.currentOccupancy}
                      capacity={branch.capacity}
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardDescription className="leading-7">{branch.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{branch.address}</p>
                  <div className="flex flex-wrap gap-2">
                    {branch.facilities.map((f) => (
                      <Badge key={f.id} variant="muted">
                        {f.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3 border-t border-border pb-6">
                  <Button asChild>
                    <Link href={`/branches/${branch.slug}`}>
                      جزئیات شعبه
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`tel:${branch.phone.replace(/-/g, "")}`} dir="ltr">
                      <Phone className="size-4" />
                      {branch.phone}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {branches.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              در حال حاضر شعبه فعالی ثبت نشده است.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
