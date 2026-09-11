import type { Metadata } from "next";
import Link from "next/link";
import { AuthCardBody, AuthCardHeader } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "تنظیم رمز جدید",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string; error?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.token || !sp.email) {
    return (
      <>
        <AuthCardHeader title="لینک نامعتبر" description="از صفحه بازیابی دوباره شروع کنید." />
        <AuthCardBody>
          <Button asChild className="w-full">
            <Link href="/forgot-password">بازیابی رمز</Link>
          </Button>
        </AuthCardBody>
      </>
    );
  }

  return (
    <>
      <AuthCardHeader title="رمز جدید" description="رمز عبور تازه را وارد کنید." />
      <AuthCardBody>
        {sp.error ? (
          <p className="mb-4 text-sm text-destructive">رمز نامعتبر یا تکرار آن مطابقت ندارد.</p>
        ) : null}
        <form action={resetPasswordAction} className="space-y-4">
          <input type="hidden" name="token" value={sp.token} />
          <input type="hidden" name="email" value={sp.email} />
          <div className="space-y-2">
            <Label htmlFor="password">رمز جدید</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تکرار رمز</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
            />
          </div>
          <Button type="submit" className="w-full">
            ذخیره رمز
          </Button>
        </form>
      </AuthCardBody>
    </>
  );
}
