import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, team")
    .eq("id", user.id)
    .single();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("sort_order");

  return (
    <div className="flex h-dvh flex-col">
      <TopBar displayName={profile?.display_name ?? "이름 없음"} />

      <main className="flex flex-1 items-center justify-center bg-neutral-50 p-8">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-900">
            로그인되었습니다 ✓
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            회의실 {rooms?.length ?? 0}개가 준비되어 있습니다 —{" "}
            {rooms?.map((r) => r.name).join(", ")}
          </p>
          <p className="mt-4 text-xs text-neutral-400">
            이 자리에 M3에서 예약 표가 들어갑니다.
          </p>
        </div>
      </main>
    </div>
  );
}
