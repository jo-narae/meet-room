import { logout } from "@/app/auth-actions";

export function TopBar({
  displayName,
  children,
}: {
  displayName: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-neutral-200 bg-white px-4">
      <span className="text-sm font-bold tracking-tight text-neutral-900">
        meet-room
      </span>

      <div className="flex flex-1 items-center justify-center">{children}</div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">{displayName}</span>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md px-2 py-1 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            로그아웃
          </button>
        </form>
      </div>
    </header>
  );
}
