"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/auth-actions";
import { AuthField, ErrorMessage, SubmitButton } from "@/components/AuthField";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-base font-semibold text-neutral-900">로그인</h2>

      <AuthField
        label="아이디"
        name="email"
        type="email"
        placeholder="hong@company.com"
        autoComplete="email"
        required
      />
      <AuthField
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      <ErrorMessage message={state?.error} />
      <SubmitButton pending={pending}>로그인</SubmitButton>

      <p className="pt-1 text-center text-sm text-neutral-500">
        아직 계정이 없나요?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
