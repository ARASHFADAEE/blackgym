import type { Metadata } from "next";
import Link from "next/link";

import {
  AuthCardBody,
  AuthCardHeader,
} from "@/components/auth/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  description: "ثبت‌نام در BlackGYM و شروع مسیر تناسب اندام",
};

export default function RegisterPage() {
  return (
    <>
      <AuthCardHeader
        title="شروع مسیر"
        description="چند دقیقه تا اولین تمرین — حساب ورزشکاری بسازید."
      />
      <AuthCardBody>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="text-foreground hover:underline">
            ورود
          </Link>
        </p>
      </AuthCardBody>
    </>
  );
}
