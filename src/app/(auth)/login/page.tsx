import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  AuthCardBody,
  AuthCardHeader,
} from "@/components/auth/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "ورود",
  description: "ورود به پنل BlackGYM",
};

export default function LoginPage() {
  return (
    <>
      <AuthCardHeader
        title="خوش آمدید"
        description="برای دسترسی به پنل ورزشکار یا مربی وارد شوید."
      />
      <AuthCardBody>
        <Suspense fallback={<p className="text-sm text-muted-foreground">در حال بارگذاری…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          حساب ندارید؟{" "}
          <Link href="/register" className="text-foreground hover:underline">
            ثبت‌نام
          </Link>
        </p>
      </AuthCardBody>
    </>
  );
}
