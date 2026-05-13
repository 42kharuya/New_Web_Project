
import { requireSession } from "@/lib/auth";
import { getUserPlan } from "@/features/deadlines/gate";
import { UpgradeButton } from "./UpgradeButton";
import { PortalButton } from "./PortalButton";

const FEATURES = [
  { label: "締切アイテム登録数", free: "最大 10 件", pro: "無制限" },
  { label: "メール通知タイミング", free: "24時間前のみ", pro: "72h / 24h / 3h 前" },
  { label: "ダッシュボード", free: "✅", pro: "✅" },
];

export default async function BillingPage() {
  const session = await requireSession();
  const plan = await getUserPlan(session.sub);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">プランとお支払い</h1>

      {plan === "pro" && (
        <p className="mt-3 rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
          ✅ 現在 <strong>Pro</strong> プランをご利用中です。
        </p>
      )}

      {/* Free / Pro カード比較 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Free カード */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Free</p>
          <p className="mt-1 text-3xl font-black text-gray-900">¥0<span className="text-base font-normal text-gray-400">/月</span></p>
          <ul className="mt-4 space-y-2">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex justify-between text-sm">
                <span className="text-gray-600">{f.label}</span>
                <span className="font-medium text-gray-700">{f.free}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro カード */}
        <div className="rounded-2xl border-2 border-indigo-500 bg-white p-6 shadow-lg shadow-indigo-100/50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Pro</p>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">おすすめ</span>
          </div>
          <p className="mt-1 text-3xl font-black text-gray-900">¥980<span className="text-base font-normal text-gray-400">/月</span></p>
          <ul className="mt-4 space-y-2">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex justify-between text-sm">
                <span className="text-gray-600">{f.label}</span>
                <span className="font-semibold text-indigo-600">{f.pro}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8">
        {plan === "pro" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              解約・支払い方法の変更は Stripe 管理画面からおこなえます。
            </p>
            <PortalButton />
          </div>
        ) : (
          <UpgradeButton />
        )}
      </div>
    </main>
  );
}
