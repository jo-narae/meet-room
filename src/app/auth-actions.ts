"use server";

import type { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | null;

/** Supabase가 준 에러를 화면에 보여줄 한 줄로 바꾼다 */
function readable(error: AuthError): string {
  const code = error.code ?? "";
  const message = error.message.toLowerCase();

  if (code === "user_already_exists" || message.includes("already registered")) {
    return "이미 가입된 아이디입니다. 로그인해주세요.";
  }
  if (code === "signup_disabled" || message.includes("signups are disabled")) {
    return "지금은 가입이 막혀 있습니다. Supabase 설정에서 이메일 가입을 열어주세요.";
  }
  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.";
  }
  if (code === "weak_password") {
    return "비밀번호가 너무 단순합니다. 6자 이상으로 다시 입력해주세요.";
  }
  return `가입에 실패했습니다. (${error.message})`;
}

/** 로그인 */
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "아이디와 비밀번호를 모두 입력해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // 메일 확인이 켜져 있는 프로젝트에서만 나오는 상태. 비밀번호 문제로 오해하지 않게 따로 안내한다.
    if (error.code === "email_not_confirmed") {
      return { error: "메일함에서 확인 링크를 눌러 가입을 마쳐주세요." };
    }
    return { error: "아이디 또는 비밀번호가 맞지 않습니다." };
  }

  redirect("/");
}

/** 회원가입 */
export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();

  if (!email || !password || !displayName) {
    return { error: "아이디, 비밀번호, 이름은 필수입니다." };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상으로 입력해주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName, team: team || null } },
  });

  if (error) {
    return { error: readable(error) };
  }

  // 이미 가입된 아이디인데도 Supabase가 성공처럼 답하는 경우가 있다.
  // 이때는 identities가 빈 배열로 온다.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "이미 가입된 아이디입니다. 로그인해주세요." };
  }

  // 계정은 만들어졌지만 로그인이 되지 않은 경우.
  // Supabase의 "Confirm email"이 켜져 있으면 여기로 온다.
  if (!data.session) {
    // 확인 메일을 받은 사람이 링크를 누르면 그때부터 로그인할 수 있으므로,
    // 막다른 빨간 에러 대신 다음에 할 일을 알려준다.
    return {
      error: `${email} 로 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해주세요.`,
    };
  }

  redirect("/");
}

/** 로그아웃 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
