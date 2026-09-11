"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function KioskClient({
  branchId,
  branchName,
}: {
  branchId: string;
  branchName: string;
}) {
  const [code, setCode] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitCode() {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/kiosk/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, branchId, source: "QR" }),
      });
      const data = await res.json();
      setMessage(data.message ?? (res.ok ? "انجام شد" : "خطا"));
      if (res.ok) setCode("");
    });
  }

  function submitFingerprint() {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/kiosk/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceTemplateId: templateId, branchId }),
      });
      const data = await res.json();
      setMessage(data.message ?? (res.ok ? "انجام شد" : "خطا"));
      if (res.ok) setTemplateId("");
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 px-4 py-10">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">گیشه هوشمند</p>
        <h1 className="mt-1 text-3xl font-black">{branchName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">ورود / خروج با کد QR یا اثرانگشت</p>
      </div>

      {message ? (
        <p className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-center text-primary">
          {message}
        </p>
      ) : null}

      <section className="space-y-3 rounded-3xl border border-border bg-card p-5">
        <h2 className="font-bold">کد QR ورزشکار</h2>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="کد ۶ کاراکتری"
          dir="ltr"
          className="h-14 text-center text-2xl tracking-widest"
        />
        <Button className="h-12 w-full" disabled={pending || !code} onClick={submitCode}>
          ثبت با کد
        </Button>
      </section>

      <section className="space-y-3 rounded-3xl border border-border bg-card p-5">
        <h2 className="font-bold">شبیه‌ساز اثرانگشت دستگاه</h2>
        <p className="text-xs text-muted-foreground">
          دستگاه واقعی شناسه قالب را به این API می‌فرستد. برای تست، همان شناسه‌ای را بزنید که در
          پنل ادمین ثبت کرده‌اید.
        </p>
        <Input
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          placeholder="شناسه قالب دستگاه"
          dir="ltr"
          className="h-12"
        />
        <Button
          className="h-12 w-full"
          variant="outline"
          disabled={pending || !templateId}
          onClick={submitFingerprint}
        >
          اسکن اثرانگشت
        </Button>
      </section>
    </div>
  );
}
