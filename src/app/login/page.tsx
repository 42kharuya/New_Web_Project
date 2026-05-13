import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "ログイン | 〆トラ",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-2xl font-black tracking-tight text-indigo-600">〆トラ</p>
          <p className="mt-0.5 text-xs text-gray-400">就活の締切を、逃さない。</p>
        </div>
        <h1 className="text-lg font-bold text-gray-900">
          ログイン / サインアップ
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          メールアドレスを入力するとログインリンクを送ります。
        </p>
        {/* useSearchParams を使う LoginForm は Suspense で囲む */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
