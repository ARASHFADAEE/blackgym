# Deploy BlackGYM on Vercel

Next.js + Prisma (**PostgreSQL**) روی Vercel. با Prisma Postgres / Neon / مشابه.

## ۱) Environment Variables

در Vercel → Project → Settings → Environment Variables (Production + Preview):

| Key | مقدار |
|-----|--------|
| `DATABASE_URL` | همان connection string Postgres (مثلاً `POSTGRES_URL`) |
| `POSTGRES_URL` | معمولاً توسط Prisma integration ست می‌شود |
| `PRISMA_DATABASE_URL` | معمولاً توسط Prisma integration ست می‌شود |
| `AUTH_SECRET` | `openssl rand -base64 32` — مقدار ضعیف را عوض کنید |
| `AUTH_URL` | `https://YOUR-PROJECT.vercel.app` (بدون اسلش انتهایی بهتر است) |
| `NEXT_PUBLIC_APP_URL` | همان URL پروداکشن |
| `PAYMENT_PROVIDER` | `mock` |
| `PAYMENT_MERCHANT_ID` | `mock-merchant` |
| `UPLOAD_PROVIDER` | `local` |
| `CRON_SECRET` | `openssl rand -base64 32` |

**مهم:** Prisma Client فقط `DATABASE_URL` را می‌خواند. اگر فقط `POSTGRES_URL` دارید، همان مقدار را برای `DATABASE_URL` هم کپی کنید.

## ۲) اعمال اسکیما روی دیتابیس

```bash
# با DATABASE_URL پروداکشن:
npx prisma db push
npm run db:seed      # اختیاری
npm run db:seed:v2   # اختیاری
```

## ۳) اتصال ریپو

1. [vercel.com](https://vercel.com) → Import همین ریپو
2. Framework: Next.js (`vercel.json`)
3. بعد از ست env → Redeploy

## ۴) Cron

`vercel.json` هر روز `06:00 UTC` مسیر `/api/cron/membership-expiry` را صدا می‌زند.

## ۵) نکات

- `.env` لوکال را کامیت نکنید.
- آپلود `local` روی Vercel ماندگار نیست.
- اگر secret را جایی پیست کردید، فوراً در پنل Prisma/Vercel آن را rotate کنید.
