import Link from "next/link";
import Image from "next/image";
import {
  Award,
  ChevronLeft,
  Dumbbell,
  MapPin,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { HomeHero } from "@/components/marketing/home-hero";
import { OccupancyBadge } from "@/components/marketing/occupancy-badge";
import { SectionHeading } from "@/components/marketing/section-heading";
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
import { cn, formatToman, getSiteUrl, toPersianDigits, trainerSlugFromEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [
    branchCount,
    trainerCount,
    memberCount,
    avgRating,
    branches,
    plans,
    trainers,
    testimonials,
    faqs,
  ] = await Promise.all([
    prisma.branch.count({ where: { status: "ACTIVE" } }),
    prisma.trainerProfile.count(),
    prisma.user.count({ where: { role: "ATHLETE" } }),
    prisma.trainerProfile.aggregate({ _avg: { rating: true } }),
    prisma.branch.findMany({
      where: { status: "ACTIVE" },
      take: 4,
      orderBy: { name: "asc" },
      include: { facilities: { take: 3 } },
    }),
    prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { features: true },
    }),
    prisma.trainerProfile.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { rating: "desc" },
      include: { user: true, branch: true },
    }),
    prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 5,
    }),
  ]);

  return {
    stats: {
      branches: branchCount,
      trainers: trainerCount,
      members: memberCount,
      rating: avgRating._avg.rating ?? 4.8,
    },
    branches,
    plans,
    trainers,
    testimonials,
    faqs,
  };
}

const whyItems = [
  {
    icon: Dumbbell,
    title: "تجهیزات حرفه‌ای",
    description: "سالن‌های مجهز با دستگاه‌های روز دنیا برای هر سبک تمرین.",
  },
  {
    icon: Users,
    title: "مربیان مجرب",
    description: "تیم مربیگری تخصصی که برنامه را بر اساس بدن و هدف تو می‌سازد.",
  },
  {
    icon: Target,
    title: "برنامه شخصی‌سازی‌شده",
    description: "از اولین جلسه تا PR بعدی، مسیرت شفاف و قابل پیگیری است.",
  },
  {
    icon: Shield,
    title: "استاندارد بالا",
    description: "بهداشت، ایمنی و کیفیت خدمات در تمام شعب یکسان است.",
  },
] as const;

const programs = [
  {
    title: "قدرت و هایپرتروفی",
    description: "برنامه‌های دوره‌ای برای افزایش حجم و قدرت با فرم صحیح.",
    tag: "محبوب",
  },
  {
    title: "کراس‌فیت و فانکشنال",
    description: "تمرینات ترکیبی برای استقامت، انفجار و آمادگی عمومی.",
    tag: "گروهی",
  },
  {
    title: "کاهش وزن و کاندیشن",
    description: "ترکیب کاردیو، قدرتی و راهنمایی تغذیه برای رسیدن به ترکیب ایده‌آل.",
    tag: "نتایج",
  },
  {
    title: "ریکاوری و موبiliti",
    description: "حرکات اصلاحی و کشش برای پیشگیری از آسیب و بهبود دامنه حرکت.",
    tag: "تخصصی",
  },
] as const;

