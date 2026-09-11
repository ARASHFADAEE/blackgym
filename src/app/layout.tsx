import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlackGYM | باشگاه ورزشی حرفه‌ای",
    template: "%s | BlackGYM",
  },
  description:
    "BlackGYM — زنجیره باشگاه‌های حرفه‌ای با شعب مدرن، مربیان مجرب، برنامه‌های عضویت انعطاف‌پذیر و تجربه‌ای متفاوت از تناسب اندام.",
  keywords: [
    "باشگاه ورزشی",
    "فیتنس",
    "بدنسازی",
    "عضویت باشگاه",
    "BlackGYM",
    "مربی خصوصی",
  ],
  authors: [{ name: "BlackGYM" }],
  creator: "BlackGYM",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "BlackGYM",
    title: "BlackGYM | باشگاه ورزشی حرفه‌ای",
    description:
      "تمرین حرفه‌ای، تجهیزات مدرن و مربیان مجرب — مسیر رسیدن به بهترین نسخه خودتان از اینجا شروع می‌شود.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
