import Link from "next/link";
import { AtSign, Dumbbell, Mail, MapPin, Phone, Send } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { href: "/branches", label: "شعب و امکانات" },
  { href: "/trainers", label: "مربیان حرفه‌ای" },
  { href: "/memberships", label: "پلن‌های عضویت" },
  { href: "/blog", label: "مجله سلامتی" },
] as const;

const supportLinks = [
  { href: "/contact", label: "تماس با ما" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/privacy", label: "حریم خصوصی" },
  { href: "/terms", label: "قوانین و مقررات" },
] as const;

const socialLinks = [
  { href: "https://instagram.com", label: "اینستاگرام", icon: AtSign },
  { href: "https://t.me", label: "تلگرام", icon: Send },
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Dumbbell className="size-4" />
              </span>
              <span>
                Black<span className="text-primary">GYM</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              BlackGYM زنجیره باشگاه‌های حرفه‌ای با تجهیزات مدرن، مربیان
              مجرب و برنامه‌های تمرینی شخصی‌سازی‌شده — جایی که هر جلسه، یک
              قدم به سمت بهترین نسخه خودتان است.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              دسترسی سریع
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              پشتیبانی
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              ارتباط با ما
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>تهران، خیابان ولیعصر — شعبه مرکزی BlackGYM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href="tel:+982112345678"
                  className="transition-colors hover:text-primary"
                  dir="ltr"
                >
                  ۰۲۱-۱۲۳۴۵۶۷۸
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href="mailto:hello@blackgym.ir"
                  className="transition-colors hover:text-primary"
                  dir="ltr"
                >
                  hello@blackgym.ir
                </a>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {currentYear} BlackGYM. تمامی حقوق محفوظ است.
          </p>
          <p className="text-xs">
            طراحی شده برای ورزشکارانی که مرزها را جابه‌جا می‌کنند.
          </p>
        </div>
      </div>
    </footer>
  );
}
