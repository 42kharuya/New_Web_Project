"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  email: string;
}

export function AppHeader({ email }: AppHeaderProps) {
  const router = useRouter();
  const displayEmail = email.length > 20 ? email.slice(0, 20) + "…" : email;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="border-b border-slate-100">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-slate-900">
          〆トラ
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600" title={email}>
            {displayEmail}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
