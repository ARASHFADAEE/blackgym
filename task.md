# مأموریت اصلی

تو به‌عنوان یک **Senior Full-Stack Engineer، Software Architect، UI/UX Designer و Product Engineer** عمل کن.

هدف این پروژه، طراحی و پیاده‌سازی یک **پلتفرم Full-Stack حرفه‌ای برای باشگاه بدنسازی چندشعبه‌ای BlackGYM** است؛ نه صرفاً یک وب‌سایت معرفی باشگاه.

پروژه باید از نظر تجربه کاربری، معماری نرم‌افزار، UI/UX، Performance، SEO، Security و قابلیت توسعه، در سطح یک محصول واقعی Production-Ready ساخته شود.

---

# 1. مرجع طراحی و تحلیل اولیه

صفحه مرجع اصلی پروژه:

https://navidfallah.me/blackgym/

**این صفحه را حتماً قبل از شروع پیاده‌سازی بررسی و تحلیل کن.**

از ساختار، ایده‌ها، Information Architecture، ترتیب ارائه قابلیت‌ها، فضای بصری و مدل Product Proposal آن الهام بگیر؛ اما:

* کد یا HTML صفحه را کپی نکن.
* طراحی را عیناً Clone نکن.
* محتوا را بدون تحلیل کپی نکن.
* UI را حرفه‌ای‌تر، مدرن‌تر و Product-oriented کن.
* از Proposal به عنوان Product Specification و Business Vision استفاده کن.
* خروجی نهایی باید یک محصول واقعی و قابل استفاده باشد، نه یک Prototype صرفاً نمایشی.

مرجع شامل مفاهیمی مانند:

* وب‌سایت عمومی
* پنل ورزشکار
* پنل مربی
* مدیریت شعب
* عضویت
* پرداخت
* برنامه تمرینی
* رزرو تمرین شخصی
* مدیریت پیشرفت ورزشکار
* سیستم اعلان‌ها
* تراکم شعب
* داشبورد مدیریت
* سیستم چند شعبه‌ای
* محتوای Fitness
* پیشنهادهای هوشمند
* تجربه Mobile-first

است و باید این مفاهیم به یک معماری نرم‌افزاری واقعی تبدیل شوند.

---

# 2. هدف محصول

BlackGYM باید از یک وب‌سایت سنتی باشگاه به یک:

**Digital Fitness Ecosystem**

تبدیل شود.

یعنی کاربر فقط سایت را برای مشاهده اطلاعات نبیند؛ بلکه بتواند:

* ثبت‌نام کند
* عضو باشگاه شود
* عضویت خریداری کند
* عضویت خود را تمدید کند
* شعبه انتخاب کند
* مربی خود را ببیند
* برنامه تمرینی دریافت کند
* تمرین‌های خود را مشاهده کند
* تمرین‌ها را ثبت کند
* پیشرفت خود را بررسی کند
* تمرین شخصی رزرو کند
* کلاس رزرو کند
* اعلان دریافت کند
* پرداخت‌های خود را ببیند
* با مربی تعامل داشته باشد

و مدیریت نیز بتواند کل این اکوسیستم را از یک Dashboard کنترل کند.

---

# 3. Tech Stack

از Stack مدرن و Production-ready استفاده کن:

## Frontend / Full-Stack

* Next.js آخرین نسخه Stable
* App Router
* TypeScript
* React
* Server Components در جاهایی که مناسب هستند
* Server Actions در موارد مناسب
* Route Handlers برای API
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Framer Motion / Motion برای Animation
* React Hook Form
* Zod

## Backend

Backend باید داخل معماری Next.js و به‌صورت Full-Stack پیاده‌سازی شود.

از:

* Server Actions
* Route Handlers
* Service Layer
* Repository Pattern در بخش‌های پیچیده
* Validation Layer
* Authorization Layer

استفاده کن.

## Database

ترجیح:

* PostgreSQL
* Prisma ORM

Database باید کاملاً Relational و Normalized طراحی شود.

---

# 4. Authentication

سیستم Authentication واقعی پیاده‌سازی کن.

Roleهای اصلی:

```text
SUPER_ADMIN
ADMIN
BRANCH_MANAGER
TRAINER
ATHLETE
STAFF
```

امکان:

* Login
* Register
* Logout
* Session Management
* Password Reset
* Email / Phone verification در معماری
* Role-based Access Control
* Permission-based Access Control

را در نظر بگیر.

