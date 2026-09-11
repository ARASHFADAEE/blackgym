"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-border">
      <Image
        src="/images/hero-gym.jpg"
        alt="فضای تمرین حرفه‌ای BlackGYM"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/70 to-black/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,255,60,0.12),transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-6 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
            زنجیره باشگاه‌های حرفه‌ای
          </p>

          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl">
            Black<span className="text-primary">GYM</span>
          </h1>

          <p className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            قوی‌تر از دیروز
          </p>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
            باشگاه فقط محل تمرین نیست؛ سیستمی برای ساختن نسخه بهتر توست. تجهیزات
            مدرن، مربیان مجرب و برنامه‌ای که با اهدافت هم‌راستا می‌شود.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link href="/register">
                شروع مسیر من
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 border-white/20 bg-black/30 px-8 text-base text-white backdrop-blur hover:bg-black/50 hover:text-white"
            >
              <Link href="/branches">
                <MapPin className="size-4" />
                مشاهده شعب
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
