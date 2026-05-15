import type { Metadata } from "next";
import { HomePageClient } from "./_components/HomePageClient";

const TITLE = "〆トラ — 締切ミスを、もうしない。";
const DESCRIPTION =
  "ES・説明会・面接の締切を一元管理し、締切前にメールで通知。就活の出し忘れを防ぎます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "〆トラ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
