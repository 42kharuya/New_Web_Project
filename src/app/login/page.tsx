import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { NotificationToast } from "./_components/NotificationToast";

export const metadata = {
  title: "ログイン | 〆トラ",
};

function SealLogo() {
  return (
    <div
      style={{ animation: "wiggle 2s ease-in-out infinite" }}
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-4xl font-black text-white shadow-lg shadow-brand/30"
    >
      〆
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* 〆印章ロゴ＋キャッチコピー＋通知トースト */}
        <div className="text-center space-y-4">
          <SealLogo />
          <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">
            締切を、出し忘れない人生に。
          </h1>
          {/* useSearchParams を使う LoginForm は Suspense で囲む */}
          <Suspense>
            <NotificationToast />
          </Suspense>
        </div>

        {/* ログインフォーム */}
        <div className="rounded-2xl border border-[var(--rule)] bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--ink)]">
            ログイン / サインアップ
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-3)]">
            メールアドレスを入力するとログインリンクを送ります。
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
