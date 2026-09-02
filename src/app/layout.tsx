import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "meet-room · 회의실 예약",
  description: "오늘 비어 있는 회의실을 한 화면에서 보고 바로 잡습니다.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
