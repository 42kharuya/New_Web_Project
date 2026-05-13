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
    images: [
      {
        url: "/ogp-lp.png",
        width: 1200,
        height: 630,
        alt: "〆トラ — 締切ミスを、もうしない。",
      },
    ],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/ogp-lp.png"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
