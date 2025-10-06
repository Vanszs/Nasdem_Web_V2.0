import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./admin/providers";

export const metadata: Metadata = {
  title: "Nasdem Website",
  description: "Nasdem Website",
  generator: "Nasdem Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} scheme-dark`}
      suppressHydrationWarning
    >
      <body
        style={{ fontFamily: GeistSans.style.fontFamily }}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
