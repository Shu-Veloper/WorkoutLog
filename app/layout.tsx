import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocaleProvider, type Locale } from "@/contexts/LocaleContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkoutLog - トレーニング記録管理",
  description: "簡単なトレーニング記録と統計管理アプリ",
};

// 지원하는 locale인지 확인
function isValidLocale(value: string | undefined): value is Locale {
  return value === "ja" || value === "en" || value === "ko";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 쿠키 읽기 (Edge middleware에서 설정한 값)
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const initialLocale: Locale = isValidLocale(localeCookie) ? localeCookie : "ja";

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider initialLocale={initialLocale}>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
