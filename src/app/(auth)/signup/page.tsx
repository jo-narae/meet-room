"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/auth-actions";
import { AuthField, ErrorMessage, SubmitButton } from "@/components/AuthField";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-base font-semibold text-neutral-900">회원가입</h2>

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
        autoComplete="new-password"
        hint="6자 이상"
        required
      />
      <AuthField
        label="이름"
        name="display_name"
        placeholder="홍지수"
        hint="예약 표에 이 이름이 표시됩니다"
        required
      />
      <AuthField label="팀" name="team" placeholder="프로덕트팀" />

      <ErrorMessage message={state?.error} />
      <SubmitButton pending={pending}>가입하고 시작하기</SubmitButton>

      <p className="pt-1 text-center text-sm text-neutral-500">
        이미 계정이 있나요?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
