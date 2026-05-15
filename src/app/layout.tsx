import type { Metadata } from "next";
import { GtmScript } from "./_components/GtmScript";
import { ConditionalHeader } from "./_components/ConditionalHeader";
import { ConditionalFooter } from "./_components/ConditionalFooter";
import { getSession } from "@/features/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "〆トラ",
  description: "締切を登録して、締切前にメール通知で出し忘れを防ぐ就活管理サービス",
  metadataBase: new URL(
    process.env.APP_URL ?? "https://shimetra.com",
  ),
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="ja">
      <body className="font-sans flex min-h-screen flex-col">
        {/* GTM スクリプト: body 先頭に配置（noscript フォールバック含む） */}
        <GtmScript />
        {session && <ConditionalHeader email={session.email} />}
        <div className="flex-1">{children}</div>
        <ConditionalFooter />
      </body>
    </html>
  );
}