کاربر نباید بتواند فقط با تغییر URL به بخش غیرمجاز دسترسی پیدا کند.

Authorization باید در Server نیز بررسی شود.

---

# 5. معماری پروژه

ساختار پروژه باید Clean و Modular باشد.

از ساختن فایل‌های عظیم و Monolithic جلوگیری کن.

مثلاً ساختار مفهومی:

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── athlete/
│   ├── trainer/
│   ├── admin/
│   ├── branches/
│   ├── memberships/
│   ├── workouts/
│   ├── bookings/
│   ├── progress/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── public/
│   ├── dashboard/
│   ├── athlete/
│   ├── trainer/
│   └── admin/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── branches/
│   ├── memberships/
│   ├── workouts/
│   ├── bookings/
│   ├── trainers/
│   ├── progress/
│   ├── payments/
│   ├── notifications/
│   └── attendance/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── permissions/
│   ├── validations/
│   ├── utils/
│   └── services/
│
├── prisma/
└── types/
```

در صورت نیاز ساختار را بهتر کن، اما اصل Modular Architecture حفظ شود.

---

# 6. طراحی UI/UX

طراحی باید:

**Premium + Dark + Athletic + Modern + High Conversion**

باشد.

از فضای بصری Proposal مرجع الهام بگیر اما آن را برای یک SaaS/Fitness Product واقعی ارتقا بده.

## رنگ‌بندی پیشنهادی

Base:

```text
#050505
#080808
#0D0D0D
#111111
```

Text:

```text
#FFFFFF
#E5E5E5
#A3A3A3
#737373
```

Accent:

یک Accent قدرتمند ورزشی انتخاب کن؛ ترجیحاً:

```text
Electric Lime / Neon Green
```

اما از Neon بیش از حد استفاده نکن.

Accent فقط برای:

* CTA
* Active state
* Progress
* مهم‌ترین Metric
* لینک‌های مهم
* Highlight

استفاده شود.

---

# 7. Typography

UI باید Typography قدرتمند داشته باشد.

برای فارسی:

* Vazirmatn
  یا
* IRANYekan / IRANYekanX

برای متن انگلیسی:

* Inter
* Geist

استفاده کن.

Headingها باید Bold و بزرگ باشند.

از متن‌های ریز و UI شلوغ جلوگیری کن.

---

# 8. RTL

کل پروژه:

```text
dir="rtl"
lang="fa"
```

باشد.

تقویم و تاریخ‌های قابل مشاهده برای کاربر باید با **Jalali / Persian Calendar** کار کنند.

در Database تاریخ‌ها استاندارد ذخیره شوند و فقط Presentation Layer به Jalali تبدیل شود.

---

# 9. Public Website

وب‌سایت عمومی باید شامل:

## Home

Hero قدرتمند:

* تصویر/ویدیوی سینمایی باشگاه
* Headline قدرتمند
* Subheadline
* CTA اصلی
* CTA ثانویه
* تعداد شعب
* تعداد اعضا
* مربیان
* امتیاز کاربران

مثلاً:

```text
قوی‌تر از دیروز

باشگاه فقط محل تمرین نیست؛
سیستمی برای ساختن نسخه بهتر توست.
```

CTA:

```text
شروع مسیر من
مشاهده شعب
```

---

# 10. Homepage Sections

صفحه اصلی حداقل شامل:

1. Hero
2. Trust / Statistics
3. Why BlackGYM
4. Branches
5. Training Programs
6. Trainers
7. Membership Plans
8. Transformation / Results
9. Fitness Experience
10. Personal Training
11. Testimonials
12. FAQ
13. CTA
14. Footer

باشد.

---

# 11. Branch System

BlackGYM چند شعبه‌ای است.

برای هر شعبه:

```text
name
slug
description
address
phone
latitude
longitude
working_hours
facilities
images
trainers
capacity
current_occupancy
status
```

داشته باش.

صفحه:

```text
/branches
/branches/[slug]
```

ایجاد شود.

---

# 12. Smart Branch Capacity

سیستم تراکم شعبه طراحی کن.

نمایش:

```text
خلوت
متوسط
شلوغ
بسیار شلوغ
```

و در Dashboard:

```text
Current Occupancy
Maximum Capacity
Occupancy Percentage
Peak Hours
```

نمایش داده شود.

در فاز MVP می‌توان داده‌ها را از Attendance واقعی تولید کرد.

---

# 13. Athlete Dashboard

پنل ورزشکار باید Mobile-first باشد.

Dashboard شامل:

```text
سلام آرش 👋

