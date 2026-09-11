import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminKpiCard({
  label,
  value,
  hint,
  accent = false,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-[#111] to-[#0c0c0c] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        accent && "border-primary/25 from-primary/[0.08] to-[#0c0c0c]",
        className,
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-xl font-black tracking-tight md:text-2xl", accent && "text-primary")}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-[#0d0d0d]/90 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full min-w-[640px] text-right text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "bg-white/[0.03] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("border-t border-border/50 px-3 py-3 align-middle", className)}>{children}</td>;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-primary/30 bg-primary/10 text-primary",
  SUCCESS: "border-primary/30 bg-primary/10 text-primary",
  CONFIRMED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  FAILED: "border-destructive/40 bg-destructive/10 text-destructive",
  CANCELLED: "border-white/10 bg-white/5 text-muted-foreground",
  EXPIRED: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  COMPLETED: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  PAUSED: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  LOW: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  MEDIUM: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  HIGH: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  CRITICAL: "border-destructive/40 bg-destructive/10 text-destructive",
  SUPER_ADMIN: "border-primary/40 bg-primary/15 text-primary",
  ADMIN: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  TRAINER: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  ATHLETE: "border-white/15 bg-white/5 text-foreground",
  BRANCH_MANAGER: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  STAFF: "border-white/15 bg-white/5 text-muted-foreground",
};

const STATUS_FA: Record<string, string> = {
  ACTIVE: "فعال",
  SUCCESS: "موفق",
  CONFIRMED: "تأیید شده",
  PENDING: "در انتظار",
  FAILED: "ناموفق",
  CANCELLED: "لغو شده",
  EXPIRED: "منقضی",
  COMPLETED: "تکمیل",
  PAUSED: "فریز",
  LOW: "کم",
  MEDIUM: "متوسط",
  HIGH: "بالا",
  CRITICAL: "بحرانی",
  SUPER_ADMIN: "سوپرادمین",
  ADMIN: "ادمین",
  TRAINER: "مربی",
  ATHLETE: "ورزشکار",
  BRANCH_MANAGER: "مدیر شعبه",
  STAFF: "کارمند",
};

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        STATUS_STYLES[status] ?? "border-border bg-secondary text-muted-foreground",
      )}
    >
      {STATUS_FA[status] ?? status}
    </span>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/80 px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function AdminQuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group block rounded-xl border border-border/70 bg-white/[0.02] px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.06]"
    >
      <p className="text-sm font-semibold group-hover:text-primary">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </a>
  );
}
