import "./globals.css";
import localFont from "next/font/local";

import type { Metadata } from "next";
import { Lilita_One, Jua } from "next/font/google";

const freesentation = localFont({
  src: "../../public/fonts/FreesentationVF.ttf",
  variable: "--font-freesentation",
});

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cocoa",
});

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cute",
});

export const metadata: Metadata = {
  title: "COCOA",
  description: "오직 당신을 위한 화장품을 찾아주는 COCOA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${freesentation.className} ${lilita.variable} ${jua.variable}`}
      >
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
