# BlackGYM — پلتفرم دیجیتال فیتنس چندشعبه‌ای

> سند هماهنگی محصول برای تیم‌های **مارکتینگ، فروش، عملیات و مدیریت**.  
> هدف: تصمیم‌گیری اینکه آیا این سیستم ارزش جایگزینی وب‌سایت/فرآیندهای فعلی را دارد یا نه.

---

## ۱) این سیستم چیست؟ (یک جمله)

**BlackGYM** فقط سایت معرفی باشگاه نیست؛ یک **اکوسیستم دیجیتال** است که ورزشکار، مربی، شعبه، عضویت، پرداخت، تمرین، رزرو و اعلان‌ها را در یک سامانه یکپارچه نگه می‌دارد.

```text
وب‌سایت تبدیل‌محور  →  ثبت‌نام/ورود  →  پنل ورزشکار
                                      →  پنل مربی
                                      →  پنل مدیریت کل
```

---

## ۲) ارزش برای مارکتینگ و کسب‌وکار

| مشکل فعلی باشگاه‌ها | پاسخ BlackGYM |
|---------------------|----------------|
| سایت فقط بروشور است؛ بعد از خرید تعامل قطع می‌شود | چرخه مداوم: عضویت → تمرین → رزرو → تمدید |
| تمدید عضویت دستی / فراموشی تاریخ انقضا | اعلان انقضا + خرید/تمدید آنلاین |
| رزرو PT با تماس و پیام‌رسان | تقویم رزرو با جلوگیری از تداخل زمانی |
| نبود داده برای کمپین و نگهداشت | داشبورد درآمد، عضو فعال، انقضا، حضور، عملکرد شعبه |
| چند شعبه بدون تصویر واحد | مدیریت ۴+ شعبه + نمایش تراکم برای کاربر |
| وابستگی محتوا به کانال‌های پراکنده | بلاگ، FAQ، پلن عضویت و لندینگ‌های تبدیل |

### خروجی قابل اندازه‌گیری برای مارکتینگ

- **Conversion:** CTAهای «شروع مسیر من» / «خرید عضویت» روی سایت عمومی
- **Retention:** برنامه تمرینی + پیشرفت + اعلان داخل پنل
- **Upsell:** پلن‌های Basic / Premium / VIP / Personal Training
- **Local SEO:** صفحات شعبه، مربی، مقاله + sitemap/robots
- **Brand:** تجربه پریمیوم دارک/اتلتیک (نه قالب ادمین عمومی)

---

## ۳) نقش‌ها و تجربه هر نقش

| نقش | مسیر ورود | چه کار می‌کند |
|-----|-----------|----------------|
| بازدیدکننده | `/` | مشاهده برند، شعب، مربیان، پلن‌ها، بلاگ |
| ورزشکار (`ATHLETE`) | `/athlete` | عضویت، تمرین، رزرو، پیشرفت، اعلان |
| مربی (`TRAINER`) | `/trainer` | ورزشکاران، برنامه، رزرو PT |
| مدیر شعبه / ادمین / سوپرادمین | `/admin` | کاربران، شعب، پرداخت، تحلیل، محتوا |

**اکانت دمو (رمز همه: `password123`)**

| ایمیل | نقش |
|-------|-----|
| `admin@blackgym.ir` | SUPER_ADMIN |
| `athlete@blackgym.ir` | ATHLETE |
| `ali.trainer@blackgym.ir` | TRAINER |

---

## ۴) نقشه قابلیت‌ها (ماژول‌ها)

### A) وب‌سایت عمومی (ویترین + تبدیل)

| مسیر | کاربرد مارکتینگ |
|------|------------------|
| `/` | Hero برند، آمار اعتماد، چرا BlackGYM، شعب، مربیان، پلن، نظرات، FAQ، CTA |
| `/about` | داستان برند |
| `/branches`, `/branches/[slug]` | مقایسه شعب + تراکم |
| `/trainers`, `/trainers/[slug]` | پروفایل مربی برای اعتماد |
| `/memberships` | قیمت‌گذاری شفاف |
| `/services`, `/personal-training` | لندینگ خدمات / PT |
| `/blog`, `/blog/[slug]` | محتوای فیتنس / SEO |
| `/contact`, `/faq` | پشتیبانی و رفع ابهام |

### B) احراز هویت

`/login` · `/register` · `/forgot-password`  
نقش‌محور؛ بعد از ورود ریدایرکت به داشبورد درست.