عضویت من
برنامه تمرینی امروز
جلسه بعدی
مربی من
درصد پیشرفت
وزن فعلی
رکوردهای شخصی
اعلان‌ها
```

باشد.

---

# 14. Membership

سیستم Membership واقعی بساز.

Entity:

```text
MembershipPlan
Membership
MembershipFeature
MembershipPayment
MembershipRenewal
```

مثلاً:

```text
Basic
Premium
VIP
Personal Training
```

هر Membership شامل:

* شروع
* پایان
* وضعیت
* شعبه
* امکانات
* قیمت
* تخفیف
* پرداخت‌ها

باشد.

---

# 15. Payment Architecture

Payment را طوری طراحی کن که Gateway قابل تعویض باشد.

مثلاً:

```text
PaymentGateway
├── ZibalGateway
├── IDPayGateway
└── MockGateway
```

Business Logic نباید مستقیماً به یک Payment Provider وابسته باشد.

Payment status:

```text
PENDING
SUCCESS
FAILED
CANCELLED
REFUNDED
```

باشد.

---

# 16. Workout Management

سیستم برنامه تمرینی حرفه‌ای.

مدل مفهومی:

```text
WorkoutPlan
WorkoutDay
Exercise
WorkoutExercise
WorkoutLog
```

هر Exercise:

```text
name
description
muscle_group
equipment
video_url
instructions
```

و Workout Exercise:

```text
sets
reps
weight
rest_seconds
tempo
notes
```

داشته باشد.

---

# 17. Trainer Dashboard

مربی باید بتواند:

* ورزشکاران خود را ببیند
* برنامه تمرینی بسازد
* برنامه را ویرایش کند
* تمرین جدید اضافه کند
* برنامه را منتشر کند
* Progress ورزشکار را مشاهده کند
* درخواست‌های ورزشکار را ببیند
* Personal Training را مدیریت کند

---

# 18. Personal Training Booking

سیستم رزرو تمرین شخصی.

User:

```text
Trainer
Date
Time
Branch
Duration
Status
```

را انتخاب کند.

Status:

```text
PENDING
CONFIRMED
COMPLETED
CANCELLED
```

باشد.

از Double Booking جلوگیری کن.

در سطح Database و Application باید Race Condition مدیریت شود.

---

# 19. Class Booking

برای کلاس‌های گروهی نیز معماری قابل توسعه داشته باش:

```text
Class
ClassSchedule
ClassBooking
ClassCapacity
```

هر کلاس:

```text
title
trainer
branch
capacity
start_at
end_at
```

داشته باشد.

---

# 20. Progress Tracking

ورزشکار بتواند:

* وزن
* درصد چربی
* اندازه بدن
* رکوردهای قدرتی
* تعداد تمرین
* PR
* تاریخچه

را مشاهده کند.

Dashboard باید نمودار داشته باشد.

مثلاً:

```text
Weight Progress
Strength Progress
Workout Frequency
Body Measurements
```

---

# 21. Gamification

یک سیستم Gamification ساده ولی قابل توسعه طراحی کن.

مثلاً:

```text
XP
Levels
Achievements
Badges
Streak
Personal Records
```

مثلاً:

```text
7 روز تمرین متوالی
30 جلسه تمرین
اولین PR
100kg Bench Press
```

---

# 22. Notification System

سیستم Notification مرکزی بساز.

Notificationها:

* عضویت در حال اتمام
* تمدید موفق
* برنامه تمرینی جدید
* پیام مربی
* رزرو تأیید شد
* رزرو لغو شد
* یادآوری تمرین
* اعلان باشگاه

باشد.

مدل:

```text
Notification
NotificationPreference
```

داشته باش.

---

# 23. Admin Dashboard

Admin باید بتواند:

### Users

* مشاهده
* ایجاد
* ویرایش
* حذف/غیرفعال‌سازی
* Role

### Branches

* مدیریت شعب
* ظرفیت
* ساعات کاری
* امکانات

### Trainers

* مدیریت مربیان
* تخصص
* شعبه
* ورزشکاران

### Memberships

* Plans
* Members
* Payments
* Renewals

### Workouts

* Exercises
* Workout Plans

### Bookings

* PT
* Classes

### Analytics

* Members
* Revenue
* Active Membership
* Expired Membership
* Branch Performance
* Occupancy
* Trainer Performance

---

# 24. Dashboard UI

Admin Dashboard نباید شبیه یک Admin Template قدیمی باشد.

از:

* Bento Grid
* Charts
* KPI Cards
* Data Tables
* Filters
* Search
* Command Menu
* Quick Actions

استفاده کن.

KPI:

```text
Active Members
Monthly Revenue
Today's Attendance
Expiring Memberships
Branch Occupancy
New Members
```

---

# 25. Mobile UX

Mobile را Desktop کوچک‌شده طراحی نکن.

Mobile باید یک تجربه واقعی باشد.

در Mobile:

* Bottom Navigation
* Sticky CTA
* Swipe Cards
* Touch-friendly buttons
* Bottom Sheets
* Mobile Filters
* Mobile Dashboard

در نظر بگیر.

---

# 26. Proposal-inspired Visual Language

از ساختار Proposal مرجع برای تبدیل UI به Storytelling استفاده کن.

به‌جای اینکه صفحه صرفاً مجموعه‌ای از Cardها باشد، Flow داشته باشد:

```text
Problem
↓
Vision
↓
Experience
↓
Programs
↓
Trainers
↓
Membership
↓
Transformation
↓
Join BlackGYM
```

صفحه باید حس یک Brand Experience بدهد.

از:

* Full-width Sections
* Huge Typography
* Numbered Sections
* Scroll Reveal
* Sticky Sections
* Image overlays
* Gradient lighting
* Subtle grain
* Glass effect محدود
* Border highlights
* Motion

استفاده کن.

---

# 27. Animation

Animation باید Premium و هدفمند باشد.

استفاده از Motion برای:

* Hero reveal
* Scroll reveal
* Card hover
* Number counters
* Page transitions
* Progress animation
* Modal
* Drawer
* Navigation

مجاز است.

اما:

**از Animation بیش از حد استفاده نکن.**

Performance اولویت دارد.

ترجیحاً:

```text
transform
opacity
scale
translate
```

را به جای animationهای سنگین layout استفاده کن.

---

# 28. SEO

Public Website باید SEO-ready باشد.

پیاده‌سازی:

* Metadata API
* Open Graph
* Twitter Cards
* Sitemap
* Robots
* Canonical
* Structured Data
* Organization Schema
* LocalBusiness Schema
* SportsActivityLocation در صورت مناسب بودن
* Breadcrumb Schema

صفحات باید Dynamic Metadata داشته باشند.

---

# 29. Performance

هدف:

```text
Lighthouse Performance: 90+
```

تا حد امکان.

استفاده از:

* Server Components
* Image Optimization
* next/image
* Lazy Loading
* Dynamic Imports
* Caching
* Streaming
* Suspense

در جای مناسب.

از Client Component بی‌دلیل استفاده نکن.

---

# 30. Security

موارد زیر را جدی پیاده‌سازی کن:

* Authentication Security
* Authorization
* CSRF protection در مسیرهای لازم
* Input Validation
* Zod
* SQL Injection protection
* XSS protection
* Rate Limiting
* Secure Cookies
* Password Hashing
* Server-side permission checks
* File upload validation
* API protection
* Audit Logs

هیچ اطلاعات حساس را در Client Component یا Browser expose نکن.

---

# 31. Database

Prisma Schema را اصولی طراحی کن.

حداقل Entityها:

```text
User
Role
Permission

