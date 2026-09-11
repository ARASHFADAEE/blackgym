"use client";

import { useTransition } from "react";
import {
  convertLeadAction,
  createLeadAction,
  updateLeadStatusAction,
} from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LEAD_SOURCE_FA, LEAD_STATUS_FA } from "@/lib/i18n/fa-labels";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "TRIAL",
  "PROPOSAL",
  "WON",
  "LOST",
] as const;

type LeadCard = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  notes: string | null;
  nextFollowUpAt: string | null;
  overdue: boolean;
  branchName?: string | null;
  assigneeName?: string | null;
};

export function CrmBoard({
  columns,
  branches,
}: {
  columns: Record<string, LeadCard[]>;
  branches: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form
        action={(fd) => startTransition(() => createLeadAction(fd))}
        className="grid gap-2 rounded-2xl border border-border/80 bg-[#0d0d0d] p-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        <Input name="name" placeholder="نام لید" required />
        <Input name="phone" placeholder="موبایل" required dir="ltr" />
        <Input name="email" placeholder="ایمیل (اختیاری)" dir="ltr" />
        <select
          name="source"
          className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
          defaultValue="WALK_IN"
        >
          {Object.entries(LEAD_SOURCE_FA).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="branchId"
          className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
          defaultValue=""
        >
          <option value="">شعبه (اختیاری)</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={pending}>
          افزودن لید
        </Button>
      </form>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUSES.map((status) => (
          <div
            key={status}
            className="w-[260px] shrink-0 rounded-2xl border border-border/70 bg-[#0b0b0b]"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-3">
              <p className="text-sm font-semibold">{LEAD_STATUS_FA[status]}</p>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                {columns[status]?.length ?? 0}
              </span>
            </div>
            <div className="space-y-2 p-2">
              {(columns[status] ?? []).map((lead) => (
                <div
                  key={lead.id}
                  className={cn(
                    "rounded-xl border border-border/60 bg-white/[0.03] p-3",
                    lead.overdue && "border-destructive/40",
                  )}
                >
                  <p className="font-medium">{lead.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <span dir="ltr">{lead.phone}</span>
                    {" · "}
                    {LEAD_SOURCE_FA[lead.source] ?? lead.source}
                  </p>
                  {lead.overdue ? (
                    <p className="mt-1 text-[11px] text-destructive">پیگیری عقب‌افتاده</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {STATUSES.filter((s) => s !== status).slice(0, 3).map((next) => (
                      <form
                        key={next}
                        action={(fd) => startTransition(() => updateLeadStatusAction(fd))}
                      >
                        <input type="hidden" name="leadId" value={lead.id} />
                        <input type="hidden" name="status" value={next} />
                        <button
                          type="submit"
                          className="rounded-md border border-border/70 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                        >
                          → {LEAD_STATUS_FA[next]}
                        </button>
                      </form>
                    ))}
                    {status !== "WON" ? (
                      <form action={(fd) => startTransition(() => convertLeadAction(fd))}>
                        <input type="hidden" name="leadId" value={lead.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"
                        >
                          تبدیل به ورزشکار
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