### C) پنل ورزشکار (Mobile-first)

`/athlete` · workouts · bookings · progress · membership · notifications · settings

### D) پنل مربی

`/trainer` · athletes · plans · bookings

### E) پنل مدیریت (کنترل کل عملیات)

`/admin` · users · branches · memberships · payments · bookings · analytics · content

### F) APIهای عملیاتی

- `/api/auth/*` — نشست و ورود
- `/api/payments/callback` — بازگشت درگاه
- `/api/ai/athlete-context` — لایه آماده اتصال AI (بدون دسترسی مستقیم به DB)

---

## ۵) ساختار کامل پروژه (Folder Structure)

```text
blacksport/
├── README.md                 ← این سند (هماهنگی تیم‌ها)
├── task.md                   ← بریف کامل محصول
├── package.json
├── docker-compose.yml        ← اختیاری (Postgres قدیمی؛ پروژه روی MySQL/MAMP است)
├── .env.example
├── prisma/
│   ├── schema.prisma         ← مدل داده کامل
│   └── seed.ts               ← داده دمو واقعی
├── docs/
│   ├── architecture.md
│   └── database.md
├── tests/
│   └── unit/
├── public/
└── src/
    ├── middleware.ts         ← گارد مسیر athlete/trainer/admin
    ├── app/
    │   ├── layout.tsx        ← RTL fa + فونت + Providers
    │   ├── globals.css       ← Design tokens
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── (public)/         ← سایت مارکتینگ
    │   │   ├── page.tsx      ← Homepage
    │   │   ├── about/
    │   │   ├── branches/[slug]/
    │   │   ├── trainers/[slug]/
    │   │   ├── memberships/
    │   │   ├── services/
    │   │   ├── personal-training/
    │   │   ├── blog/[slug]/
    │   │   ├── contact/
    │   │   └── faq/
    │   ├── (auth)/           ← login / register
    │   ├── athlete/          ← پنل ورزشکار
    │   ├── trainer/          ← پنل مربی
    │   ├── admin/            ← پنل مدیریت
    │   └── api/
    │       ├── auth/[...nextauth]/
    │       ├── payments/callback/
    │       └── ai/athlete-context/
    ├── components/
    │   ├── ui/               ← Button, Card, Input, Badge, ...
    │   ├── layout/           ← Public / Athlete / Trainer / Admin shells
    │   ├── marketing/        ← Hero, Section, Occupancy
    │   ├── admin/            ← کامپوننت‌های اختصاصی ادمین
    │   ├── auth/
    │   └── providers/
    ├── features/             ← منطق کسب‌وکار (نه UI خام)
    │   ├── auth/
    │   ├── memberships/
    │   ├── payments/         ← از طریق lib/payments
    │   ├── bookings/
    │   ├── workouts/
    │   ├── progress/
    │   ├── notifications/
    │   ├── attendance/
    │   ├── athlete/
    │   └── trainer/
    ├── lib/
    │   ├── auth/
    │   ├── db/
    │   ├── permissions/      ← ماتریس نقش/دسترسی
    │   ├── payments/         ← Mock / Zibal / IDPay
    │   ├── dates/            ← Jalali فقط در UI
    │   ├── validations/
    │   └── utils.ts
    └── types/                ← (در صورت نیاز)
```

---

## ۶) معماری داده (خلاصه برای تصمیم‌گیری)

موجودیت‌های اصلی:  
`User` · `Branch` · `MembershipPlan` · `Membership` · `Payment` · `Trainer/Athlete Profile` · `WorkoutPlan` · `Booking` · `Class` · `Progress` · `Notification` · `Attendance` · `Article`

قوانین سخت کسب‌وکار:

- بدون عضویت فعال → محدودیت امکانات پریمیوم
- مربی در یک زمان برای دو نفر رزرو نمی‌شود
- ظرفیت کلاس رعایت می‌شود
- مربی فقط ورزشکاران خودش را می‌بیند

جزئیات: [`docs/database.md`](docs/database.md)

---

## ۷) آیا ارزش دارد از این سیستم استفاده شود؟

### بله، اگر:

- چند شعبه دارید و می‌خواهید عملیات + تجربه عضو یکپارچه شود
- هدف مارکتینگ فقط لید نیست؛ **نگهداشت و تمدید** هم مهم است
- می‌خواهید محتوای SEO و پلن عضویت به پنل واقعی وصل باشد
- آماده‌اید پرداخت آنلاین و نقش‌های مربی/ادمین را جدی بگیرید

