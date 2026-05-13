import { NextRequest, NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/features/auth/session";

type AuthSuccess = { ok: true; session: SessionPayload };
type AuthFailure = { ok: false; response: NextResponse };

/** Route Handler 用: 未認証なら 401 レスポンスを返す discriminated union */
export async function requireAuth(
  req: NextRequest,
): Promise<AuthSuccess | AuthFailure> {
  const session = await getSession(req);
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "ログインが必要です" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
