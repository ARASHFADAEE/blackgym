import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db/prisma";
import { getSiteUrl, trainerSlugFromEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

const staticRoutes = [
  "",
  "/about",
  "/branches",
  "/trainers",
  "/memberships",
  "/services",
  "/personal-training",
  "/blog",
  "/contact",
  "/faq",
  "/login",
  "/register",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const [branches, trainers, articles] = await Promise.all([
    prisma.branch.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.trainerProfile.findMany({
      include: { user: { select: { email: true, updatedAt: true } } },
    }),
    prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const branchEntries: MetadataRoute.Sitemap = branches.map((branch) => ({
    url: `${baseUrl}/branches/${branch.slug}`,
    lastModified: branch.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const trainerEntries: MetadataRoute.Sitemap = trainers.map((trainer) => ({
    url: `${baseUrl}/trainers/${trainerSlugFromEmail(trainer.user.email)}`,
    lastModified: trainer.user.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...branchEntries, ...trainerEntries, ...articleEntries];
}