Branch
BranchFacility

TrainerProfile
AthleteProfile

MembershipPlan
Membership
Payment

Exercise
WorkoutPlan
WorkoutDay
WorkoutExercise
WorkoutLog

PersonalTraining
Booking
FitnessClass
ClassSchedule
ClassBooking

ProgressMeasurement
StrengthRecord

Notification
NotificationPreference

Achievement
UserAchievement

Attendance

Article
Category
```

Foreign Keyها، Indexها و Unique Constraintها را اصولی تعریف کن.

---

# 32. Seed Data

Seed واقعی برای Demo ایجاد کن:

```text
4 Branches
10+ Trainers
20+ Exercises
Multiple Membership Plans
Demo Athletes
Workout Plans
Bookings
Payments
Notifications
Progress Records
```

اطلاعات Demo باید واقع‌گرایانه باشند.

---

# 33. Persian UX

تمام متن‌های UI فارسی باشند.

مثلاً:

```text
داشبورد
ورزشکاران
مربیان
شعب
عضویت‌ها
پرداخت‌ها
برنامه تمرینی
رزروها
پیشرفت
اعلان‌ها
تنظیمات
```

اعداد و تاریخ‌ها در Presentation Layer فارسی/شمسی باشند.

---

# 34. Empty / Loading / Error States

هیچ صفحه‌ای نباید فقط برای حالت موفق طراحی شود.

برای همه Featureها:

```text
Loading
Empty
Error
Success
Unauthorized
Forbidden
Not Found
```

طراحی کن.

Skeleton Loading حرفه‌ای ایجاد کن.

---

# 35. Toast / Feedback

برای عملیات:

```text
ثبت موفق
ویرایش موفق
پرداخت موفق
رزرو موفق
خطا
عدم دسترسی
```

Feedback مناسب بده.

---

# 36. Accessibility

رعایت:

* Keyboard Navigation
* Focus States
* aria-label
* Semantic HTML
* Color Contrast
* Screen Reader compatibility

تا حد امکان.

---

# 37. Code Quality

قوانین:

* TypeScript strict
* No `any` مگر واقعاً ضروری
* No duplicated business logic
* No giant components
* No giant files
* No hard-coded business rules
* No inline magic values
* Reusable components
* Typed API responses
* Centralized validation
* Centralized permissions

---

# 38. Environment

فایل:

```text
.env.example
```

ایجاد کن.

مثلاً:

```env
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=

