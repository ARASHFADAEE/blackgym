# Architecture

## Overview

BlackGYM is a modular Next.js full-stack fitness platform. Business logic lives in feature services; UI and route handlers stay thin.

```text
Browser
  → App Router (RSC / Client)
  → Server Actions / Route Handlers
  → Feature Services
  → Prisma Repositories
  → PostgreSQL
```

## Route groups

| Group | Purpose |
|-------|---------|
| `(public)` | Marketing site, SEO |
| `(auth)` | Login / register |
| `athlete` | Athlete mobile-first app |
| `trainer` | Trainer workspace |
| `admin` | Ops dashboard |
| `api` | Auth, payments callback, AI context |

## Auth & RBAC

- Auth.js Credentials + JWT session
- Middleware guards `/athlete`, `/trainer`, `/admin`
- Server guards: `requirePermission` / `requireRoles`
- Permission matrix: `src/lib/permissions`

## Payments

Strategy pattern in `src/lib/payments`:

- `getPaymentGateway()` reads `PAYMENT_PROVIDER`
- Membership purchase creates `PENDING` payment + membership
- Callback `/api/payments/callback` verifies and activates

## AI-ready layer

`GET /api/ai/athlete-context` returns athlete membership, workout plan, progress, and history. AI must not access the database directly.

## Occupancy

Attendance check-ins update branch `currentOccupancy`. Presentation maps percent → خلوت / متوسط / شلوغ / بسیار شلوغ.

## Booking integrity

- Application conflict check on overlapping intervals
- DB unique constraint on `(trainerId, startsAt)`
- Class capacity enforced inside a transaction

## Dates

Stored as UTC `DateTime` in MySQL. Jalali formatting only in `src/lib/dates/jalali.ts` for UI.
