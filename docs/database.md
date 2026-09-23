# Database

PostgreSQL + Prisma. Schema: `prisma/schema.prisma`.

## Connection

```text
# Local Docker (docker compose up -d)
DATABASE_URL="postgresql://blackgym:blackgym@127.0.0.1:5432/blackgym"

# Vercel Prisma Postgres — set DATABASE_URL to the same value as POSTGRES_URL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"
```

Prisma Client **only** reads `DATABASE_URL`. If Vercel integration created `POSTGRES_URL` / `PRISMA_DATABASE_URL`, copy that value into `DATABASE_URL` as well.

## Apply schema

```bash
npx prisma db push
npm run db:seed
```

Timestamps are stored as UTC `DateTime`. Jalali formatting only in UI (`src/lib/dates/jalali.ts`).