export default async function HomePage() {
  const { stats, branches, plans, trainers, testimonials, faqs } =
    await getHomeData();

  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BlackGYM",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description:
      "زنجیره باشگاه‌های حرفه‌ای با شعب مدرن، مربیان مجرب و برنامه‌های عضویت انعطاف‌پذیر.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "تهران",
      addressCountry: "IR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-21-12345678",
      contactType: "customer service",
      availableLanguage: "Persian",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHero />

      {/* Trust stats */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { label: "شعبه فعال", value: stats.branches, icon: MapPin },
            { label: "مربی حرفه‌ای", value: stats.trainers, icon: Award },
            { label: "عضو فعال", value: stats.members, icon: TrendingUp },
            {
              label: "رضایت اعضا",
              value: stats.rating.toFixed(1),
              icon: Star,
              suffix: "/۵",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold tracking-tight">
                  {typeof item.value === "number"
                    ? toPersianDigits(item.value)
                    : toPersianDigits(item.value)}
                  {"suffix" in item ? item.suffix : ""}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why BlackGYM */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="چرا BlackGYM"
            title="جایی که تمرین، سیستم می‌شود"
            description="هر جزئیات — از تجهیزات تا مربی و پنل دیجیتال — برای یک هدف طراحی شده: پیشرفت پایدار."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-border/80 bg-card/60">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="size-5 text-foreground" />
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

      {/* Branches preview */}
      <section className="border-y border-border bg-secondary/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="شعب BlackGYM"
            title="نزدیک‌ترین شعبه، بهترین زمان تمرین"
            description="تراکم لحظه‌ای هر شعبه را ببین و بدون معطلی برنامه‌ات را بچین."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                className="overflow-hidden border-border/80 bg-card/80 py-0"
              >
                <div className="relative aspect-[16/9] bg-secondary">
                  <Image
                    src={branch.coverImage || "/images/branch-1.jpg"}
                    alt={branch.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{branch.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {branch.address}
                      </p>
                    </div>
                    <OccupancyBadge
                      current={branch.currentOccupancy}
                      capacity={branch.capacity}
                    />
                  </div>
                </div>
                <CardContent className="pb-6">
                  <p className="text-sm leading-7 text-muted-foreground line-clamp-2">
                    {branch.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {branch.facilities.map((f) => (
                      <Badge key={f.id} variant="muted">
                        {f.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pb-6">
                  <Button variant="ghost" asChild className="mr-auto">
                    <Link href={`/branches/${branch.slug}`}>
                      جزئیات شعبه
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/branches">مشاهده همه شعب</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="برنامه‌های تمرینی"
            title="هر هدف، یک مسیر مشخص"
            description="از قدرت خالص تا ریکاوری — برنامه‌ای داریم که با سطح و زمان تو هماهنگ باشد."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <Card key={program.title} className="border-border/80">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    {program.tag}
                  </Badge>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <CardDescription className="leading-7">
                    {program.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/services">خدمات و برنامه‌ها</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured trainers */}
      <section className="border-y border-border bg-card/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="مربیان برتر"
            title="با بهترین‌ها تمرین کن"
            description="مربیان منتخب BlackGYM با تخصص‌های متنوع آماده همراهی تو در مسیر پیشرفت هستند."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="border-border/80 text-center">
                <CardHeader className="items-center">
                  <div className="flex size-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold">
                    {trainer.user.name.charAt(0)}
                  </div>
                  <CardTitle>{trainer.user.name}</CardTitle>
                  <CardDescription>{trainer.specialty}</CardDescription>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {toPersianDigits(trainer.rating.toFixed(1))}
                    <span>· {toPersianDigits(trainer.experienceYears)} سال</span>
                  </div>
                </CardHeader>
                <CardFooter className="justify-center pb-6">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/trainers/${trainerSlugFromEmail(trainer.user.email)}`}>
                      پروفایل مربی
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/trainers">همه مربیان</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Membership plans */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="عضویت"
            title="پلنی که با سبک زندگی‌ات جور دربیاید"
            description="از دسترسی پایه تا تجربه ویژه — شفاف، بدون هزینه پنهان."
          />
          <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative border-border/80",
                  plan.isPopular && "border-primary/40 shadow-[0_0_40px_rgba(184,255,60,0.08)]",
                )}
              >
                {plan.isPopular ? (
                  <Badge className="absolute -top-3 right-6">محبوب‌ترین</Badge>
                ) : null}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="leading-7">
                    {plan.description}
                  </CardDescription>
                  <p className="pt-2 text-2xl font-bold">{formatToman(plan.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {toPersianDigits(plan.durationDays)} روزه
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f.id} className="flex items-start gap-2">
                        <Zap className="mt-0.5 size-4 shrink-0 text-foreground/60" />
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pb-6">
                  <Button asChild className="w-full">
                    <Link href="/memberships">انتخاب پلن</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-secondary/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="نظر اعضا"
            title="داستان‌های واقعی از داخل سالن"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="border-border/80">
                <CardHeader>
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-8 text-foreground/90">
                    «{t.content}»
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-0 pb-6">
                  <p className="font-medium">{t.name}</p>
                  {t.role ? (
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="سوالات متداول" title="پاسخ سریع قبل از شروع" />
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="border-border/80 py-4">
                <CardHeader className="gap-2">
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                  <CardDescription className="leading-7">{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/faq">همه سوالات</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary via-card to-background px-8 py-16 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, rgba(184,255,60,0.12), transparent 55%)",
              }}
              aria-hidden
            />
            <h2 className="relative text-3xl font-bold sm:text-4xl">
              آماده‌ای قوی‌تر از دیروز باشی؟
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
              همین حالا ثبت‌نام کن، شعبه نزدیکت را انتخاب کن و اولین قدم را
              بردار.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">شروع مسیر من</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">مشاوره رایگان</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}