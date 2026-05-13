"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

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
    <motion.header
      className="border-b border-indigo-100 bg-white"
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={fadeUp.transition}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link
          href="/dashboard"
          className="text-lg font-black text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          〆トラ
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="text-sm text-slate-600 hidden sm:block"
            title={email}
          >
            {displayEmail}
          </span>
          <button
            onClick={handleLogout}
            className="min-h-[44px] min-w-[44px] rounded-md border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </motion.header>
  );
}
