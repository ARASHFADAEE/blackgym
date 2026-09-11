import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatJalali } from "@/lib/dates/jalali";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: "مقاله یافت نشد" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: { slug, isPublished: true },
    include: { category: true, author: { select: { name: true } } },
  });

  if (!article) notFound();

  return (
    <article className="pb-20">
      <div className="border-b border-border bg-gradient-to-b from-secondary/50 to-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/blog">
              <ChevronRight className="size-4" />
              بازگشت به بلاگ
            </Link>
          </Button>
          {article.category ? (
            <Badge variant="outline" className="mb-4">
              {article.category.name}
            </Badge>
          ) : null}
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {article.author.name}
            {article.publishedAt ? ` · ${formatJalali(article.publishedAt)}` : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-lg leading-8 text-muted-foreground">{article.excerpt}</p>
        <Separator className="my-8" />
        <div className="prose prose-invert max-w-none leading-8 text-foreground/90">
          {article.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
