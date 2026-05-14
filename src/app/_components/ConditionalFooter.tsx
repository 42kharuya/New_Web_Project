"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LP_PATHS = ["/"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (LP_PATHS.includes(pathname)) return null;

  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--paper-2)] py-4 text-center text-xs text-[var(--ink-4)]">
      <nav className="space-x-4">
        <Link href="/terms" className="hover:underline">
          利用規約
        </Link>
        <Link href="/privacy" className="hover:underline">
          プライバシーポリシー
        </Link>
        <Link href="/legal" className="hover:underline">
          特定商取引法に基づく表記
        </Link>
        <a href="mailto:support@shimetra.com" className="hover:underline">
          お問い合わせ
        </a>
      </nav>
    </footer>
  );
}
