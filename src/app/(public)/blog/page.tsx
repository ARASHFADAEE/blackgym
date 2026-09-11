import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatJalali } from "@/lib/dates/jalali";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بلاگ",
  description: "مجله سلامتی BlackGYM — مقالات تمرین، تغذیه و ریکاوری.",
};

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: { select: { name: true } } },
  });

  return (
    <>
      <PageHero
        eyebrow="مجله سلامتی"
        title="دانش تمرین، یک کلیک فاصله"
        description="مقالات کاربردی از تیم BlackGYM برای تمرین هوشمندانه‌تر."
      />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col border-border/80">
                <div className="aspect-[16/10] bg-gradient-to-br from-secondary to-accent" />
                <CardHeader>
                  {article.category ? (
                    <Badge variant="outline" className="w-fit">
                      {article.category.name}
                    </Badge>
                  ) : null}
                  <CardTitle className="text-lg leading-8">{article.title}</CardTitle>
                  <CardDescription className="leading-7 line-clamp-2">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex-col items-start gap-3 pb-6">
                  <p className="text-xs text-muted-foreground">
                    {article.author.name}
                    {article.publishedAt
                      ? ` · ${formatJalali(article.publishedAt)}`
                      : ""}
                  </p>
                  <Button variant="ghost" size="sm" asChild className="mr-auto px-0">
                    <Link href={`/blog/${article.slug}`}>
                      ادامه مطلب
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {articles.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              هنوز مقاله‌ای منتشر نشده است.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
