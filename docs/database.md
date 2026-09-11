# Database

MySQL (MAMP) + Prisma. Schema: `prisma/schema.prisma`.

Default local URL:

```text
mysql://root:root@127.0.0.1:8889/fdssskdksdk
```

## Core entities

- **User** — auth identity, role, XP/level/streak
- **AthleteProfile / TrainerProfile** — role-specific data; trainer↔athlete assignment
- **Branch** — multi-location with capacity & occupancy
- **MembershipPlan / Membership / Payment** — commerce
- **Exercise / WorkoutPlan / WorkoutDay / WorkoutExercise / WorkoutLog**
- **Booking** — personal training (unique trainer slot)
- **FitnessClass / ClassSchedule / ClassBooking**
- **ProgressMeasurement / StrengthRecord**
- **Notification / NotificationPreference**
- **Achievement / UserAchievement**
- **Attendance**
- **Article / Category / Faq / Testimonial**
- **AuditLog**

## Important constraints

| Constraint | Purpose |
|------------|---------|
| `User.email` unique | Identity |
| `Branch.slug` unique | Public URLs |
| `Booking (trainerId, startsAt)` unique | No double-book race |
| `ClassBooking (scheduleId, athleteId)` unique | One seat per athlete |
| Indexes on membership status/endsAt | Expiry queries |
| Indexes on attendance branch+time | Occupancy |

## Enums

Roles, membership/payment/booking statuses, muscle groups, notification types, occupancy levels.

## Seed

`npm run db:seed` creates 4 branches, 10 trainers, plans, demo athlete with active Premium membership, workouts, bookings, progress, notifications, FAQs, articles.

Demo password: `password123`
