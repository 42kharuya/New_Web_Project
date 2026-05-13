import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/features/auth/session";

/** Server Component 用: 未認証なら /login へリダイレクト、認証済みなら session を返す */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
