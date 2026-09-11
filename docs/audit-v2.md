# BlackGYM V2 — Audit Report

> Generated from live codebase audit. Implementation proceeds on this baseline (extend, don’t rewrite).

## Existing Features

- Auth.js credentials + JWT + RBAC (`src/lib/auth`, `src/middleware.ts`, `src/lib/permissions`)
- Public marketing site with DB-driven branches/plans/trainers/blog
- Athlete panel: membership buy (mock pay), workouts, bookings, progress, notifications
- Trainer panel: athletes, create/publish plans, booking status
- Admin read-only KPIs/tables (`src/app/admin/*`)
- Payments strategy (Mock live; Zibal/IDPay stubs)
- Attendance helpers (`checkIn`, occupancy) — service only, little UI
- AI context API `/api/ai/athlete-context`
- Seed + MySQL/Prisma production-ready schema baseline

## Missing Features

- CRM / Leads / Kanban / lead→athlete conversion
- Membership freeze / resume / upgrade / extend admin ops
- Invoices
- Retention health score + churn risk + recommendations
- Command Center actionable alerts
- Attendance admin/athlete UI + QR-ready source enum
- Real gateway wiring, password reset, contact→lead
- Admin write mutations (CRUD)
- Class booking UI, measurement write UI

## Broken Features

- Admin pages display-only (no mutations)
- Contact / forgot-password placeholders
- `requireActiveMembership` unused
- Athlete shell pathname not wired for mobile active nav
- STAFF role may lack `dashboard:admin` → redirect loop risk
- Workout “today” always dayIndex 0
- Streak increments without calendar-day logic
- Occupancy rarely refreshed from real check-ins

## Technical Debt

- Thin `features/` layer; pages query Prisma directly
- Duplicate KPI queries across admin pages
- No jobs/cron for expiry/scoring
- `AuditLog` unused
- Minimal tests

## Architecture Risks

- Unauthenticated GET payment callback (authority-only)
- No rate limiting
- No multi-tenant org id
- No outbox/events for async workflows

## Database Gaps

Need: `Lead`, `LeadActivity`, `MembershipFreeze`, `Invoice`, `MemberHealthScore` (or computed), richer `Attendance.source`, membership pause fields.

## UX Problems

- Admin cannot act on data
- Athlete home not a “Fitness Journey”
- No follow-up / attention queue for ops

## Security Risks

- Payment callback GET; no gateway signature
- Actions missing membership gates
- STAFF permission bug

## Performance Risks

- force-dynamic everywhere; heavy admin query fan-out; no pagination

## Recommended Refactors

1. Extract `features/admin`, `features/crm`, `features/retention`, `features/memberships` ops
2. Enforce membership gates in athlete actions
3. Fix permissions for STAFF
4. Wire AuditLog on mutations
5. Command Center driven by real aggregations + retention

## Implementation Plan (V2 execution order)

1. Schema extensions + seed CRM/freeze samples
2. Retention engine (`calculateMemberHealthScore`, `calculateChurnRisk`, recommendations)
3. Command Center rewrite (KPIs + Attention Required + actions)
4. `/admin/crm` Kanban + convert lead
5. Membership freeze/renew/extend + invoice view
6. `/admin/attendance` + `/athlete/attendance`
7. Athlete Fitness Journey home
8. Contact form → Lead; permission fixes; membership gate

**Status:** Implementation started immediately after this audit (no wait for approval).
