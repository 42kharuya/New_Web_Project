"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "./AppHeader";

const PUBLIC_PATHS = ["/", "/login", "/terms", "/privacy", "/legal"];

export function ConditionalHeader({ email }: { email: string }) {
  const pathname = usePathname();
  if (PUBLIC_PATHS.includes(pathname)) return null;
  return <AppHeader email={email} />;
}
