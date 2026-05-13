import Image from "next/image";
import { LP_CONTENT } from "./content";
import { LpPageViewTracker } from "./LpPageViewTracker";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { BenefitSection } from "./BenefitSection";
import { DifferenceSection } from "./DifferenceSection";
import { BetaCtaSection } from "./BetaCtaSection";
import { LeadCaptureDialog } from "./LeadCaptureDialog";

/**
 * LP全体レイアウトを束ねる Server Component
 * デザイン方針: docs/DESIGN_SYSTEM.md 参照（Indigoブランドカラー）
 */
export function LandingPage() {
  const { hero } = LP_CONTENT;

  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="〆トラ ロゴ"
              width={72}
              height={72}
              className="rounded-sm"
            />
            <span className="text-lg font-semibold text-gray-900">
              〆トラ
            </span>
          </div>
          <LeadCaptureDialog label={hero.ctaLabel} ctaLocation="hero" />
        </div>
      </header>

      {/* LP 表示イベント計測（UI なし） */}
      <LpPageViewTracker />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <BenefitSection />
        <DifferenceSection />
        <BetaCtaSection />
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
        © 2026 〆トラ
      </footer>
    </div>
  );
}