PAYMENT_PROVIDER=
PAYMENT_MERCHANT_ID=

UPLOAD_PROVIDER=
```

Secretها را داخل Repository قرار نده.

---

# 39. Documentation

یک README حرفه‌ای ایجاد کن.

README شامل:

```text
Project Overview
Features
Tech Stack
Architecture
Installation
Environment Variables
Database Setup
Prisma Migration
Seed
Development
Production Build
Deployment
Security
Folder Structure
Roles & Permissions
Payment Architecture
Future Roadmap
```

باشد.

همچنین یک فایل:

```text
docs/architecture.md
```

و:

```text
docs/database.md
```

ایجاد کن.

---

# 40. مراحل اجرای پروژه

قبل از Coding:

### Phase 1

تحلیل کامل صفحه مرجع:

https://navidfallah.me/blackgym/

### Phase 2

طراحی:

* Information Architecture
* User Flow
* Database ERD
* Route Map
* Permission Matrix

### Phase 3

Setup:

* Next.js
* TypeScript
* Tailwind
* shadcn
* Prisma
* PostgreSQL
* Auth

### Phase 4

ساخت Design System.

### Phase 5

Public Website.

### Phase 6

Authentication.

### Phase 7

Athlete Dashboard.

### Phase 8

Trainer Dashboard.

### Phase 9

Admin Dashboard.

### Phase 10

Membership + Payment.

### Phase 11

Workout + Progress.

### Phase 12

Booking + Attendance.

### Phase 13

Notification.

### Phase 14

SEO + Performance + Security.

### Phase 15

Testing.

---

# 41. Testing

حداقل:

* Unit Test برای Business Logic مهم
* Integration Test برای API / Server Actions مهم
* E2E برای مسیرهای اصلی

سناریوهای حیاتی:

```text
Register
Login
Buy Membership
Payment Callback
Renew Membership
Create Workout
Book Trainer
Cancel Booking
Track Progress
Admin Permission
Trainer Permission
Athlete Permission
```

---

# 42. Important Business Rules

این موارد باید Server-side enforce شوند:

### Membership

کاربر بدون Membership فعال نباید به امکانات Premium دسترسی داشته باشد.

### Booking

یک Trainer نباید در یک زمان برای دو نفر رزرو شود.

### Class

ظرفیت کلاس نباید بیشتر از مقدار تعیین‌شده شود.

### Branch

ظرفیت شعبه باید در محاسبات Attendance لحاظ شود.

### Trainer

مربی فقط ورزشکاران مجاز خودش را مدیریت کند.

### Admin

سطح دسترسی Admin و Super Admin متفاوت باشد.

---

# 43. Progressive Product Architecture

سیستم را طوری بساز که بعداً بتوانیم موارد زیر را اضافه کنیم:

```text
Mobile App
QR Check-in
Fingerprint Integration
Smart Recommendations
AI Fitness Assistant
Wearable Integration
Advanced Analytics
SMS
Telegram Notifications
Push Notifications
Subscription Billing
Multi-tenant Architecture
```

اما در MVP چیزی را بدون نیاز پیچیده نکن.

Architecture باید:

**Simple now, scalable later**

باشد.

---

# 44. AI-ready Architecture

ساختار سیستم را برای AI آماده کن.

بعداً بتوانیم APIهایی مانند:

```text
/get-athlete-context
/get-workout-history
/get-progress
/get-membership
```

را به AI متصل کنیم.

AI نباید مستقیماً به Database دسترسی داشته باشد.

یک Service/API Layer برای آن ایجاد شود.

---

# 45. Final UI Standard

خروجی نباید شبیه:

```text
Admin Template
Bootstrap Website
Generic SaaS
AI-generated landing page
```

باشد.

باید شبیه یک محصول واقعی Premium Fitness باشد.

الهام بصری:

```text
Apple-level spacing
Linear-level UI clarity
Vercel-level typography
Premium Fitness branding
Modern SaaS dashboards
```

اما بدون کپی مستقیم از هیچ برند یا محصول.

---

# 46. مهم‌ترین اصل

**اول کیفیت محصول، بعد تعداد Featureها.**

اگر بین:

```text
10 قابلیت متوسط
```

و:

```text
5 قابلیت کاملاً حرفه‌ای
```

مجبور به انتخاب شدی، گزینه دوم را انتخاب کن.

---

# 47. Definition of Done

پروژه زمانی کامل محسوب می‌شود که:

* [ ] Application اجرا شود
* [ ] Database migration بدون خطا باشد
* [ ] Seed اجرا شود
* [ ] Authentication کار کند
* [ ] Roles کار کنند
* [ ] Public Website کامل باشد
* [ ] Athlete Dashboard کامل باشد
* [ ] Trainer Dashboard کامل باشد
* [ ] Admin Dashboard کامل باشد
* [ ] Membership کار کند
* [ ] Payment Architecture آماده باشد
* [ ] Workout Management کار کند
* [ ] Booking کار کند
* [ ] Progress Tracking کار کند
* [ ] Notifications کار کند
* [ ] Responsive باشد
* [ ] RTL کامل باشد
* [ ] Jalali UI پیاده‌سازی شده باشد
* [ ] SEO پیاده‌سازی شده باشد
* [ ] Security بررسی شده باشد
* [ ] Error/Loading/Empty states وجود داشته باشد
* [ ] README کامل باشد
* [ ] Architecture Documentation وجود داشته باشد
* [ ] Demo Seed Data وجود داشته باشد
* [ ] Build بدون Error انجام شود
* [ ] TypeScript Error وجود نداشته باشد
* [ ] ESLint Error مهم وجود نداشته باشد

---

# 48. نحوه اجرای کار توسط تو

قبل از شروع، Repository فعلی را بررسی کن.

اگر پروژه از قبل فایل دارد:

**هیچ چیز را بدون بررسی حذف نکن.**

ابتدا:

1. ساختار پروژه را تحلیل کن.
2. Dependencies فعلی را بررسی کن.
3. فایل‌های موجود را بررسی کن.
4. Architecture فعلی را بررسی کن.
5. سپس Plan بده.
6. بعد Implementation را مرحله‌به‌مرحله انجام بده.

اگر چیزی در پروژه وجود ندارد، آن را اصولی ایجاد کن.

بعد از هر Phase:

* TypeScript check
* Lint
* Build
* تست Feature

را انجام بده.

---

# 49. مهم

در طول پیاده‌سازی از من برای تصمیم‌های کوچک و قابل حل سؤال نپرس.

خودت بر اساس:

* Best Practices
* Product Thinking
* UX
* Security
* Scalability
* Maintainability

تصمیم بگیر.

فقط اگر تصمیمی واقعاً نیازمند اطلاعات Business است که از Context قابل استنتاج نیست، آن را مشخص کن.

---

# 50. خروجی نهایی

در پایان باید یک **BlackGYM Full-Stack Digital Fitness Platform** داشته باشیم که:

```text
Public Website
        ↓
Authentication
        ↓
Athlete Experience
        ↓
Trainer Experience
        ↓
Branch Management
        ↓
Membership
        ↓
Payment
        ↓
Workout
        ↓
Booking
        ↓
Progress
        ↓
Notifications
        ↓
Admin Analytics
```

را در یک سیستم یکپارچه ارائه کند.

محصول باید از نظر UI/UX بسیار Premium، از نظر معماری Modular، از نظر Performance سریع، از نظر Security امن، از نظر SEO استاندارد و از نظر توسعه آینده‌نگر باشد.

**از همین حالا پروژه را تحلیل کن، ابتدا Architecture Plan را استخراج کن و سپس Implementation را شروع کن.**
