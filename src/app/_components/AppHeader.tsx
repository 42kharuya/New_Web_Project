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
      className="sticky top-0 z-20 border-b border-[var(--rule)] bg-[var(--paper)]/90 backdrop-blur-md"
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={fadeUp.transition}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-0.5 transition-opacity hover:opacity-80"
        >
          <span className="text-lg font-black text-brand">〆</span>
          <span className="text-lg font-black text-[var(--ink)]">トラ</span>
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="hidden text-sm text-[var(--ink-3)] sm:block"
            title={email}
          >
            {displayEmail}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[var(--rule)] px-4 py-2 text-sm font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--paper-2)]"
          >
            ログアウト
          </button>
        </div>
      </div>
    </motion.header>
  );
}
