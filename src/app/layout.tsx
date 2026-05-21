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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var d=document.documentElement;if(localStorage.getItem("portfolio-dark-mode")==="light"){d.classList.remove("dark")}else{d.classList.add("dark")}}catch(e){}})()`
        }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
