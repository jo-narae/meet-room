import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 서버에서 쓰는 Supabase 연결 (로그인 여부 확인 등) */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출된 경우. 미들웨어가 세션을 갱신하므로 무시해도 된다.
          }
        },
      },
    },
  );
}