### هنوز زود است، اگر:

- فقط یک لندینگ استاتیک می‌خواهید
- فرآیند عضویت کاملاً حضوری می‌ماند و پنل استفاده نمی‌شود
- تیم عملیات برای وارد کردن مربی/برنامه/حضور آمادگی ندارد

### توصیه تصمیم‌گیری (مارکتینگ + مدیریت)

1. سایت عمومی را به‌عنوان **قیف تبدیل** ببینید (نه فقط برندبوک).  
2. پنل ورزشکار را به‌عنوان **محصول نگهداشت** ببینید.  
3. پنل ادمین را برای **KPI هفتگی** استفاده کنید: عضو فعال، درآمد، انقضا، تراکم شعب.  
4. اگر این سه لایه با هم ارزش دارند → سیستم ارزش دارد؛ اگر فقط لایه ۱ لازم است → سایت سبک‌تر کافی است.

---

## ۸) Tech Stack (برای تیم فنی)

| لایه | تکنولوژی |
|------|----------|
| Frontend/Full-stack | Next.js 16 App Router + TypeScript |
| UI | Tailwind 4 + کامپوننت‌های shadcn-style + Motion |
| DB | MySQL (MAMP پورت `8889`) + Prisma |
| Auth | Auth.js (NextAuth v5) + RBAC |
| Validation | Zod |
| Payment | Strategy: Mock / Zibal / IDPay |

---

## ۹) راه‌اندازی لوکال

```bash
npm install

# MAMP → MySQL روشن، دیتابیس ساخته شده
# نمونه فعلی:
# DATABASE_URL="mysql://root:root@127.0.0.1:8889/fdssskdksdk"

cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

آدرس: [http://localhost:3000](http://localhost:3000)  
پنل ادمین: [http://localhost:3000/admin](http://localhost:3000/admin)

### اسکریپت‌ها

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run db:push
npm run db:seed
npm run db:studio
```

---

## ۱۰) امنیت (خلاصه)

- هش رمز با bcrypt  
- چک دسترسی در Server + Middleware  
- اعتبارسنجی Zod  
- Secret فقط در `.env`  
- درگاه پرداخت جدا از منطق کسب‌وکار

---

## ۱۱) Roadmap آینده

SMS/Push · دستیار AI گفت‌وگویی · اپ موبایل · Multi-tenant · پیش‌بینی تراکم · پرداخت جلسه تمرین شخصی

---

## ۱۲) اسناد مرتبط

- [`docs/architecture.md`](docs/architecture.md) — لایه‌ها و جریان سیستم  
- [`docs/database.md`](docs/database.md) — ER و قیدها  
- [`docs/coverage-about.md`](docs/coverage-about.md) — پوشش نسبت به پروپوزال `about.html`  
- [`task.md`](task.md) — بریف کامل محصول

---

**BlackGYM** · Gym Operating System V2 · Private

---

## V2 Gym OS (جدید)

لایه‌های محصول: **Sales (CRM)** · **Operations** · **Experience** · **Intelligence (Retention/AI)**

| مسیر | قابلیت |
|------|--------|
| `/admin` | Command Center با KPI واقعی + Attention Required |
| `/admin/crm` | پایپلاین فروش Kanban + تبدیل لید→ورزشکار |
| `/admin/retention` | Health Score / Churn Risk / Recommended Actions |
| `/admin/attendance` | چک‌این پذیرش / QR / ثبت اثرانگشت |
| `/kiosk/[slug]` | گیشه شعبه (QR + شبیه‌ساز اثرانگشت) |
| `/admin/memberships` | Freeze / Resume / Extend / Cancel |
| `/admin/invoices/[id]` | فاکتور پرداخت موفق |
| `/athlete/attendance` | کد QR + چک‌این ورزشکار |
| `/athlete/classes` | رزرو کلاس گروهی |
| `/athlete/leaderboard` | جدول رتبه‌بندی |
| `/athlete` | Fitness Journey |
| `/athlete/attendance` | حضور ورزشکار |

جزئیات Audit: [`docs/audit-v2.md`](docs/audit-v2.md)

```bash
npm run db:push
npm run db:seed
npm run db:seed:v2   # لیدها + فاکتور + health scores
```

