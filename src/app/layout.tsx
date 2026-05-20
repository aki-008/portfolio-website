import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";

import { RESUME_DATA } from "../data/resume-data";
import { Providers } from "./providers";

import "./globals.css";

export const metadata = {
  title: `${RESUME_DATA.name}`,
  description: RESUME_DATA.summary,
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
