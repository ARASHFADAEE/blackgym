# Deploy BlackGYM on Vercel

Next.js + Prisma (MySQL) روی Vercel. قبل از اولین دپلوی یک دیتابیس MySQL رایگان/هاست‌شده لازم است.

## ۱) پیش‌نیاز دیتابیس

یک MySQL ریموت بسازید (مثلاً Railway، Aiven، PlanetScale، TiDB Cloud، یا سرور خودتان) و اسکیما را اعمال کنید:

```bash
# روی ماشین لوکال، با DATABASE_URL پروداکشن:
export DATABASE_URL="mysql://USER:PASS@HOST:3306/DB?connection_limit=1"
npx prisma db push
npm run db:seed        # اختیاری — داده دمو
# npm run db:seed:v2   # اختیاری — داده V2
```

برای Serverless روی Vercel حتماً `connection_limit=1` (یا connection pooler) استفاده کنید.

## ۲) اتصال ریپو به Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → همین ریپو (`blackgym` / `blacksport`)
2. Framework: **Next.js** (از `vercel.json` هم خوانده می‌شود)
3. Root Directory: `.` (ریشه پروژه)
4. Build Command: از `vercel.json` → `prisma generate && next build`

## ۳) Environment Variables (Production + Preview)

| Key | مثال / توضیح |
|-----|----------------|
| `DATABASE_URL` | connection string MySQL ریموت |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://YOUR-PROJECT.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | همان URL پروداکشن |
| `PAYMENT_PROVIDER` | فعلاً `mock` |
| `PAYMENT_MERCHANT_ID` | خالی تا اتصال درگاه واقعی |
| `UPLOAD_PROVIDER` | `local` (فایل‌های آپلود روی Vercel ماندگار نیستند) |
| `CRON_SECRET` | `openssl rand -base64 32` — برای Cron عضویت |

بعد از ست کردن متغیرها، یک **Redeploy** بزنید.

## ۴) Cron

`vercel.json` هر روز ساعت `06:00 UTC` مسیر `/api/cron/membership-expiry` را صدا می‌زند.  
Vercel به صورت خودکار هدر `Authorization: Bearer <CRON_SECRET>` را می‌فرستد اگر `CRON_SECRET` در env باشد — مسیر همین مقدار را چک می‌کند.

## ۵) بعد از دپلوی

- سایت عمومی: `/`
- لاگین: `/login`
- اکانت دمو (اگر seed زده باشید): `admin@blackgym.ir` / `password123`

## ۶) نکات مهم

- فایل `.env` لوکال را **هرگز** کامیت نکنید (در `.gitignore` است).
- آپلود `local` روی filesystem Vercel ماندگار نیست؛ برای پروداکشن واقعی بعداً S3/R2 را وصل کنید.
- اگر بیلد به خاطر Prisma شکست خورد، مطمئن شوید `postinstall` / `prisma generate` اجرا شده و `DATABASE_URL` حداقل در Build هم تعریف شده باشد (Prisma برای generate معمولاً به DB وصل نمی‌شود، اما بعضی setupها به env نیاز دارند).
