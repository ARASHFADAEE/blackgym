import type { Metadata } from "next";
import Link from "next/link";
import { AuthCardBody, AuthCardHeader } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "بازیابی رمز عبور",
  description: "بازیابی رمز عبور BlackGYM",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <>
      <AuthCardHeader
        title="بازیابی رمز عبور"
        description="ایمیل حساب را وارد کنید تا لینک تنظیم رمز جدید ساخته شود."
      />
      <AuthCardBody>
        {sp.sent ? (
          <p className="mb-4 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
            اگر ایمیل در سیستم باشد، لینک بازیابی ارسال شده است.
          </p>
        ) : null}
        {sp.error === "expired" ? (
          <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            لینک منقضی شده؛ دوباره تلاش کنید.
          </p>
        ) : null}
        <form action={requestPasswordResetAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" name="email" type="email" required dir="ltr" />
          </div>
          <Button type="submit" className="w-full">
            ادامه
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            بازگشت به ورود
          </Link>
        </p>
      </AuthCardBody>
    </>
  );
}
